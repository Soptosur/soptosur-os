import { Router, Request, Response } from 'express';
import { ResignationStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { auditMiddleware } from '../middleware/audit.middleware.js';
import { AntiBypassService } from '../services/anti-bypass.service.js';
import { prisma } from '../index.js';

export const resignationRouter = Router();

/**
 * POST /api/resignation/submit
 * Enforces dual-recipient simultaneous binding (Section 6) and 15-day notice period
 */
resignationRouter.post(
  '/submit',
  authMiddleware,
  auditMiddleware('OFFICER_RESIGNATION_SUBMIT', 'ResignationNotice'),
  async (req: Request, res: Response): Promise<void> => {
    const roleCtx = req.user!.activeRole;
    if (!roleCtx) {
      res.status(400).json({ success: false, error: 'User does not hold an active role to resign from.' });
      return;
    }

    try {
      // Find current President, GS, and Advisor
      const [presidentRole, gsRole, advisorRole] = await Promise.all([
        prisma.roleAssignment.findFirst({ where: { role: 'PRESIDENT', isActive: true } }),
        prisma.roleAssignment.findFirst({ where: { role: 'GENERAL_SECRETARY', isActive: true } }),
        prisma.roleAssignment.findFirst({ where: { role: 'FACULTY_ADVISOR', isActive: true } }),
      ]);

      const recipients = AntiBypassService.computeResignationRecipients(
        roleCtx.role,
        presidentRole?.userId || '',
        gsRole?.userId || '',
        advisorRole?.userId || ''
      );

      const now = new Date();
      const noticePeriodEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // Exactly 15 days

      const notice = await prisma.resignationNotice.create({
        data: {
          userId: req.user!.id,
          role: roleCtx.role,
          submittedAt: now,
          noticePeriodEnd,
          presidentRecipientId: recipients.presidentRecipientId,
          gsRecipientId: recipients.gsRecipientId,
          advisorRecipientId: recipients.advisorRecipientId,
          handoverNotes: req.body.handoverNotes || 'Initial resignation notice submitted.',
          status: ResignationStatus.NOTICE_SUBMITTED,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Resignation formally filed with 15-day constitutional notice period and dual recipient binding.',
        data: notice,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);
