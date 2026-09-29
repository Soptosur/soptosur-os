import { ClubRole, ComplaintRecipient } from '@prisma/client';
import crypto from 'crypto';
import { AuthenticatedUser } from '../types/auth.types.js';

export class WhistleblowerService {
  /**
   * Generates a cryptographically random, anonymous tracking code for whistleblowers
   */
  static generateTrackingCode(): string {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `SHAPTA-GRV-${randomHex}`;
  }

  /**
   * Computes the automated routing destination based on the accused individual's station (Section 10)
   */
  static resolveRoutingDestination(accusedRole: ClubRole): ComplaintRecipient {
    // 1. Department Head -> Supervising Executive Officer
    if (
      accusedRole === ClubRole.DEPT_HEAD_MUSIC_PERFORMANCE ||
      accusedRole === ClubRole.DEPT_HEAD_EVENT_LOGISTICS ||
      accusedRole === ClubRole.DEPT_HEAD_MEDIA_DESIGN ||
      accusedRole === ClubRole.DEPT_HEAD_MEMBER_MANAGEMENT ||
      accusedRole === ClubRole.DEPT_HEAD_SPONSORSHIP_PARTNERSHIP
    ) {
      return ComplaintRecipient.SUPERVISING_EXECUTIVE;
    }

    // 2. Vice President or Treasurer -> Joint review by President and General Secretary
    if (accusedRole === ClubRole.VICE_PRESIDENT || accusedRole === ClubRole.TREASURER) {
      return ComplaintRecipient.PRESIDENT_AND_GS;
    }

    // 3. General Secretary -> Joint review by President and Vice President
    if (accusedRole === ClubRole.GENERAL_SECRETARY) {
      return ComplaintRecipient.PRESIDENT_AND_VP;
    }

    // 4. President -> Strictly and exclusively to Faculty Advisor (EB is blinded!)
    if (accusedRole === ClubRole.PRESIDENT || accusedRole === ClubRole.ACTING_PRESIDENT) {
      return ComplaintRecipient.FACULTY_ADVISOR_TRIBUNAL;
    }

    // 5. Faculty Advisor -> Joint digital signatures of 3 EB officers dispatched to NSU OSA
    if (accusedRole === ClubRole.FACULTY_ADVISOR) {
      return ComplaintRecipient.NSU_OSA_PROCTORIAL;
    }

    // Default for general members or coordinators
    return ComplaintRecipient.SUPERVISING_EXECUTIVE;
  }

  /**
   * Enforces Query-Level Blinding (Section 10):
   * Executive Body members cannot inspect complaint dossiers where the President is accused.
   * Only the Faculty Advisor (Tier 1) can view dossiers where the President is accused.
   */
  static applyQueryBlindingFilter(user: AuthenticatedUser): any {
    const roleCtx = user.activeRole;
    if (!roleCtx) {
      return { id: 'impossible-query-filter' }; // Deny all
    }

    // Faculty Advisor (Tier 1) has complete oversight over all complaints
    if (roleCtx.tierLevel === 1) {
      return {}; // No filter, full access
    }

    // Executive Body members (President, VP, GS, Treasurer - Tiers 2 & 3)
    if (roleCtx.tierLevel === 2 || roleCtx.tierLevel === 3) {
      return {
        NOT: {
          accusedRole: {
            in: [ClubRole.PRESIDENT, ClubRole.ACTING_PRESIDENT],
          },
        },
      };
    }

    // Department Heads (Tier 4) can only view complaints routed to their department
    if (roleCtx.tierLevel === 4) {
      return {
        routingDestination: ComplaintRecipient.SUPERVISING_EXECUTIVE,
        accused: {
          roleAssignments: {
            some: {
              department: roleCtx.department,
              isActive: true,
            },
          },
        },
      };
    }

    // General members can only view their own non-anonymous complaints
    return {
      complainantId: user.id,
      isAnonymous: false,
    };
  }
}
