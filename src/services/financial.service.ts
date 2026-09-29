import { ClubRole, DisbursementType, FinancialTier, RequisitionStatus } from '@prisma/client';
import { prisma } from '../index.js';
import { AuthenticatedUser } from '../types/auth.types.js';
import { AntiBypassService } from './anti-bypass.service.js';

export class FinancialService {
  /**
   * Enforces Tier 1 Petty Cash Freeze Check
   */
  static async checkPettyCashFreeze(disbursementType: DisbursementType): Promise<void> {
    if (disbursementType === DisbursementType.CASH_PETTY) {
      const config = await prisma.organizationConfig.findUnique({
        where: { id: 'singleton' },
      });

      if (config?.isPettyCashFrozen) {
        const err = new Error(
          `Financial Freeze Active: Petty cash operations are currently frozen system-wide due to overdue vouchers. Reason: ${
            config.pettyCashFrozenReason || '72-hour voucher timeout exceeded'
          }`
        );
        (err as any).statusCode = 403;
        throw err;
      }
    }
  }

  /**
   * Validates and processes a financial approval signature based on tier level
   */
  static async processApprovalSignature(
    requisitionId: string,
    signer: AuthenticatedUser
  ): Promise<any> {
    const requisition = await prisma.financialRequisition.findUnique({
      where: { id: requisitionId },
    });

    if (!requisition) {
      const err = new Error('Requisition not found.');
      (err as any).statusCode = 404;
      throw err;
    }

    if (requisition.status === RequisitionStatus.REJECTED) {
      const err = new Error('Cannot approve: Requisition has already been rejected.');
      (err as any).statusCode = 400;
      throw err;
    }

    const signerRole = signer.activeRole?.role;
    const now = new Date();

    // TIER 1: Dual Approval by GS and Treasurer
    if (requisition.tier === FinancialTier.TIER_1) {
      if (signerRole !== ClubRole.GENERAL_SECRETARY && signerRole !== ClubRole.TREASURER) {
        const err = new Error('Financial Authorization Error: Tier 1 requisitions require approval from General Secretary or Treasurer.');
        (err as any).statusCode = 403;
        throw err;
      }

      const isGS = signerRole === ClubRole.GENERAL_SECRETARY;
      const isTreasurer = signerRole === ClubRole.TREASURER;

      const updateData: any = {};
      if (isGS) {
        updateData.generalSecretarySignerId = signer.id;
        updateData.generalSecretaryApprovedAt = now;
      }
      if (isTreasurer) {
        updateData.treasurerSignerId = signer.id;
        updateData.treasurerApprovedAt = now;
      }

      // Check if both approvals are now present
      const hasBothApprovals =
        (isGS && requisition.treasurerApprovedAt) ||
        (isTreasurer && requisition.generalSecretaryApprovedAt);

      if (hasBothApprovals) {
        updateData.status = RequisitionStatus.APPROVED_PENDING_DISBURSEMENT;
      } else {
        updateData.status = RequisitionStatus.PENDING_GS_TREASURER;
      }

      return prisma.financialRequisition.update({
        where: { id: requisitionId },
        data: updateData,
      });
    }

    // TIER 2: Dual Signature by President and Treasurer
    if (requisition.tier === FinancialTier.TIER_2) {
      if (signerRole !== ClubRole.PRESIDENT && signerRole !== ClubRole.TREASURER) {
        const err = new Error('Financial Authorization Error: Tier 2 requisitions require approval from President or Treasurer.');
        (err as any).statusCode = 403;
        throw err;
      }

      const isPres = signerRole === ClubRole.PRESIDENT;
      const isTreasurer = signerRole === ClubRole.TREASURER;

      const updateData: any = {};
      if (isPres) {
        updateData.presidentSignerId = signer.id;
        updateData.presidentApprovedAt = now;
      }
      if (isTreasurer) {
        updateData.treasurerSignerId = signer.id;
        updateData.treasurerApprovedAt = now;
      }

      const hasBothApprovals =
        (isPres && requisition.treasurerApprovedAt) ||
        (isTreasurer && requisition.presidentApprovedAt);

      if (hasBothApprovals) {
        updateData.status = RequisitionStatus.APPROVED_PENDING_DISBURSEMENT;
      } else {
        updateData.status = RequisitionStatus.PENDING_PRESIDENT;
      }

      return prisma.financialRequisition.update({
        where: { id: requisitionId },
        data: updateData,
      });
    }

    // TIER 3: Requires EB Meeting Resolution doc and Faculty Advisor clearance
    if (requisition.tier === FinancialTier.TIER_3) {
      if (signerRole !== ClubRole.FACULTY_ADVISOR) {
        const err = new Error('Financial Authorization Error: Tier 3 requisitions require written digital clearance from the Faculty Advisor.');
        (err as any).statusCode = 403;
        throw err;
      }

      if (!requisition.ebResolutionDocUrl) {
        const err = new Error('Financial Invariant Violation (Section 9): Tier 3 requisitions mandatorily require an approved Executive Meeting Resolution attached prior to Advisor clearance.');
        (err as any).statusCode = 400;
        throw err;
      }

      return prisma.financialRequisition.update({
        where: { id: requisitionId },
        data: {
          facultyAdvisorSignerId: signer.id,
          facultyAdvisorApprovedAt: now,
          status: RequisitionStatus.APPROVED_PENDING_DISBURSEMENT,
        },
      });
    }

    throw new Error('Unsupported financial tier.');
  }

  /**
   * Rejects a requisition with mandatory written justification
   */
  static async rejectRequisition(
    requisitionId: string,
    rejecter: AuthenticatedUser,
    reason: string
  ): Promise<any> {
    const validatedReason = AntiBypassService.validateRejectionReason(reason);

    return prisma.financialRequisition.update({
      where: { id: requisitionId },
      data: {
        status: RequisitionStatus.REJECTED,
        purpose: `${validatedReason}`, // Annotated in record
      },
    });
  }

  /**
   * Disburses approved requisition and initiates the 72-hour voucher countdown for cash
   */
  static async disburseRequisition(requisitionId: string): Promise<any> {
    const requisition = await prisma.financialRequisition.findUnique({
      where: { id: requisitionId },
    });

    if (!requisition || requisition.status !== RequisitionStatus.APPROVED_PENDING_DISBURSEMENT) {
      const err = new Error('Requisition is not approved for disbursement.');
      (err as any).statusCode = 400;
      throw err;
    }

    const now = new Date();
    const updateData: any = {
      status: RequisitionStatus.DISBURSED,
      disbursedAt: now,
    };

    if (requisition.disbursementType === DisbursementType.CASH_PETTY) {
      updateData.voucherDeadline = new Date(now.getTime() + 72 * 60 * 60 * 1000);
      updateData.status = RequisitionStatus.VOUCHER_PENDING;
    }

    return prisma.financialRequisition.update({
      where: { id: requisitionId },
      data: updateData,
    });
  }
}
