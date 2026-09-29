export type GovernanceTier = 1 | 2 | 3 | 4 | 5;

export interface GovernanceUser {
  id: string;
  legalName: string;
  email: string;
  studentId: string;
  tier: GovernanceTier;
  tierLabel: string;
  roleTitle: string;
  department: string;
  isActing: boolean;
  actingRole?: string;
  isCreativeLead?: boolean;
  permissions: string[];
}

export interface WhistleblowerDossier {
  id: string;
  trackingNumber: string;
  targetRole: string;
  targetName: string;
  allegationType: "FINANCIAL_MISCONDUCT" | "ABUSE_OF_POWER" | "ELECTION_TAMPERING" | "HARASSMENT";
  summary: string;
  evidenceCount: number;
  submittedAt: string;
  status: "CONFIDENTIAL_REVIEW" | "PANEL_CONVOKED" | "RESOLVED" | "DISMISSED";
  isAgainstPresident: boolean;
}

export interface FinancialRequisition {
  id: string;
  requisitionNumber: string;
  tier: 1 | 2 | 3;
  requestedBy: string;
  initiatorRole: string;
  department: string;
  amountBDT: number;
  purpose: string;
  vendorName: string;
  hasEBResolution: boolean;
  status: "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "DISBURSED" | "VOUCHER_PENDING" | "SETTLED";
  signatures: {
    gsSigned?: boolean;
    gsName?: string;
    treasurerSigned?: boolean;
    treasurerName?: string;
    presidentSigned?: boolean;
    presidentName?: string;
    advisorSigned?: boolean;
    advisorName?: string;
  };
  disbursedAt?: string;
  voucherDeadlineHours?: number; // 72h countdown
  createdAt: string;
}

export interface SongArrangement {
  id: string;
  title: string;
  genre: string;
  tempoBpm: number;
  keySignature: string;
  leadVocal: string;
  harmonies: string[];
  instrumentation: string[];
  status: "DRAFT" | "REHEARSAL_READY" | "LOCKED_FOR_CONCERT";
  section12Protected: boolean;
  lastEditedBy: string;
}

export interface AttendanceRecord {
  memberId: string;
  memberName: string;
  studentId: string;
  totalSessions: number;
  attendedSessions: number;
  excusedLeaves: number;
  effectivePercentage: number;
  consecutiveAbsences: number;
  showCauseIssued: boolean;
  status: "IN_GOOD_STANDING" | "AT_RISK" | "DISQUALIFIED_FROM_VOTING";
}

export interface ParliamentaryAgendaItem {
  id: string;
  agendaCode: string;
  title: string;
  description: string;
  category: "BUDGET_RATIFICATION" | "CONSTITUTIONAL_AMENDMENT" | "ELECTION_CODE" | "EVENT_RESOLUTION";
  activeQuorumPercentage: number;
  floorQuorumThreshold: number; // 33%
  status: "OPEN" | "CLOSED" | "RECUSED";
  votesInFavor: number;
  votesAgainst: number;
  abstentions: number;
  conflictedMembers: string[]; // member IDs who must recuse
}

export interface DigitalPetition {
  id: string;
  code: string;
  title: string;
  description: string;
  category: "EGM_CONVOCATION" | "NO_CONFIDENCE_MOTION" | "POLICY_REVISION";
  targetThresholdPercentage: number; // 25% of active members
  currentSignatures: number;
  totalEligibleMembers: number;
  status: "ACTIVE" | "THRESHOLD_REACHED" | "CONVOKED";
  signedByUser: boolean;
  deadline: string;
}
