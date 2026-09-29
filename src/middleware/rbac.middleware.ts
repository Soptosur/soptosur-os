import { Request, Response, NextFunction } from 'express';
import { ClubRole } from '@prisma/client';
import { RbacService } from '../services/rbac.service.js';

export function requireTier(maxTierAllowed: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated.' });
      return;
    }

    try {
      RbacService.requireTier(req.user, maxTierAllowed);
      next();
    } catch (err: any) {
      res.status(err.statusCode || 403).json({ success: false, error: err.message });
    }
  };
}

export function requireRole(allowedRoles: ClubRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated.' });
      return;
    }

    try {
      RbacService.requireRole(req.user, allowedRoles);
      next();
    } catch (err: any) {
      res.status(err.statusCode || 403).json({ success: false, error: err.message });
    }
  };
}

export function creativeFirewallGuard(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated.' });
    return;
  }

  try {
    RbacService.enforceCreativeFirewall(req.user);
    next();
  } catch (err: any) {
    res.status(err.statusCode || 403).json({ success: false, error: err.message });
  }
}

export function neutralAuditorGuard(attemptingOperationalAction: boolean = true) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Unauthorized: User not authenticated.' });
      return;
    }

    const isAuditor = req.user.activeRole?.role === ClubRole.GENERAL_MEMBER && req.user.activeRole?.department === 'GENERAL';
    try {
      RbacService.enforceAuditorBoundary(isAuditor, attemptingOperationalAction);
      next();
    } catch (err: any) {
      res.status(err.statusCode || 403).json({ success: false, error: err.message });
    }
  };
}
