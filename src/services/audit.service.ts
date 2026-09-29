import { prisma } from '../index.js';
import { AuthenticatedUser } from '../types/auth.types.js';

export class AuditService {
  /**
   * Appends an immutable audit log record capturing differential state and executing user context
   */
  static async logMutation(params: {
    user?: AuthenticatedUser;
    action: string;
    targetEntity: string;
    targetEntityId: string;
    ipAddress?: string;
    previousState?: any;
    newState?: any;
  }): Promise<void> {
    const { user, action, targetEntity, targetEntityId, ipAddress, previousState, newState } = params;

    const diffPayload = {
      action,
      targetEntity,
      targetEntityId,
      actor: user
        ? {
            userId: user.id,
            studentId: user.studentId,
            role: user.activeRole?.role,
            tierLevel: user.activeRole?.tierLevel,
            isActing: user.activeRole?.isActing ?? false,
          }
        : 'SYSTEM',
      changes: {
        before: previousState ?? null,
        after: newState ?? null,
      },
      timestamp: new Date().toISOString(),
    };

    try {
      await prisma.auditLog.create({
        data: {
          userId: user?.id ?? null,
          action,
          targetEntity,
          targetEntityId,
          ipAddress: ipAddress ?? '127.0.0.1',
          diffPayload,
        },
      });
    } catch (err) {
      console.error('CRITICAL: Failed to write immutable AuditLog:', err);
    }
  }
}
