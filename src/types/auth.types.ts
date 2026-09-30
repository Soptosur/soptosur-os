import { ClubRole, DepartmentType, MembershipStanding } from '@prisma/client';

export type PermissionScope =
  // Executive Body Scopes
  | 'FINANCIAL_TIER_1_APPROVE'
  | 'FINANCIAL_TIER_2_APPROVE'
  | 'FINANCIAL_TIER_3_APPROVE'
  | 'DISCIPLINARY_CONVENE'
  | 'MEETING_NOTICE_ISSUE'
  | 'OFFICIAL_REPRESENTATIONAL_SIGN'
  // Creative Scopes (Firewalled)
  | 'CREATIVE_ARRANGEMENT_MUTATE'
  | 'CREATIVE_CASTING_MUTATE'
  | 'CREATIVE_READ_ONLY'
  // Audit Scopes
  | 'AUDIT_INSPECT_ONLY'
  | 'AUDIT_REPORT_SUBMIT'
  // General Member Scopes
  | 'VOTE_BALLOT'
  | 'PETITION_SIGN'
  | 'LEAVE_SUBMIT'
  | 'REQUISITION_CREATE';

export interface ActiveRoleContext {
  id: string;
  role: ClubRole;
  tierLevel: number;
  department: DepartmentType;
  supervisorId: string | null;
  isActing: boolean;
  isIncumbentLocked?: boolean;
}

export interface AuthenticatedUser {
  id: string;
  studentId: string | null;
  nsuEmail: string;
  legalName: string;
  standing: MembershipStanding;
  tokenVersion: number;
  activeRole: ActiveRoleContext | null;
}

export interface JwtTokenPayload {
  userId: string;
  studentId: string | null;
  nsuEmail: string;
  standing: MembershipStanding;
  tokenVersion: number;
  tierLevel: number;
  role: ClubRole;
  department: DepartmentType;
  isActing: boolean;
}

export interface AuditMetadata {
  action: string;
  targetEntity: string;
  targetEntityId: string;
  previousState?: any;
  newState?: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      auditMetadata?: AuditMetadata;
    }
  }
}
