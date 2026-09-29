import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/audit.service.js';

export function auditMiddleware(actionName: string, targetEntityName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only intercept mutating HTTP methods
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return next();
    }

    const originalJson = res.json;
    res.json = function (body: any) {
      // Async audit record dispatch
      const targetEntityId =
        req.params.id || req.body.id || body?.data?.id || body?.id || 'GLOBAL_MUTATION';

      AuditService.logMutation({
        user: req.user,
        action: actionName,
        targetEntity: targetEntityName,
        targetEntityId,
        ipAddress: req.ip || (req.headers['x-forwarded-for'] as string) || '127.0.0.1',
        previousState: req.auditMetadata?.previousState || null,
        newState: body?.data || req.body,
      }).catch((err) => {
        console.error('Audit Middleware Failure:', err);
      });

      return originalJson.call(this, body);
    };

    next();
  };
}
