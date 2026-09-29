-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "MembershipStanding" AS ENUM ('ACTIVE', 'PROBATIONARY', 'SUSPENDED', 'ALUMNI', 'RESIGNED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "ClubRole" AS ENUM ('FACULTY_ADVISOR', 'PRESIDENT', 'ACTING_PRESIDENT', 'VICE_PRESIDENT', 'GENERAL_SECRETARY', 'TREASURER', 'ACTING_OFFICER', 'DEPT_HEAD_MUSIC_PERFORMANCE', 'DEPT_HEAD_EVENT_LOGISTICS', 'DEPT_HEAD_MEDIA_DESIGN', 'DEPT_HEAD_MEMBER_MANAGEMENT', 'DEPT_HEAD_SPONSORSHIP_PARTNERSHIP', 'COORDINATOR', 'GENERAL_MEMBER');

-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('EXECUTIVE', 'MUSIC_AND_PERFORMANCE', 'EVENT_AND_LOGISTICS', 'MEDIA_AND_DESIGN', 'MEMBER_MANAGEMENT_AND_DISCIPLINE', 'SPONSORSHIP_AND_PARTNERSHIP', 'GENERAL');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('REHEARSAL', 'EXECUTIVE_MEETING', 'GENERAL_MEETING', 'COORDINATION_MEETING', 'OFFICIAL_EVENT', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ADJOURNED');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT_UNEXCUSED', 'EXCUSED_LEAVE');

-- CreateEnum
CREATE TYPE "LeaveReasonType" AS ENUM ('ACADEMIC_EXAM', 'MEDICAL_EMERGENCY', 'FAMILY_EMERGENCY', 'OFFICIAL_UNIVERSITY_DUTY');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RosterSnapshotType" AS ENUM ('FOUNDER_INITIAL', 'WEEK_4_INTERIM', 'POST_DISPUTE_FINAL', 'SEMESTER_END_FINAL');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW_GS', 'ESCALATED_TO_ADVISOR', 'RESOLVED_APPROVED', 'RESOLVED_REJECTED');

-- CreateEnum
CREATE TYPE "DisciplinaryType" AS ENUM ('SHOW_CAUSE_ABSENCE', 'SHOW_CAUSE_CONDUCT', 'EXECUTIVE_SHOW_CAUSE', 'DEPT_HEAD_REMOVAL_NOTICE', 'SUSPENSION', 'EXPULSION');

-- CreateEnum
CREATE TYPE "DisciplinaryVerdict" AS ENUM ('PENDING', 'EXONERATED', 'WARNING', 'PROBATION', 'SUSPENDED', 'OFFICE_VACATED', 'EXPELLED');

-- CreateEnum
CREATE TYPE "DepositType" AS ENUM ('SPONSORSHIP', 'TICKET_REVENUE', 'NSU_ALLOCATION', 'DONATION_GRANT');

-- CreateEnum
CREATE TYPE "FinancialTier" AS ENUM ('TIER_1', 'TIER_2', 'TIER_3');

-- CreateEnum
CREATE TYPE "DisbursementType" AS ENUM ('CASH_PETTY', 'BANK_CHECK', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "RequisitionCategory" AS ENUM ('PERFORMANCE_PRODUCTION', 'EVENT_LOGISTICS', 'MEDIA_PROMOTION', 'LOGISTICS_FOOD', 'ASSET_PURCHASE', 'MISCELLANEOUS');

-- CreateEnum
CREATE TYPE "RequisitionStatus" AS ENUM ('DRAFT', 'PENDING_GS_TREASURER', 'PENDING_PRESIDENT', 'PENDING_ADVISOR', 'APPROVED_PENDING_DISBURSEMENT', 'DISBURSED', 'VOUCHER_PENDING', 'COMPLETED', 'REJECTED', 'FROZEN_DEFAULT');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'SIGNED_AND_FINALIZED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('GBM', 'EGM', 'EB_MONTHLY', 'COORDINATION_MONTHLY', 'EMERGENCY_EB');

-- CreateEnum
CREATE TYPE "MotionType" AS ENUM ('REGULAR_RESOLUTION', 'PROCEDURAL_AMENDMENT', 'PROTECTED_CONSTITUTIONAL_AMENDMENT', 'OFFICER_REMOVAL', 'CLUB_DISSOLUTION', 'BUDGET_APPROVAL');

-- CreateEnum
CREATE TYPE "VoteOption" AS ENUM ('IN_FAVOR', 'AGAINST', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "PetitionType" AS ENUM ('CALL_EGM', 'NO_CONFIDENCE_MOTION', 'SPECIAL_INQUIRY');

-- CreateEnum
CREATE TYPE "PetitionStatus" AS ENUM ('COLLECTING_SIGNATURES', 'THRESHOLD_MET_PENDING_NOTICE', 'NOTICE_ISSUED_BY_LEADERSHIP', 'ESCALATED_TO_ADVISOR', 'CONVENED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ResignationStatus" AS ENUM ('NOTICE_SUBMITTED', 'IN_NOTICE_PERIOD', 'HANDOVER_PENDING', 'ACCEPTED_AND_EFFECTIVE', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "TransitionStatus" AS ENUM ('HANDOVER_STATE_ACTIVE', 'HANDOVER_COMPLETED', 'HANDOVER_DISPUTED');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('EXCELLENT', 'GOOD', 'NEEDS_REPAIR', 'DAMAGED', 'LOST');

-- CreateEnum
CREATE TYPE "ComplaintRecipient" AS ENUM ('SUPERVISING_EXECUTIVE', 'PRESIDENT_AND_GS', 'PRESIDENT_AND_VP', 'FACULTY_ADVISOR_TRIBUNAL', 'NSU_OSA_PROCTORIAL');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('SUBMITTED', 'ROUTED', 'TRIBUNAL_FORMED', 'UNDER_INVESTIGATION', 'DISPOSED_RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "OrganizationConfig" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "clubTitle" TEXT NOT NULL DEFAULT 'Soptosur - The Musical Club of NSU',
    "osaApprovalDate" TIMESTAMP(3),
    "charterVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "isPettyCashFrozen" BOOLEAN NOT NULL DEFAULT false,
    "pettyCashFrozenAt" TIMESTAMP(3),
    "pettyCashFrozenReason" TEXT,
    "bankBalance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "pettyCashBalance" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "tier1MaxAmount" DECIMAL(12,2) NOT NULL DEFAULT 2000.00,
    "tier2MaxAmount" DECIMAL(12,2) NOT NULL DEFAULT 20000.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Semester" (
    "id" TEXT NOT NULL,
    "semesterCode" TEXT NOT NULL,
    "academicYear" INTEGER NOT NULL,
    "termName" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "week4LockDate" TIMESTAMP(3) NOT NULL,
    "disputeWindowEndDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "nsuEmail" TEXT NOT NULL,
    "legalName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "cgpa" DECIMAL(3,2) NOT NULL,
    "completedSemesters" INTEGER NOT NULL DEFAULT 0,
    "hasProctorialClearance" BOOLEAN NOT NULL DEFAULT true,
    "standing" "MembershipStanding" NOT NULL DEFAULT 'ACTIVE',
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "tokenVersion" INTEGER NOT NULL DEFAULT 1,
    "joinedSemesterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ClubRole" NOT NULL,
    "tierLevel" INTEGER NOT NULL,
    "department" "DepartmentType" NOT NULL,
    "supervisorId" TEXT,
    "termCount" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActing" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "department" "DepartmentType",
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL DEFAULT 60,
    "location" TEXT NOT NULL,
    "isOfficial" BOOLEAN NOT NULL DEFAULT true,
    "status" "EventStatus" NOT NULL DEFAULT 'SCHEDULED',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttendanceRecord" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PRESENT',
    "checkInTime" TIMESTAMP(3),
    "leaveApplicationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "reason" "LeaveReasonType" NOT NULL,
    "description" TEXT NOT NULL,
    "documentAttachmentUrl" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewerId" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveRosterSnapshot" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "snapshotType" "RosterSnapshotType" NOT NULL,
    "totalOfficialEvents" INTEGER NOT NULL,
    "attendedEvents" INTEGER NOT NULL,
    "authorizedLeaves" INTEGER NOT NULL,
    "effectiveDenominator" INTEGER NOT NULL,
    "attendancePercentage" DECIMAL(5,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveRosterSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RosterDispute" (
    "id" TEXT NOT NULL,
    "rosterSnapshotId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimDescription" TEXT NOT NULL,
    "evidenceDocumentUrls" TEXT[],
    "filedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "windowClosesAt" TIMESTAMP(3) NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'SUBMITTED',
    "generalSecretaryReviewerId" TEXT,
    "gsReviewedAt" TIMESTAMP(3),
    "facultyAdvisorReviewerId" TEXT,
    "advisorReviewedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RosterDispute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisciplinaryAction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedById" TEXT NOT NULL,
    "type" "DisciplinaryType" NOT NULL,
    "reason" TEXT NOT NULL,
    "consecutiveAbsencesCount" INTEGER,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appealDeadline" TIMESTAMP(3) NOT NULL,
    "tribunalDeadline" TIMESTAMP(3) NOT NULL,
    "appealStatement" TEXT,
    "appealSubmittedAt" TIMESTAMP(3),
    "tribunalHearingDate" TIMESTAMP(3),
    "tribunalFindings" TEXT,
    "verdict" "DisciplinaryVerdict" NOT NULL DEFAULT 'PENDING',
    "verdictEnactedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisciplinaryAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialDeposit" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "depositType" "DepositType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "sourceName" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "receiptDocumentUrl" TEXT NOT NULL,
    "depositedAt" TIMESTAMP(3) NOT NULL,
    "filedById" TEXT NOT NULL,
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialRequisition" (
    "id" TEXT NOT NULL,
    "requisitionNumber" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "RequisitionCategory" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "tier" "FinancialTier" NOT NULL,
    "disbursementType" "DisbursementType" NOT NULL,
    "purpose" TEXT NOT NULL,
    "beneficiaryPayee" TEXT NOT NULL,
    "filedById" TEXT NOT NULL,
    "generalSecretarySignerId" TEXT,
    "generalSecretaryApprovedAt" TIMESTAMP(3),
    "treasurerSignerId" TEXT,
    "treasurerApprovedAt" TIMESTAMP(3),
    "presidentSignerId" TEXT,
    "presidentApprovedAt" TIMESTAMP(3),
    "facultyAdvisorSignerId" TEXT,
    "facultyAdvisorApprovedAt" TIMESTAMP(3),
    "ebResolutionDocUrl" TEXT,
    "status" "RequisitionStatus" NOT NULL DEFAULT 'DRAFT',
    "disbursedAt" TIMESTAMP(3),
    "voucherDeadline" TIMESTAMP(3),
    "voucherUrls" TEXT[],
    "voucherUploadedAt" TIMESTAMP(3),
    "voucherVerifiedAt" TIMESTAMP(3),
    "isPettyCashFrozenTriggered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialRequisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditReport" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "auditor1Id" TEXT NOT NULL,
    "auditor2Id" TEXT NOT NULL,
    "advisorSignerId" TEXT,
    "termStartDate" TIMESTAMP(3) NOT NULL,
    "termEndDate" TIMESTAMP(3) NOT NULL,
    "totalInflows" DECIMAL(12,2) NOT NULL,
    "totalOutflows" DECIMAL(12,2) NOT NULL,
    "closingBankBalance" DECIMAL(12,2) NOT NULL,
    "closingPettyCashBalance" DECIMAL(12,2) NOT NULL,
    "discrepancyAmount" DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    "auditFindingsSummary" TEXT NOT NULL,
    "irregularitiesNotes" TEXT,
    "reportDocumentUrl" TEXT NOT NULL,
    "advisorSignedAt" TIMESTAMP(3),
    "status" "AuditStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MeetingType" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "adjournedToDate" TIMESTAMP(3),
    "adjournedFromMeetingId" TEXT,
    "location" TEXT NOT NULL,
    "activeMembersAtCall" INTEGER NOT NULL,
    "attendeesCount" INTEGER NOT NULL DEFAULT 0,
    "quorumPercentageRequired" DECIMAL(5,2) NOT NULL,
    "floorQuorumPercentageRequired" DECIMAL(5,2) NOT NULL DEFAULT 33.00,
    "isQuorumMet" BOOLEAN NOT NULL DEFAULT false,
    "isFloorQuorumMet" BOOLEAN NOT NULL DEFAULT false,
    "isAdjournedDueToQuorum" BOOLEAN NOT NULL DEFAULT false,
    "chairpersonId" TEXT,
    "minutesDocUrl" TEXT,
    "minutesApprovedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingAttendance" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isPhysicalPresence" BOOLEAN NOT NULL DEFAULT true,
    "isActiveMemberAtMeeting" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeetingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motion" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "motionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "motionType" "MotionType" NOT NULL,
    "proposerId" TEXT NOT NULL,
    "seconderId" TEXT,
    "requiresSupermajority" BOOLEAN NOT NULL DEFAULT false,
    "requiresFloorQuorum" BOOLEAN NOT NULL DEFAULT false,
    "recusedUserIds" TEXT[],
    "inFavorCount" INTEGER NOT NULL DEFAULT 0,
    "againstCount" INTEGER NOT NULL DEFAULT 0,
    "abstainCount" INTEGER NOT NULL DEFAULT 0,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "chairCastingVoteUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ballot" (
    "id" TEXT NOT NULL,
    "motionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" "VoteOption" NOT NULL,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "castAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ballot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectionPanel" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "facultyAdvisorId" TEXT NOT NULL,
    "outgoingPresidentId" TEXT NOT NULL,
    "ebNomineeId" TEXT NOT NULL,
    "alternateNomineeId" TEXT,
    "formationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isAdHocCouncilTriggered" BOOLEAN NOT NULL DEFAULT false,
    "adHocCouncilDurationSemesters" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelectionPanel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExecutiveNomination" (
    "id" TEXT NOT NULL,
    "selectionPanelId" TEXT NOT NULL,
    "ticketName" TEXT NOT NULL,
    "presidentCandidateId" TEXT NOT NULL,
    "vpCandidateId" TEXT NOT NULL,
    "gsCandidateId" TEXT NOT NULL,
    "treasurerCandidateId" TEXT NOT NULL,
    "revisionRound" INTEGER NOT NULL DEFAULT 1,
    "revisionDeadline" TIMESTAMP(3),
    "isGbmApproved" BOOLEAN NOT NULL DEFAULT false,
    "gbmApprovalDate" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExecutiveNomination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petition" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "PetitionType" NOT NULL,
    "statement" TEXT NOT NULL,
    "activeMembersSnapshotCount" INTEGER NOT NULL,
    "requiredSignaturesCount" INTEGER NOT NULL,
    "currentSignaturesCount" INTEGER NOT NULL DEFAULT 0,
    "collectionDeadline" TIMESTAMP(3) NOT NULL,
    "leadershipNoticeDeadline" TIMESTAMP(3),
    "status" "PetitionStatus" NOT NULL DEFAULT 'COLLECTING_SIGNATURES',
    "escalatedToAdvisorAt" TIMESTAMP(3),
    "conveneMeetingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Petition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionSignature" (
    "id" TEXT NOT NULL,
    "petitionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isActiveMemberAtSigning" BOOLEAN NOT NULL DEFAULT true,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "digitalFingerprint" TEXT NOT NULL,

    CONSTRAINT "PetitionSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResignationNotice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ClubRole" NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noticePeriodEnd" TIMESTAMP(3) NOT NULL,
    "presidentRecipientId" TEXT,
    "gsRecipientId" TEXT,
    "advisorRecipientId" TEXT,
    "status" "ResignationStatus" NOT NULL DEFAULT 'NOTICE_SUBMITTED',
    "handoverNotes" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResignationNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouncilTransition" (
    "id" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "outgoingCouncilYear" INTEGER NOT NULL,
    "incomingCouncilYear" INTEGER NOT NULL,
    "transitionDeadline" TIMESTAMP(3) NOT NULL,
    "status" "TransitionStatus" NOT NULL DEFAULT 'HANDOVER_STATE_ACTIVE',
    "bankSignatoriesVerified" BOOLEAN NOT NULL DEFAULT false,
    "bankSignatoriesDocUrl" TEXT,
    "archivesVerified" BOOLEAN NOT NULL DEFAULT false,
    "archivesDocUrl" TEXT,
    "physicalAssetsVerified" BOOLEAN NOT NULL DEFAULT false,
    "physicalAssetsDocUrl" TEXT,
    "clubKeysHandedOver" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CouncilTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubAsset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "condition" "AssetCondition" NOT NULL DEFAULT 'GOOD',
    "custodianDepartment" "DepartmentType" NOT NULL,
    "currentCustodianUserId" TEXT,
    "procuredAt" TIMESTAMP(3),
    "procuredValue" DECIMAL(10,2),
    "lastAuditedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "complainantId" TEXT,
    "accusedUserId" TEXT NOT NULL,
    "accusedRole" "ClubRole" NOT NULL,
    "incidentDescription" TEXT NOT NULL,
    "evidenceUrls" TEXT[],
    "routingDestination" "ComplaintRecipient" NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'SUBMITTED',
    "tribunalFormedAt" TIMESTAMP(3),
    "findingsReport" TEXT,
    "verdictSummary" TEXT,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationPanelMember" (
    "id" TEXT NOT NULL,
    "complaintId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleInPanel" TEXT NOT NULL,
    "appointedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvestigationPanelMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackCatalog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalArtist" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "tempoBpm" INTEGER,
    "scaleKey" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IN_REPERTOIRE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrangement" (
    "id" TEXT NOT NULL,
    "trackCatalogId" TEXT NOT NULL,
    "arrangerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vocalArrangementNotes" TEXT NOT NULL,
    "instrumentalArrangementNotes" TEXT NOT NULL,
    "leadVocalistAssignment" TEXT,
    "instrumentalistsAssignment" TEXT,
    "sheetMusicUrl" TEXT,
    "audioReferenceUrl" TEXT,
    "versionNumber" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "targetEntity" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "diffPayload" JSONB NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Semester_semesterCode_key" ON "Semester"("semesterCode");

-- CreateIndex
CREATE INDEX "Semester_isActive_idx" ON "Semester"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "User_studentId_key" ON "User"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nsuEmail_key" ON "User"("nsuEmail");

-- CreateIndex
CREATE INDEX "User_standing_idx" ON "User"("standing");

-- CreateIndex
CREATE INDEX "User_joinedSemesterId_idx" ON "User"("joinedSemesterId");

-- CreateIndex
CREATE INDEX "RoleAssignment_userId_idx" ON "RoleAssignment"("userId");

-- CreateIndex
CREATE INDEX "RoleAssignment_role_isActive_idx" ON "RoleAssignment"("role", "isActive");

-- CreateIndex
CREATE INDEX "RoleAssignment_department_isActive_idx" ON "RoleAssignment"("department", "isActive");

-- CreateIndex
CREATE INDEX "RoleAssignment_tierLevel_idx" ON "RoleAssignment"("tierLevel");

-- CreateIndex
CREATE INDEX "RoleAssignment_supervisorId_idx" ON "RoleAssignment"("supervisorId");

-- CreateIndex
CREATE INDEX "Event_semesterId_idx" ON "Event"("semesterId");

-- CreateIndex
CREATE INDEX "Event_type_scheduledAt_idx" ON "Event"("type", "scheduledAt");

-- CreateIndex
CREATE INDEX "Event_isOfficial_scheduledAt_idx" ON "Event"("isOfficial", "scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_leaveApplicationId_key" ON "AttendanceRecord"("leaveApplicationId");

-- CreateIndex
CREATE INDEX "AttendanceRecord_userId_status_idx" ON "AttendanceRecord"("userId", "status");

-- CreateIndex
CREATE INDEX "AttendanceRecord_eventId_status_idx" ON "AttendanceRecord"("eventId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_eventId_userId_key" ON "AttendanceRecord"("eventId", "userId");

-- CreateIndex
CREATE INDEX "LeaveApplication_userId_status_idx" ON "LeaveApplication"("userId", "status");

-- CreateIndex
CREATE INDEX "LeaveApplication_status_idx" ON "LeaveApplication"("status");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveApplication_userId_eventId_key" ON "LeaveApplication"("userId", "eventId");

-- CreateIndex
CREATE INDEX "ActiveRosterSnapshot_semesterId_isActive_idx" ON "ActiveRosterSnapshot"("semesterId", "isActive");

-- CreateIndex
CREATE INDEX "ActiveRosterSnapshot_userId_isActive_idx" ON "ActiveRosterSnapshot"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveRosterSnapshot_semesterId_userId_snapshotType_key" ON "ActiveRosterSnapshot"("semesterId", "userId", "snapshotType");

-- CreateIndex
CREATE INDEX "RosterDispute_rosterSnapshotId_idx" ON "RosterDispute"("rosterSnapshotId");

-- CreateIndex
CREATE INDEX "RosterDispute_status_idx" ON "RosterDispute"("status");

-- CreateIndex
CREATE INDEX "DisciplinaryAction_userId_verdict_idx" ON "DisciplinaryAction"("userId", "verdict");

-- CreateIndex
CREATE INDEX "DisciplinaryAction_type_verdict_idx" ON "DisciplinaryAction"("type", "verdict");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialDeposit_referenceNumber_key" ON "FinancialDeposit"("referenceNumber");

-- CreateIndex
CREATE INDEX "FinancialDeposit_semesterId_idx" ON "FinancialDeposit"("semesterId");

-- CreateIndex
CREATE INDEX "FinancialDeposit_depositType_idx" ON "FinancialDeposit"("depositType");

-- CreateIndex
CREATE INDEX "FinancialDeposit_filedById_idx" ON "FinancialDeposit"("filedById");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialRequisition_requisitionNumber_key" ON "FinancialRequisition"("requisitionNumber");

-- CreateIndex
CREATE INDEX "FinancialRequisition_semesterId_status_idx" ON "FinancialRequisition"("semesterId", "status");

-- CreateIndex
CREATE INDEX "FinancialRequisition_tier_status_idx" ON "FinancialRequisition"("tier", "status");

-- CreateIndex
CREATE INDEX "FinancialRequisition_filedById_idx" ON "FinancialRequisition"("filedById");

-- CreateIndex
CREATE INDEX "FinancialRequisition_voucherDeadline_idx" ON "FinancialRequisition"("voucherDeadline");

-- CreateIndex
CREATE UNIQUE INDEX "AuditReport_semesterId_key" ON "AuditReport"("semesterId");

-- CreateIndex
CREATE INDEX "AuditReport_auditor1Id_idx" ON "AuditReport"("auditor1Id");

-- CreateIndex
CREATE INDEX "AuditReport_auditor2Id_idx" ON "AuditReport"("auditor2Id");

-- CreateIndex
CREATE INDEX "AuditReport_status_idx" ON "AuditReport"("status");

-- CreateIndex
CREATE INDEX "Meeting_semesterId_type_idx" ON "Meeting"("semesterId", "type");

-- CreateIndex
CREATE INDEX "Meeting_scheduledAt_idx" ON "Meeting"("scheduledAt");

-- CreateIndex
CREATE INDEX "MeetingAttendance_meetingId_isActiveMemberAtMeeting_idx" ON "MeetingAttendance"("meetingId", "isActiveMemberAtMeeting");

-- CreateIndex
CREATE INDEX "MeetingAttendance_userId_idx" ON "MeetingAttendance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MeetingAttendance_meetingId_userId_key" ON "MeetingAttendance"("meetingId", "userId");

-- CreateIndex
CREATE INDEX "Motion_meetingId_motionType_idx" ON "Motion"("meetingId", "motionType");

-- CreateIndex
CREATE UNIQUE INDEX "Motion_meetingId_motionNumber_key" ON "Motion"("meetingId", "motionNumber");

-- CreateIndex
CREATE INDEX "Ballot_motionId_idx" ON "Ballot"("motionId");

-- CreateIndex
CREATE INDEX "Ballot_userId_idx" ON "Ballot"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Ballot_motionId_userId_key" ON "Ballot"("motionId", "userId");

-- CreateIndex
CREATE INDEX "SelectionPanel_semesterId_idx" ON "SelectionPanel"("semesterId");

-- CreateIndex
CREATE INDEX "ExecutiveNomination_selectionPanelId_idx" ON "ExecutiveNomination"("selectionPanelId");

-- CreateIndex
CREATE INDEX "Petition_status_idx" ON "Petition"("status");

-- CreateIndex
CREATE INDEX "Petition_initiatorId_idx" ON "Petition"("initiatorId");

-- CreateIndex
CREATE INDEX "PetitionSignature_petitionId_idx" ON "PetitionSignature"("petitionId");

-- CreateIndex
CREATE INDEX "PetitionSignature_userId_idx" ON "PetitionSignature"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionSignature_petitionId_userId_key" ON "PetitionSignature"("petitionId", "userId");

-- CreateIndex
CREATE INDEX "ResignationNotice_userId_status_idx" ON "ResignationNotice"("userId", "status");

-- CreateIndex
CREATE INDEX "ResignationNotice_status_idx" ON "ResignationNotice"("status");

-- CreateIndex
CREATE INDEX "CouncilTransition_semesterId_status_idx" ON "CouncilTransition"("semesterId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClubAsset_serialNumber_key" ON "ClubAsset"("serialNumber");

-- CreateIndex
CREATE INDEX "ClubAsset_custodianDepartment_condition_idx" ON "ClubAsset"("custodianDepartment", "condition");

-- CreateIndex
CREATE INDEX "ClubAsset_currentCustodianUserId_idx" ON "ClubAsset"("currentCustodianUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_trackingCode_key" ON "Complaint"("trackingCode");

-- CreateIndex
CREATE INDEX "Complaint_routingDestination_status_idx" ON "Complaint"("routingDestination", "status");

-- CreateIndex
CREATE INDEX "Complaint_accusedUserId_idx" ON "Complaint"("accusedUserId");

-- CreateIndex
CREATE INDEX "InvestigationPanelMember_complaintId_idx" ON "InvestigationPanelMember"("complaintId");

-- CreateIndex
CREATE INDEX "InvestigationPanelMember_userId_idx" ON "InvestigationPanelMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InvestigationPanelMember_complaintId_userId_key" ON "InvestigationPanelMember"("complaintId", "userId");

-- CreateIndex
CREATE INDEX "TrackCatalog_genre_idx" ON "TrackCatalog"("genre");

-- CreateIndex
CREATE INDEX "TrackCatalog_status_idx" ON "TrackCatalog"("status");

-- CreateIndex
CREATE INDEX "Arrangement_trackCatalogId_idx" ON "Arrangement"("trackCatalogId");

-- CreateIndex
CREATE INDEX "Arrangement_arrangerId_idx" ON "Arrangement"("arrangerId");

-- CreateIndex
CREATE INDEX "AuditLog_targetEntity_targetEntityId_idx" ON "AuditLog"("targetEntity", "targetEntityId");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_joinedSemesterId_fkey" FOREIGN KEY ("joinedSemesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "RoleAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttendanceRecord" ADD CONSTRAINT "AttendanceRecord_leaveApplicationId_fkey" FOREIGN KEY ("leaveApplicationId") REFERENCES "LeaveApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveApplication" ADD CONSTRAINT "LeaveApplication_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveRosterSnapshot" ADD CONSTRAINT "ActiveRosterSnapshot_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveRosterSnapshot" ADD CONSTRAINT "ActiveRosterSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RosterDispute" ADD CONSTRAINT "RosterDispute_rosterSnapshotId_fkey" FOREIGN KEY ("rosterSnapshotId") REFERENCES "ActiveRosterSnapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RosterDispute" ADD CONSTRAINT "RosterDispute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RosterDispute" ADD CONSTRAINT "RosterDispute_generalSecretaryReviewerId_fkey" FOREIGN KEY ("generalSecretaryReviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RosterDispute" ADD CONSTRAINT "RosterDispute_facultyAdvisorReviewerId_fkey" FOREIGN KEY ("facultyAdvisorReviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryAction" ADD CONSTRAINT "DisciplinaryAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisciplinaryAction" ADD CONSTRAINT "DisciplinaryAction_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDeposit" ADD CONSTRAINT "FinancialDeposit_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDeposit" ADD CONSTRAINT "FinancialDeposit_filedById_fkey" FOREIGN KEY ("filedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialDeposit" ADD CONSTRAINT "FinancialDeposit_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRequisition" ADD CONSTRAINT "FinancialRequisition_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRequisition" ADD CONSTRAINT "FinancialRequisition_filedById_fkey" FOREIGN KEY ("filedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRequisition" ADD CONSTRAINT "FinancialRequisition_generalSecretarySignerId_fkey" FOREIGN KEY ("generalSecretarySignerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRequisition" ADD CONSTRAINT "FinancialRequisition_treasurerSignerId_fkey" FOREIGN KEY ("treasurerSignerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRequisition" ADD CONSTRAINT "FinancialRequisition_presidentSignerId_fkey" FOREIGN KEY ("presidentSignerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRequisition" ADD CONSTRAINT "FinancialRequisition_facultyAdvisorSignerId_fkey" FOREIGN KEY ("facultyAdvisorSignerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_auditor1Id_fkey" FOREIGN KEY ("auditor1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_auditor2Id_fkey" FOREIGN KEY ("auditor2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditReport" ADD CONSTRAINT "AuditReport_advisorSignerId_fkey" FOREIGN KEY ("advisorSignerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_adjournedFromMeetingId_fkey" FOREIGN KEY ("adjournedFromMeetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingAttendance" ADD CONSTRAINT "MeetingAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motion" ADD CONSTRAINT "Motion_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ballot" ADD CONSTRAINT "Ballot_motionId_fkey" FOREIGN KEY ("motionId") REFERENCES "Motion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ballot" ADD CONSTRAINT "Ballot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionPanel" ADD CONSTRAINT "SelectionPanel_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionPanel" ADD CONSTRAINT "SelectionPanel_facultyAdvisorId_fkey" FOREIGN KEY ("facultyAdvisorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionPanel" ADD CONSTRAINT "SelectionPanel_outgoingPresidentId_fkey" FOREIGN KEY ("outgoingPresidentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionPanel" ADD CONSTRAINT "SelectionPanel_ebNomineeId_fkey" FOREIGN KEY ("ebNomineeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelectionPanel" ADD CONSTRAINT "SelectionPanel_alternateNomineeId_fkey" FOREIGN KEY ("alternateNomineeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveNomination" ADD CONSTRAINT "ExecutiveNomination_selectionPanelId_fkey" FOREIGN KEY ("selectionPanelId") REFERENCES "SelectionPanel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveNomination" ADD CONSTRAINT "ExecutiveNomination_presidentCandidateId_fkey" FOREIGN KEY ("presidentCandidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveNomination" ADD CONSTRAINT "ExecutiveNomination_vpCandidateId_fkey" FOREIGN KEY ("vpCandidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveNomination" ADD CONSTRAINT "ExecutiveNomination_gsCandidateId_fkey" FOREIGN KEY ("gsCandidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExecutiveNomination" ADD CONSTRAINT "ExecutiveNomination_treasurerCandidateId_fkey" FOREIGN KEY ("treasurerCandidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionSignature" ADD CONSTRAINT "PetitionSignature_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionSignature" ADD CONSTRAINT "PetitionSignature_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResignationNotice" ADD CONSTRAINT "ResignationNotice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResignationNotice" ADD CONSTRAINT "ResignationNotice_presidentRecipientId_fkey" FOREIGN KEY ("presidentRecipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResignationNotice" ADD CONSTRAINT "ResignationNotice_gsRecipientId_fkey" FOREIGN KEY ("gsRecipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResignationNotice" ADD CONSTRAINT "ResignationNotice_advisorRecipientId_fkey" FOREIGN KEY ("advisorRecipientId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouncilTransition" ADD CONSTRAINT "CouncilTransition_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubAsset" ADD CONSTRAINT "ClubAsset_currentCustodianUserId_fkey" FOREIGN KEY ("currentCustodianUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_complainantId_fkey" FOREIGN KEY ("complainantId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_accusedUserId_fkey" FOREIGN KEY ("accusedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationPanelMember" ADD CONSTRAINT "InvestigationPanelMember_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationPanelMember" ADD CONSTRAINT "InvestigationPanelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_trackCatalogId_fkey" FOREIGN KEY ("trackCatalogId") REFERENCES "TrackCatalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_arrangerId_fkey" FOREIGN KEY ("arrangerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================================
-- SOPTOSUR CHAIN OF COMMAND: CONSTITUTIONAL INVARIANTS, TRIGGERS & CONSTRAINTS
-- ============================================================================

-- 1. Office Term Limit Check Constraint (Section 3 & 5): Maximum 2 terms per office
ALTER TABLE "RoleAssignment"
ADD CONSTRAINT "chk_role_term_limit"
CHECK ("termCount" >= 1 AND "termCount" <= 2);

-- 2. Executive Uniqueness Partial Unique Indexes (Section 1 & 5)
-- Ensures exactly one active user occupies each single-seat executive office
CREATE UNIQUE INDEX "uq_active_president"
ON "RoleAssignment" ("role")
WHERE "role" = 'PRESIDENT' AND "isActive" = true;

CREATE UNIQUE INDEX "uq_active_vp"
ON "RoleAssignment" ("role")
WHERE "role" = 'VICE_PRESIDENT' AND "isActive" = true;

CREATE UNIQUE INDEX "uq_active_gs"
ON "RoleAssignment" ("role")
WHERE "role" = 'GENERAL_SECRETARY' AND "isActive" = true;

CREATE UNIQUE INDEX "uq_active_treasurer"
ON "RoleAssignment" ("role")
WHERE "role" = 'TREASURER' AND "isActive" = true;

CREATE UNIQUE INDEX "uq_active_faculty_advisor"
ON "RoleAssignment" ("role")
WHERE "role" = 'FACULTY_ADVISOR' AND "isActive" = true;

-- Ensures exactly one active Department Head per department
CREATE UNIQUE INDEX "uq_active_dept_head_per_dept"
ON "RoleAssignment" ("department")
WHERE "role" IN (
    'DEPT_HEAD_MUSIC_PERFORMANCE',
    'DEPT_HEAD_EVENT_LOGISTICS',
    'DEPT_HEAD_MEDIA_DESIGN',
    'DEPT_HEAD_MEMBER_MANAGEMENT',
    'DEPT_HEAD_SPONSORSHIP_PARTNERSHIP'
) AND "isActive" = true;

-- 3. Coordinator Headcount Cap Trigger (Section 1 & 5): Maximum 2 active Coordinators per department
CREATE OR REPLACE FUNCTION fn_enforce_coordinator_cap()
RETURNS TRIGGER AS $$
DECLARE
    active_coordinator_count INTEGER;
BEGIN
    IF NEW."role" = 'COORDINATOR' AND NEW."isActive" = true THEN
        SELECT COUNT(*)
        INTO active_coordinator_count
        FROM "RoleAssignment"
        WHERE "department" = NEW."department"
          AND "role" = 'COORDINATOR'
          AND "isActive" = true
          AND "id" <> COALESCE(NEW."id", '00000000-0000-0000-0000-000000000000');

        IF active_coordinator_count >= 2 THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 1): Maximum cap of two active coordinators per department exceeded for department "%". Currently active: %', NEW."department", active_coordinator_count;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_enforce_coordinator_cap
BEFORE INSERT OR UPDATE OF "role", "department", "isActive"
ON "RoleAssignment"
FOR EACH ROW
EXECUTE FUNCTION fn_enforce_coordinator_cap();

-- 4. Independent Auditor Disqualification Trigger (Section 9): GS and Treasurer barred from audit
CREATE OR REPLACE FUNCTION fn_disqualify_auditor()
RETURNS TRIGGER AS $$
DECLARE
    auditor1_is_disqualified BOOLEAN;
    auditor2_is_disqualified BOOLEAN;
BEGIN
    -- Check Auditor 1
    SELECT EXISTS (
        SELECT 1 FROM "RoleAssignment"
        WHERE "userId" = NEW."auditor1Id"
          AND "isActive" = true
          AND "role" IN ('GENERAL_SECRETARY', 'TREASURER')
    ) INTO auditor1_is_disqualified;

    IF auditor1_is_disqualified THEN
        RAISE EXCEPTION 'Constitutional Invariant Violation (Section 9): Active General Secretary or Treasurer cannot serve as an Independent Auditor (Auditor 1 ID: %)', NEW."auditor1Id";
    END IF;

    -- Check Auditor 2
    SELECT EXISTS (
        SELECT 1 FROM "RoleAssignment"
        WHERE "userId" = NEW."auditor2Id"
          AND "isActive" = true
          AND "role" IN ('GENERAL_SECRETARY', 'TREASURER')
    ) INTO auditor2_is_disqualified;

    IF auditor2_is_disqualified THEN
        RAISE EXCEPTION 'Constitutional Invariant Violation (Section 9): Active General Secretary or Treasurer cannot serve as an Independent Auditor (Auditor 2 ID: %)', NEW."auditor2Id";
    END IF;

    -- Ensure Auditor 1 and Auditor 2 are distinct neutral members
    IF NEW."auditor1Id" = NEW."auditor2Id" THEN
        RAISE EXCEPTION 'Constitutional Invariant Violation (Section 9): Independent Audit team must consist of two distinct active members.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_disqualify_auditor
BEFORE INSERT OR UPDATE OF "auditor1Id", "auditor2Id"
ON "AuditReport"
FOR EACH ROW
EXECUTE FUNCTION fn_disqualify_auditor();

-- Reciprocal rule: Active Auditor cannot be elected/appointed GS or Treasurer
CREATE OR REPLACE FUNCTION fn_prevent_auditor_becoming_executive()
RETURNS TRIGGER AS $$
DECLARE
    is_active_auditor BOOLEAN;
BEGIN
    IF NEW."isActive" = true AND NEW."role" IN ('GENERAL_SECRETARY', 'TREASURER') THEN
        SELECT EXISTS (
            SELECT 1 FROM "AuditReport" ar
            JOIN "Semester" s ON s."id" = ar."semesterId"
            WHERE (ar."auditor1Id" = NEW."userId" OR ar."auditor2Id" = NEW."userId")
              AND ar."status" IN ('IN_PROGRESS', 'SUBMITTED')
              AND s."isActive" = true
        ) INTO is_active_auditor;

        IF is_active_auditor THEN
            RAISE EXCEPTION 'Constitutional Invariant Violation (Section 9): Member holding active Independent Auditor assignment cannot simultaneously assume General Secretary or Treasurer role.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_auditor_becoming_executive
BEFORE INSERT OR UPDATE OF "role", "isActive"
ON "RoleAssignment"
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_auditor_becoming_executive();

-- 5. Strict 5-Tier Single-Supervisor Hierarchy Validation Trigger (Section 1 & 5)
CREATE OR REPLACE FUNCTION fn_validate_single_supervisor()
RETURNS TRIGGER AS $$
DECLARE
    sup_role "ClubRole";
    sup_dept "DepartmentType";
    sup_tier INTEGER;
    sup_is_active BOOLEAN;
BEGIN
    -- Tier 1: Faculty Advisor reports to NSU Admin / OSA (supervisorId MUST be NULL)
    IF NEW."tierLevel" = 1 THEN
        IF NEW."supervisorId" IS NOT NULL THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 1): Faculty Advisor (Tier 1) reports strictly to NSU OSA/Admin; supervisorId must be NULL.';
        END IF;
        RETURN NEW;
    END IF;

    -- Tiers 2 to 5 MUST have a valid supervisor
    IF NEW."supervisorId" IS NULL THEN
        RAISE EXCEPTION 'Constitutional Violation (Section 1): Subordinate role in Tier % requires an explicit supervisor under single-supervisor invariant.', NEW."tierLevel";
    END IF;

    -- Fetch supervisor details
    SELECT "role", "department", "tierLevel", "isActive"
    INTO sup_role, sup_dept, sup_tier, sup_is_active
    FROM "RoleAssignment"
    WHERE "id" = NEW."supervisorId";

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Constitutional Hierarchy Error: Supervisor RoleAssignment ID "%" does not exist.', NEW."supervisorId";
    END IF;

    IF NOT sup_is_active THEN
        RAISE EXCEPTION 'Constitutional Hierarchy Error: Assigned supervisor is not currently active.';
    END IF;

    -- Tier 2: President reports strictly to Faculty Advisor (Tier 1)
    IF NEW."role" IN ('PRESIDENT', 'ACTING_PRESIDENT') THEN
        IF sup_role <> 'FACULTY_ADVISOR' THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 1): President must report strictly to Faculty Advisor.';
        END IF;
    END IF;

    -- Tier 3: VP, General Secretary, Treasurer report strictly to President (Tier 2)
    IF NEW."role" IN ('VICE_PRESIDENT', 'GENERAL_SECRETARY', 'TREASURER', 'ACTING_OFFICER') THEN
        IF sup_role NOT IN ('PRESIDENT', 'ACTING_PRESIDENT') THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 1): Tier 3 Officers (VP, GS, Treasurer) must report strictly to President.';
        END IF;
    END IF;

    -- Tier 4: Department Heads report to specific Tier 3 Executives
    IF NEW."role" = 'DEPT_HEAD_MUSIC_PERFORMANCE' THEN
        IF sup_role <> 'VICE_PRESIDENT' THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 5): Music & Performance Dept Head must report strictly to Vice President.';
        END IF;
    END IF;

    IF NEW."role" = 'DEPT_HEAD_EVENT_LOGISTICS' THEN
        IF sup_role <> 'VICE_PRESIDENT' THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 5): Event & Logistics Dept Head must report strictly to Vice President.';
        END IF;
    END IF;

    IF NEW."role" = 'DEPT_HEAD_MEDIA_DESIGN' THEN
        IF sup_role <> 'GENERAL_SECRETARY' THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 5): Media & Design Dept Head must report strictly to General Secretary.';
        END IF;
    END IF;

    IF NEW."role" = 'DEPT_HEAD_MEMBER_MANAGEMENT' THEN
        IF sup_role <> 'GENERAL_SECRETARY' THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 5): Member Management & Discipline Dept Head must report strictly to General Secretary.';
        END IF;
    END IF;

    IF NEW."role" = 'DEPT_HEAD_SPONSORSHIP_PARTNERSHIP' THEN
        IF sup_role <> 'TREASURER' THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 5): Sponsorship & Partnership Dept Head must report strictly to Treasurer.';
        END IF;
    END IF;

    -- Tier 5: Coordinators and General Members report strictly to their respective Department Head
    IF NEW."tierLevel" = 5 THEN
        IF sup_tier <> 4 OR sup_dept <> NEW."department" THEN
            RAISE EXCEPTION 'Constitutional Violation (Section 5): Tier 5 subordinates must report strictly to their respective Department Head in "%".', NEW."department";
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_single_supervisor
BEFORE INSERT OR UPDATE OF "supervisorId", "tierLevel", "role", "department"
ON "RoleAssignment"
FOR EACH ROW
EXECUTE FUNCTION fn_validate_single_supervisor();

-- 6. Dynamic Multi-Tier Financial Validation & Petty Cash Freeze (Section 9 & 11)
CREATE OR REPLACE FUNCTION fn_validate_financial_requisition()
RETURNS TRIGGER AS $$
DECLARE
    tier1_ceiling NUMERIC(12, 2);
    tier2_ceiling NUMERIC(12, 2);
    is_frozen BOOLEAN;
BEGIN
    -- Ensure strictly positive amount
    IF NEW."amount" <= 0 THEN
        RAISE EXCEPTION 'Financial Rule: Requisition amount must be strictly greater than zero.';
    END IF;

    -- Fetch dynamic ceilings from singleton OrganizationConfig
    SELECT "tier1MaxAmount", "tier2MaxAmount", "isPettyCashFrozen"
    INTO tier1_ceiling, tier2_ceiling, is_frozen
    FROM "OrganizationConfig"
    LIMIT 1;

    IF NOT FOUND THEN
        tier1_ceiling := 2000.00;
        tier2_ceiling := 20000.00;
        is_frozen := false;
    END IF;

    -- Check petty cash freeze invariant
    IF NEW."disbursementType" = 'CASH_PETTY' AND is_frozen = true AND NEW."status" IN ('APPROVED_PENDING_DISBURSEMENT', 'DISBURSED') THEN
        RAISE EXCEPTION 'Financial Invariant Violation (Section 9): Petty cash operations are currently frozen system-wide due to outstanding overdue vouchers.';
    END IF;

    -- Verify Tier 1: amount <= tier1_ceiling
    IF NEW."tier" = 'TIER_1' THEN
        IF NEW."amount" > tier1_ceiling THEN
            RAISE EXCEPTION 'Financial Invariant (Section 9): Tier 1 requisition amount (%) exceeds dynamic Tier 1 ceiling (%).', NEW."amount", tier1_ceiling;
        END IF;
    END IF;

    -- Verify Tier 2: tier1_ceiling < amount <= tier2_ceiling
    IF NEW."tier" = 'TIER_2' THEN
        IF NEW."amount" <= tier1_ceiling OR NEW."amount" > tier2_ceiling THEN
            RAISE EXCEPTION 'Financial Invariant (Section 9): Tier 2 requisition amount (%) must be between Tier 1 ceiling (%) and Tier 2 ceiling (%).', NEW."amount", tier1_ceiling, tier2_ceiling;
        END IF;
    END IF;

    -- Verify Tier 3: amount > tier2_ceiling
    IF NEW."tier" = 'TIER_3' THEN
        IF NEW."amount" <= tier2_ceiling THEN
            RAISE EXCEPTION 'Financial Invariant (Section 9): Tier 3 requisition amount (%) must strictly exceed Tier 2 ceiling (%).', NEW."amount", tier2_ceiling;
        END IF;

        -- Tier 3 requires EB meeting resolution document URL and Faculty Advisor written clearance when approved/disbursed
        IF NEW."status" IN ('APPROVED_PENDING_DISBURSEMENT', 'DISBURSED', 'COMPLETED') THEN
            IF NEW."ebResolutionDocUrl" IS NULL THEN
                RAISE EXCEPTION 'Financial Invariant (Section 9): Tier 3 requisitions mandatorily require an approved Executive Body formal meeting resolution document attached.';
            END IF;
            IF NEW."facultyAdvisorSignerId" IS NULL OR NEW."facultyAdvisorApprovedAt" IS NULL THEN
                RAISE EXCEPTION 'Financial Invariant (Section 9): Tier 3 requisitions mandatorily require Faculty Advisor written digital clearance.';
            END IF;
        END IF;
    END IF;

    -- Voucher deadline calculation for cash petty disbursements: 72 hours from disbursement
    IF NEW."disbursementType" = 'CASH_PETTY' AND NEW."disbursedAt" IS NOT NULL AND NEW."voucherDeadline" IS NULL THEN
        NEW."voucherDeadline" := NEW."disbursedAt" + INTERVAL '72 hours';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_financial_requisition
BEFORE INSERT OR UPDATE OF "amount", "tier", "disbursementType", "status", "ebResolutionDocUrl", "facultyAdvisorSignerId"
ON "FinancialRequisition"
FOR EACH ROW
EXECUTE FUNCTION fn_validate_financial_requisition();

-- 7. Creative Autonomy Firewall Trigger (Section 12): Music Department Mutate Exclusivity
CREATE OR REPLACE FUNCTION fn_creative_autonomy_firewall()
RETURNS TRIGGER AS $$
DECLARE
    is_music_dept_member BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM "RoleAssignment"
        WHERE "userId" = NEW."arrangerId"
          AND "isActive" = true
          AND "department" = 'MUSIC_AND_PERFORMANCE'
    ) INTO is_music_dept_member;

    IF NOT is_music_dept_member THEN
        RAISE EXCEPTION 'Creative Autonomy Firewall Violation (Section 12): User "%" does not hold an active role in Music & Performance Department. Executive Body and non-music members have strictly read-only access to song compositions and arrangements.', NEW."arrangerId";
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_creative_autonomy_firewall
BEFORE INSERT OR UPDATE OF "arrangerId", "vocalArrangementNotes", "instrumentalArrangementNotes"
ON "Arrangement"
FOR EACH ROW
EXECUTE FUNCTION fn_creative_autonomy_firewall();
