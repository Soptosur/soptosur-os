import dotenv from 'dotenv';
dotenv.config();

export const CONFIG = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'soptosur-constitutional-secure-jwt-secret-key-2026',
  JWT_EXPIRES_IN: '24h',
  NSU_DOMAIN: '@northsouth.edu',
  ALLOWED_DOMAINS: ['@northsouth.edu', '@gmail.com'],
  NSU_EMAIL_REGEX: /^[a-zA-Z0-9._%+-]+@(northsouth\.edu|gmail\.com)$/i,
  GOVERNANCE: {
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
  },
} as const;

export default CONFIG;
