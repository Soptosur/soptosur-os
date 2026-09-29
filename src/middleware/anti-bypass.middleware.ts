import { Request, Response, NextFunction } from 'express';
import { AntiBypassService } from '../services/anti-bypass.service.js';
import { WhistleblowerService } from '../services/whistleblower.service.js';

export async function singleSupervisorDispatchGuard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated.' });
    return;
  }

  const { targetSupervisorRoleId } = req.body;
  if (!targetSupervisorRoleId) {
    res.status(400).json({
      success: false,
      error: 'Chain-of-Command Error: targetSupervisorRoleId is required for hierarchical dispatch.',
    });
    return;
  }

  try {
    await AntiBypassService.verifyDirectSupervisorDispatch(req.user, targetSupervisorRoleId);
    next();
  } catch (err: any) {
    res.status(err.statusCode || 403).json({ success: false, error: err.message });
  }
}

export function rejectionJustificationGuard(req: Request, res: Response, next: NextFunction): void {
  const reason = req.body.reason || req.body.rejectionReason;
  try {
    AntiBypassService.validateRejectionReason(reason);
    next();
  } catch (err: any) {
    res.status(err.statusCode || 400).json({ success: false, error: err.message });
  }
}

export function whistleblowerBlindingGuard(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated.' });
    return;
  }

  // Inject blinding filter into request for query controllers to use
  (req as any).whistleblowerFilter = WhistleblowerService.applyQueryBlindingFilter(req.user);
  next();
}
