import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MembershipStanding } from '@prisma/client';
import { prisma } from '../index.js';
import { CONFIG } from '../config/index.js';
import { AuthenticatedUser, JwtTokenPayload } from '../types/auth.types.js';

export class AuthService {
  /**
   * Strictly verifies that email belongs to the North South University official domain (@northsouth.edu)
   * or temporary production test whitelist (@gmail.com).
   */
  static validateNsuDomain(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const normalized = email.trim().toLowerCase();
    return normalized.endsWith('@northsouth.edu') || normalized.endsWith('@gmail.com');
  }

  /**
   * Hashes a password using secure bcrypt salting
   */
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verifies a plain text password against hashed password
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Enforces Membership Standing Gate: Suspended or Terminated profiles are immediately forbidden
   */
  static enforceStandingGate(standing: MembershipStanding): void {
    if (standing === MembershipStanding.SUSPENDED) {
      const err = new Error('Access Denied: Membership is currently SUSPENDED under disciplinary action.');
      (err as any).statusCode = 403;
      throw err;
    }
    if (standing === MembershipStanding.TERMINATED) {
      const err = new Error('Access Denied: Membership has been permanently TERMINATED.');
      (err as any).statusCode = 403;
      throw err;
    }
    if (standing === MembershipStanding.RESIGNED) {
      const err = new Error('Access Denied: Member has formally RESIGNED from Soptosur.');
      (err as any).statusCode = 403;
      throw err;
    }
  }

  /**
   * Issues a signed JWT with embedded role, tier, and tokenVersion metadata
   */
  static issueToken(user: AuthenticatedUser): string {
    const payload: JwtTokenPayload = {
      userId: user.id,
      studentId: user.studentId,
      nsuEmail: user.nsuEmail,
      standing: user.standing,
      tokenVersion: user.tokenVersion,
      tierLevel: user.activeRole?.tierLevel ?? 5,
      role: user.activeRole?.role ?? ('GENERAL_MEMBER' as any),
      department: user.activeRole?.department ?? ('GENERAL' as any),
      isActing: user.activeRole?.isActing ?? false,
    };

    return jwt.sign(payload, CONFIG.JWT_SECRET, {
      expiresIn: CONFIG.JWT_EXPIRES_IN,
    });
  }

  /**
   * Decodes and verifies a JWT token
   */
  static verifyJwt(token: string): JwtTokenPayload {
    try {
      return jwt.verify(token, CONFIG.JWT_SECRET) as JwtTokenPayload;
    } catch (err: any) {
      const error = new Error('Invalid, expired, or malformed authentication token.');
      (error as any).statusCode = 401;
      throw error;
    }
  }

  /**
   * Increments user token version, instantly invalidating all active sessions across devices
   */
  static async invalidateUserTokens(userId: string): Promise<number> {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
      select: {
        tokenVersion: true,
      },
    });

    return updated.tokenVersion;
  }

  /**
   * Resolves full user identity, active role, and token version from database
   */
  static async resolveAuthenticatedUser(userId: string): Promise<AuthenticatedUser | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roleAssignments: {
          where: { isActive: true },
          orderBy: { tierLevel: 'asc' }, // Priority to higher tier if multiple
        },
      },
    });

    if (!user) return null;

    const primaryRole = user.roleAssignments[0] || null;

    return {
      id: user.id,
      studentId: user.studentId,
      nsuEmail: user.nsuEmail,
      legalName: user.legalName,
      standing: user.standing,
      tokenVersion: user.tokenVersion,
      activeRole: primaryRole
        ? {
            id: primaryRole.id,
            role: primaryRole.role,
            tierLevel: primaryRole.tierLevel,
            department: primaryRole.department,
            supervisorId: primaryRole.supervisorId,
            isActing: primaryRole.isActing,
          }
        : null,
    };
  }
}
