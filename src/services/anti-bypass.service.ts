import { ClubRole } from '@prisma/client';
import { AuthenticatedUser } from '../types/auth.types.js';
import { prisma } from '../index.js';

export class AntiBypassService {
  /**
   * Enforces Strict Single-Supervisor Dispatch:
   * Verifies that the recipient of an approval workflow is the direct supervisor of the sender.
   * Direct submissions to higher executives skipping intermediate supervisors are rejected.
   */
  static async verifyDirectSupervisorDispatch(
    sender: AuthenticatedUser,
    targetSupervisorRoleId: string
  ): Promise<void> {
    const senderRole = sender.activeRole;
    if (!senderRole) {
      const err = new Error('Hierarchical Error: User has no active role assignment.');
      (err as any).statusCode = 400;
      throw err;
    }

    // Tier 1 (Faculty Advisor) has no supervisor
    if (senderRole.tierLevel === 1) {
      return;
    }

    if (!senderRole.supervisorId) {
      const err = new Error(`Chain-of-Command Violation: Active role "${senderRole.role}" has no designated supervisor.`);
      (err as any).statusCode = 400;
      throw err;
    }

    // Verify targetSupervisorRoleId matches the direct immediate supervisor
    if (senderRole.supervisorId !== targetSupervisorRoleId) {
      // Find the attempted recipient's role for descriptive error
      const attemptedTarget = await prisma.roleAssignment.findUnique({
        where: { id: targetSupervisorRoleId },
      });

      const err = new Error(
        `Chain-of-Command Anti-Bypass Violation (Section 1 & 5): Direct submission to "${
          attemptedTarget?.role || 'Unknown'
        }" is prohibited. Submissions must be routed strictly to immediate direct supervisor.`
      );
      (err as any).statusCode = 403;
      throw err;
    }
  }

  /**
   * Enforces Mandatory Written Rejection Justification:
   * Any rejection of a requisition, proposal, or leave application must contain a non-empty written reason.
   */
  static validateRejectionReason(reason: string | undefined | null): string {
    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      const err = new Error('Constitutional Violation: A mandatory non-empty written justification is required for any administrative rejection.');
      (err as any).statusCode = 400;
      throw err;
    }
    return reason.trim();
  }

  /**
   * Enforces Dual-Recipient Resignation Routing (Section 6):
   * When Dept Heads, VP, or Treasurer initiate resignation, both President and General Secretary must be bound simultaneously.
   */
  static computeResignationRecipients(
    role: ClubRole,
    presidentUserId: string,
    gsUserId: string,
    advisorUserId: string
  ): {
    presidentRecipientId: string | null;
    gsRecipientId: string | null;
    advisorRecipientId: string | null;
  } {
    // Dept Heads, VP, and Treasurer submit simultaneously to President and GS
    if (
      role === ClubRole.VICE_PRESIDENT ||
      role === ClubRole.TREASURER ||
      role === ClubRole.DEPT_HEAD_MUSIC_PERFORMANCE ||
      role === ClubRole.DEPT_HEAD_EVENT_LOGISTICS ||
      role === ClubRole.DEPT_HEAD_MEDIA_DESIGN ||
      role === ClubRole.DEPT_HEAD_MEMBER_MANAGEMENT ||
      role === ClubRole.DEPT_HEAD_SPONSORSHIP_PARTNERSHIP
    ) {
      return {
        presidentRecipientId: presidentUserId,
        gsRecipientId: gsUserId,
        advisorRecipientId: null,
      };
    }

    // General Secretary submits to President (with Advisor notified)
    if (role === ClubRole.GENERAL_SECRETARY) {
      return {
        presidentRecipientId: presidentUserId,
        gsRecipientId: null,
        advisorRecipientId: advisorUserId,
      };
    }

    // President submits to Faculty Advisor (with EB notified)
    if (role === ClubRole.PRESIDENT || role === ClubRole.ACTING_PRESIDENT) {
      return {
        presidentRecipientId: null,
        gsRecipientId: null,
        advisorRecipientId: advisorUserId,
      };
    }

    // Tier 5 subordinates submit to their Dept Head (or GS)
    return {
      presidentRecipientId: null,
      gsRecipientId: gsUserId,
      advisorRecipientId: null,
    };
  }
}
