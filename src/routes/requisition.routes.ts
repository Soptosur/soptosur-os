import { Router, Request, Response } from 'express';
import { FinancialTier, DisbursementType, RequisitionCategory, RequisitionStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { singleSupervisorDispatchGuard, rejectionJustificationGuard } from '../middleware/anti-bypass.middleware.js';
import { auditMiddleware } from '../middleware/audit.middleware.js';
import { FinancialService } from '../services/financial.service.js';
import { prisma } from '../index.js';

export const requisitionRouter = Router();

/**
 * POST /api/requisitions
 * Creates requisition; enforces petty cash freeze and single-supervisor dispatch if submitted by subordinate
 */
requisitionRouter.post(
  '/',
  authMiddleware,
  auditMiddleware('FINANCIAL_REQUISITION_CREATE', 'FinancialRequisition'),
  async (req: Request, res: Response): Promise<void> => {
    const { title, category, amount, tier, disbursementType, purpose, beneficiaryPayee, ebResolutionDocUrl, targetSupervisorRoleId } = req.body;

    try {
      // Check petty cash freeze
      await FinancialService.checkPettyCashFreeze(disbursementType as DisbursementType);

      // If subordinate (Tier 5), enforce single-supervisor dispatch
      if (req.user!.activeRole && req.user!.activeRole.tierLevel === 5) {
        if (!targetSupervisorRoleId || req.user!.activeRole.supervisorId !== targetSupervisorRoleId) {
          res.status(403).json({
            success: false,
            error: 'Chain-of-Command Anti-Bypass Violation: Subordinates must submit expense requisitions strictly to their immediate Department Head.',
          });
          return;
        }
      }

      const activeSemester = await prisma.semester.findFirst({ where: { isActive: true } });
      const reqCount = await prisma.financialRequisition.count();
      const requisitionNumber = `REQ-2026-${String(reqCount + 1).padStart(4, '0')}`;

      const requisition = await prisma.financialRequisition.create({
        data: {
          requisitionNumber,
          semesterId: activeSemester!.id,
          title,
          category: category as RequisitionCategory,
          amount,
          tier: tier as FinancialTier,
          disbursementType: disbursementType as DisbursementType,
          purpose,
          beneficiaryPayee,
          filedById: req.user!.id,
          ebResolutionDocUrl: tier === 'TIER_3' ? ebResolutionDocUrl : null,
          status: RequisitionStatus.DRAFT,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Requisition successfully filed under constitutional financial controls.',
        data: requisition,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ success: false, error: err.message });
    }
  }
);

/**
 * POST /api/requisitions/:id/approve
 * Executes multi-signature approval according to Tier 1, 2, or 3
 */
requisitionRouter.post(
  '/:id/approve',
  authMiddleware,
  auditMiddleware('FINANCIAL_REQUISITION_APPROVE', 'FinancialRequisition'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await FinancialService.processApprovalSignature(req.params.id as string, req.user!);
      res.json({
        success: true,
        message: 'Digital signature recorded on requisition ledger.',
        data: updated,
      });
    } catch (err: any) {
      res.status(err.statusCode || 400).json({ success: false, error: err.message });
    }
  }
);

/**
 * POST /api/requisitions/:id/reject
 * Enforces mandatory written justification
 */
requisitionRouter.post(
  '/:id/reject',
  authMiddleware,
  rejectionJustificationGuard,
  auditMiddleware('FINANCIAL_REQUISITION_REJECT', 'FinancialRequisition'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const updated = await FinancialService.rejectRequisition(
        req.params.id as string,
        req.user!,
        req.body.reason || req.body.rejectionReason
      );
      res.json({
        success: true,
        message: 'Requisition rejected with mandatory written constitutional justification.',
        data: updated,
      });
    } catch (err: any) {
      res.status(err.statusCode || 400).json({ success: false, error: err.message });
    }
  }
);

/**
 * POST /api/requisitions/:id/disburse
 * Disburses funds and starts the 72-hour voucher countdown for cash petty
 */
requisitionRouter.post(
  '/:id/disburse',
  authMiddleware,
  auditMiddleware('FINANCIAL_REQUISITION_DISBURSE', 'FinancialRequisition'),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const disbursed = await FinancialService.disburseRequisition(req.params.id as string);
      res.json({
        success: true,
        message: 'Disbursement executed. 72-hour voucher countdown initiated.',
        data: disbursed,
      });
    } catch (err: any) {
      res.status(err.statusCode || 400).json({ success: false, error: err.message });
    }
  }
);
