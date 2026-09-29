import { ClubRole, DepartmentType } from '@prisma/client';
import { AuthenticatedUser, PermissionScope } from '../types/auth.types.js';

export class RbacService {
  /**
   * Evaluates if an authenticated user possesses the required permission scope
   */
  static hasScope(user: AuthenticatedUser, scope: PermissionScope): boolean {
    const roleCtx = user.activeRole;
    if (!roleCtx) return false;

    // Check Concurrency Lock: If user is incumbent but locked due to active acting officer
    if (roleCtx.isIncumbentLocked) {
      return false;
    }

    const { role, tierLevel, department, isActing } = roleCtx;

    switch (scope) {
      // --- Executive Body Financial Scopes ---
      case 'FINANCIAL_TIER_1_APPROVE':
        // Dual sign: General Secretary & Treasurer
        return (
          role === ClubRole.GENERAL_SECRETARY ||
          role === ClubRole.TREASURER ||
          (isActing && (role === ClubRole.ACTING_OFFICER || role === ClubRole.ACTING_PRESIDENT))
        );

      case 'FINANCIAL_TIER_2_APPROVE':
        // Dual sign: President & Treasurer
        return (
          role === ClubRole.PRESIDENT ||
          role === ClubRole.TREASURER ||
          (isActing && (role === ClubRole.ACTING_PRESIDENT || role === ClubRole.ACTING_OFFICER))
        );

      case 'FINANCIAL_TIER_3_APPROVE':
        // Requires Faculty Advisor clearance
        return role === ClubRole.FACULTY_ADVISOR;

      case 'DISCIPLINARY_CONVENE':
        // Tier 1 (Advisor) or Tier 2/3 (President / GS)
        return tierLevel <= 3 && (role === ClubRole.PRESIDENT || role === ClubRole.GENERAL_SECRETARY || role === ClubRole.FACULTY_ADVISOR);

      case 'MEETING_NOTICE_ISSUE':
        // Tier 2 / 3 (President, VP, GS)
        return tierLevel <= 3 && (role === ClubRole.PRESIDENT || role === ClubRole.VICE_PRESIDENT || role === ClubRole.GENERAL_SECRETARY);

      case 'OFFICIAL_REPRESENTATIONAL_SIGN':
        return tierLevel <= 2; // Advisor or President

      // --- Creative Autonomy Firewall Scopes ---
      case 'CREATIVE_ARRANGEMENT_MUTATE':
      case 'CREATIVE_CASTING_MUTATE':
        // STRICT FIREWALL: Only Tier 4/5 members within Music & Performance Department!
        return department === DepartmentType.MUSIC_AND_PERFORMANCE && (tierLevel === 4 || tierLevel === 5);

      case 'CREATIVE_READ_ONLY':
        // Read-only is accessible to all members including EB and Advisor
        return true;

      // --- Independent Auditor Scopes ---
      case 'AUDIT_INSPECT_ONLY':
      case 'AUDIT_REPORT_SUBMIT':
        return true; // Neutral auditors or advisor

      // --- General Scopes ---
      case 'VOTE_BALLOT':
      case 'PETITION_SIGN':
      case 'LEAVE_SUBMIT':
      case 'REQUISITION_CREATE':
        return user.standing === 'ACTIVE';

      default:
        return false;
    }
  }

  /**
   * Asserts user satisfies minimum tier level (Tier 1 is highest, Tier 5 is lowest)
   */
  static requireTier(user: AuthenticatedUser, maxTierAllowed: number): void {
    const userTier = user.activeRole?.tierLevel ?? 5;
    if (userTier > maxTierAllowed) {
      const err = new Error(`Hierarchical RBAC Violation: This action requires Tier ${maxTierAllowed} or higher authority. User is Tier ${userTier}.`);
      (err as any).statusCode = 403;
      throw err;
    }
  }

  /**
   * Asserts user holds one of the specified roles
   */
  static requireRole(user: AuthenticatedUser, allowedRoles: ClubRole[]): void {
    const userRole = user.activeRole?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      const err = new Error(`Hierarchical RBAC Violation: Required role [${allowedRoles.join(', ')}]. User possesses [${userRole || 'NONE'}].`);
      (err as any).statusCode = 403;
      throw err;
    }
  }

  /**
   * Enforces Creative Autonomy Firewall (Section 12):
   * Write/mutate operations are strictly blocked for all users outside the Music & Performance Department.
   */
  static enforceCreativeFirewall(user: AuthenticatedUser): void {
    const roleCtx = user.activeRole;
    if (!roleCtx || roleCtx.department !== DepartmentType.MUSIC_AND_PERFORMANCE) {
      const err = new Error('Creative Autonomy Firewall Violation (Section 12): Only active members of the Music & Performance Department hold mutate/write rights over artistic arrangements and repertoire.');
      (err as any).statusCode = 403;
      throw err;
    }
  }

  /**
   * Enforces Neutral Auditor Boundary:
   * Independent Auditors hold strictly read-only inspection access; they have zero operational execution rights across other departments.
   */
  static enforceAuditorBoundary(isAuditor: boolean, attemptingOperationalAction: boolean): void {
    if (isAuditor && attemptingOperationalAction) {
      const err = new Error('Constitutional Invariant Violation (Section 9): Independent Auditors are legally restricted to read-only financial inspection and cannot execute departmental operations.');
      (err as any).statusCode = 403;
      throw err;
    }
  }
}
