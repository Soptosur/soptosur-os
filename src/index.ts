/**
 * Soptosur Chain of Command (Soptosur Governance OS)
 * Enterprise Club Management ERP under NSU Office of Student Affairs (OSA) Regulations.
 */

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export * from '@prisma/client';

export const GOVERNANCE_DEFAULTS = {
  TIER_1_MAX_BDT: 2000.00,
  TIER_2_MAX_BDT: 20000.00,
  PETTY_CASH_VOUCHER_WINDOW_HOURS: 72,
  ROSTER_DISPUTE_WINDOW_HOURS: 72,
  HANDOVER_PERIOD_HOURS: 168, // 7 working days
  RESIGNATION_NOTICE_DAYS: 15,
  DEPT_HEAD_REMOVAL_NOTICE_DAYS: 7,
  LEADERSHIP_PETITION_NOTICE_DAYS: 7,
  ACTIVE_ATTENDANCE_THRESHOLD_PERCENT: 50.00,
  GBM_QUORUM_PERCENT: 40.00,
  FLOOR_QUORUM_PERCENT: 33.00,
  PETITION_SIGNATURE_THRESHOLD_PERCENT: 25.00,
  CONSTITUTIONAL_SUPERMAJORITY_RATIO: 2 / 3,
  MAX_OFFICE_TERMS: 2,
  MAX_COORDINATORS_PER_DEPT: 2,
} as const;

export default prisma;
