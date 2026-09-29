import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { whistleblowerBlindingGuard } from '../middleware/anti-bypass.middleware.js';
import { WhistleblowerService } from '../services/whistleblower.service.js';
import { prisma } from '../index.js';

export const whistleblowerRouter = Router();

/**
 * POST /api/whistleblower/submit
 * Submits anonymous or identified grievance dossier with automated recipient routing
 */
whistleblowerRouter.post('/submit', async (req: Request, res: Response): Promise<void> => {
  const { isAnonymous, complainantId, accusedUserId, incidentDescription, evidenceUrls } = req.body;

  try {
    const accused = await prisma.user.findUnique({
      where: { id: accusedUserId },
      include: {
        roleAssignments: {
          where: { isActive: true },
          orderBy: { tierLevel: 'asc' },
        },
      },
    });

    if (!accused || accused.roleAssignments.length === 0) {
      res.status(404).json({ success: false, error: 'Accused user has no active club role.' });
      return;
    }

    const accusedRole = accused.roleAssignments[0].role;
    const routingDestination = WhistleblowerService.resolveRoutingDestination(accusedRole);
    const trackingCode = WhistleblowerService.generateTrackingCode();

    const complaint = await prisma.complaint.create({
      data: {
        trackingCode,
        isAnonymous: Boolean(isAnonymous),
        complainantId: isAnonymous ? null : complainantId,
        accusedUserId,
        accusedRole,
        incidentDescription,
        evidenceUrls: evidenceUrls || [],
        routingDestination,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Grievance submitted under anonymous whistleblower protections (Section 10).',
      data: {
        trackingCode: complaint.trackingCode,
        routingDestination: complaint.routingDestination,
        createdAt: complaint.createdAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/whistleblower/dossiers
 * Protected with query-level blinding: EB members cannot view President dossiers!
 */
whistleblowerRouter.get(
  '/dossiers',
  authMiddleware,
  whistleblowerBlindingGuard,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const filter = (req as any).whistleblowerFilter;
      const complaints = await prisma.complaint.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        data: complaints,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);
