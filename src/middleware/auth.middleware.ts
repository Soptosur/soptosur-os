import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Authentication Required: Missing or malformed Bearer token.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = AuthService.verifyJwt(token);

    // Fetch live user and active role from DB
    const user = await AuthService.resolveAuthenticatedUser(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Authentication Failed: User profile does not exist or has been removed.',
      });
      return;
    }

    // 1. Real-time Membership Standing Gate
    try {
      AuthService.enforceStandingGate(user.standing);
    } catch (standingErr: any) {
      res.status(standingErr.statusCode || 403).json({
        success: false,
        error: standingErr.message,
      });
      return;
    }

    // 2. Token Versioning & Instant Invalidation Gate
    if (decoded.tokenVersion !== user.tokenVersion) {
      res.status(401).json({
        success: false,
        error: 'Session Revoked: Your session has been invalidated due to a critical security event or status transition. Please log in again.',
      });
      return;
    }

    // Attach verified user context to request
    req.user = user;
    next();
  } catch (err: any) {
    res.status(err.statusCode || 401).json({
      success: false,
      error: err.message || 'Authentication token validation failed.',
    });
  }
}
