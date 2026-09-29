import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { creativeFirewallGuard } from '../middleware/rbac.middleware.js';
import { auditMiddleware } from '../middleware/audit.middleware.js';
import { prisma } from '../index.js';

export const creativeRouter = Router();

// Read repertoire - Open to all authenticated members
creativeRouter.get('/tracks', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const tracks = await prisma.trackCatalog.findMany({
      include: { arrangements: true },
    });
    res.json({ success: true, data: tracks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Mutate musical arrangements - STRICT FIREWALL (Music Department Only!)
creativeRouter.post(
  '/arrangements',
  authMiddleware,
  creativeFirewallGuard,
  auditMiddleware('CREATIVE_ARRANGEMENT_CREATE', 'Arrangement'),
  async (req: Request, res: Response): Promise<void> => {
    const { trackCatalogId, title, vocalArrangementNotes, instrumentalArrangementNotes, leadVocalistAssignment } = req.body;

    try {
      const arrangement = await prisma.arrangement.create({
        data: {
          trackCatalogId,
          arrangerId: req.user!.id,
          title,
          vocalArrangementNotes: vocalArrangementNotes || 'Standard Harmonization',
          instrumentalArrangementNotes: instrumentalArrangementNotes || 'Acoustic Guitar, Bass, Cajon',
          leadVocalistAssignment,
          versionNumber: 1,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Musical arrangement created under Section 12 creative autonomy firewall.',
        data: arrangement,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);
