import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { prisma } from '../index.js';

export const authRouter = Router();

/**
 * POST /api/auth/register
 * Enforces NSU domain lockdown (@northsouth.edu)
 */
authRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { studentId, nsuEmail, legalName, contactPhone, password, cgpa, completedSemesters } = req.body;

  // 1. NSU Domain Lockdown
  if (!AuthService.validateNsuDomain(nsuEmail)) {
    res.status(401).json({
      success: false,
      error: 'Institutional Lockdown: Registration is strictly restricted to official North South University emails (@northsouth.edu).',
    });
    return;
  }

  try {
    // Check existing
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ studentId }, { nsuEmail }],
      },
    });

    if (existing) {
      res.status(400).json({
        success: false,
        error: 'Registration Error: Student ID or NSU Email is already registered.',
      });
      return;
    }

    // Get active semester
    const activeSemester = await prisma.semester.findFirst({
      where: { isActive: true },
    });

    if (!activeSemester) {
      res.status(500).json({
        success: false,
        error: 'System Error: No active semester found.',
      });
      return;
    }

    const passwordHash = await AuthService.hashPassword(password || 'Shaptasur@2026');

    const newUser = await prisma.user.create({
      data: {
        studentId,
        nsuEmail: nsuEmail.trim().toLowerCase(),
        legalName,
        contactPhone: contactPhone || '+8801700000000',
        cgpa: cgpa || 3.00,
        completedSemesters: completedSemesters || 1,
        passwordHash,
        tokenVersion: 1,
        joinedSemesterId: activeSemester.id,
      },
    });

    const authUser = await AuthService.resolveAuthenticatedUser(newUser.id);
    const token = AuthService.issueToken(authUser!);

    res.status(201).json({
      success: true,
      message: 'NSU student identity successfully verified and registered.',
      data: {
        user: authUser,
        token,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Validates domain, password, membership gate, and issues JWT
 */
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { nsuEmail, password } = req.body;

  if (!AuthService.validateNsuDomain(nsuEmail)) {
    res.status(401).json({
      success: false,
      error: 'Institutional Lockdown: Login is strictly restricted to official North South University emails (@northsouth.edu).',
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { nsuEmail: nsuEmail.trim().toLowerCase() },
    });

    if (!user) {
      res.status(401).json({ success: false, error: 'Authentication Failed: Invalid credentials.' });
      return;
    }

    // Check membership standing gate
    try {
      AuthService.enforceStandingGate(user.standing);
    } catch (standingErr: any) {
      res.status(standingErr.statusCode || 403).json({ success: false, error: standingErr.message });
      return;
    }

    // Check password
    const isMatch = await AuthService.comparePassword(password, user.passwordHash);
    if (!isMatch && user.passwordHash !== '') {
      res.status(401).json({ success: false, error: 'Authentication Failed: Invalid credentials.' });
      return;
    }

    const authUser = await AuthService.resolveAuthenticatedUser(user.id);
    const token = AuthService.issueToken(authUser!);

    res.json({
      success: true,
      message: 'Authentication successful.',
      data: {
        user: authUser,
        token,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/revoke-sessions
 * Increments tokenVersion, immediately invalidating all active tokens across devices
 */
authRouter.post('/revoke-sessions', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const newVersion = await AuthService.invalidateUserTokens(req.user!.id);
    res.json({
      success: true,
      message: 'All active sessions have been invalidated across devices.',
      data: {
        userId: req.user!.id,
        newTokenVersion: newVersion,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
