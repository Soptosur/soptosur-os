import { PGlite } from '@electric-sql/pglite';
import * as fs from 'fs';
import * as path from 'path';

async function runTests() {
  console.log('[SUITE] [Soptosur Governance OS] Starting Invariant Verification Suite in PGlite...');

  const db = new PGlite();

  // 1. Run Migration Script
  console.log('\n[TEST 1] Applying 20260930000000_init_governance_rules migration...');
  const migrationPath = path.resolve('prisma/migrations/20260930000000_init_governance_rules/migration.sql');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  try {
    await db.exec(migrationSql);
    console.log('   [PASS] Migration SQL executed with zero syntax or DDL errors!');
  } catch (err: any) {
    console.error('   [FAIL] Migration SQL failed:', err?.message || err);
    process.exit(1);
  }

  // Helper to run seed data
  console.log('\n[TEST 2] Inserting baseline organization and semester records...');
  await db.query(`
    INSERT INTO "OrganizationConfig" ("id", "clubTitle", "tier1MaxAmount", "tier2MaxAmount", "createdAt", "updatedAt")
    VALUES ('singleton', 'Soptosur - The Musical Club of NSU', 2000.00, 20000.00, NOW(), NOW());
  `);

  await db.query(`
    INSERT INTO "Semester" ("id", "semesterCode", "academicYear", "termName", "startDate", "endDate", "week4LockDate", "disputeWindowEndDate", "isActive", "createdAt", "updatedAt")
    VALUES ('sem-fall-2026', 'FALL2026', 2026, 'Fall 2026', NOW(), NOW() + INTERVAL '120 days', NOW() + INTERVAL '29 days', NOW() + INTERVAL '32 days', true, NOW(), NOW());
  `);

  // Insert Faculty Advisor User & Role
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-adv', 'FAC-00109', 'tanvir.ahmed@northsouth.edu', 'Dr. Tanvir Ahmed', '+8801711000001', 4.00, 20, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-adv', 'user-adv', 'FACULTY_ADVISOR', 1, 'EXECUTIVE', NULL, 1, NOW(), true, NOW(), NOW());
  `);

  // Insert President User & Role
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-pres', '2011234042', 'abrar.chowdhury@northsouth.edu', 'Abrar Chowdhury', '+8801711000002', 3.82, 6, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-pres', 'user-pres', 'PRESIDENT', 2, 'EXECUTIVE', 'role-adv', 1, NOW(), true, NOW(), NOW());
  `);
  console.log('   [PASS] Baseline records established.');

  // TEST 3: Office Term Limit Check Constraint (termCount <= 2)
  console.log('\n[TEST 3] Testing Office Term Limit Check Constraint (termCount <= 2)...');
  try {
    await db.query(`
      INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
      VALUES ('role-illegal-term', 'user-pres', 'PRESIDENT', 2, 'EXECUTIVE', 'role-adv', 3, NOW(), false, NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: Term limit constraint was not enforced!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('chk_role_term_limit')) {
      console.log('   [PASS] PASSED: chk_role_term_limit successfully rejected termCount = 3.');
    } else {
      throw err;
    }
  }

  // TEST 4: Executive Uniqueness Partial Unique Index
  console.log('\n[TEST 4] Testing Executive Uniqueness (Second Active President)...');
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-pres-2', '2019999042', 'imposter.pres@northsouth.edu', 'Imposter President', '+8801711000099', 3.50, 6, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  try {
    await db.query(`
      INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
      VALUES ('role-pres-2', 'user-pres-2', 'PRESIDENT', 2, 'EXECUTIVE', 'role-adv', 1, NOW(), true, NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: Second active President was allowed!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('uq_active_president')) {
      console.log('   [PASS] PASSED: uq_active_president partial index successfully blocked duplicate active President.');
    } else {
      throw err;
    }
  }

  // TEST 5: Coordinator Headcount Limit (Max 2 active Coordinators per department)
  console.log('\n[TEST 5] Testing Coordinator Cap Trigger (Max 2 active Coordinators per dept)...');
  // First, create VP, Music Dept Head, and 2 Coordinators
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-vp', '2021345042', 'nabil.rahman@northsouth.edu', 'Nabil Rahman', '+8801711000003', 3.75, 5, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-vp', 'user-vp', 'VICE_PRESIDENT', 3, 'EXECUTIVE', 'role-pres', 1, NOW(), true, NOW(), NOW());
  `);

  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-music-head', '2111678042', 'zafir.ahsan@northsouth.edu', 'Zafir Ahsan', '+8801711000006', 3.55, 4, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-music-head', 'user-music-head', 'DEPT_HEAD_MUSIC_PERFORMANCE', 4, 'MUSIC_AND_PERFORMANCE', 'role-vp', 1, NOW(), true, NOW(), NOW());
  `);

  // Coordinator 1
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-coord-1', '2211111042', 'coord1@northsouth.edu', 'Coord One', '+8801711000021', 3.50, 3, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-coord-1', 'user-coord-1', 'COORDINATOR', 5, 'MUSIC_AND_PERFORMANCE', 'role-music-head', 1, NOW(), true, NOW(), NOW());
  `);

  // Coordinator 2
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-coord-2', '2211112042', 'coord2@northsouth.edu', 'Coord Two', '+8801711000022', 3.50, 3, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-coord-2', 'user-coord-2', 'COORDINATOR', 5, 'MUSIC_AND_PERFORMANCE', 'role-music-head', 1, NOW(), true, NOW(), NOW());
  `);
  console.log('   [PASS] Successfully registered 2 active coordinators in Music & Performance.');

  // Attempt to add Coordinator 3 (Must Fail!)
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-coord-3', '2211113042', 'coord3@northsouth.edu', 'Coord Three', '+8801711000023', 3.50, 3, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  try {
    await db.query(`
      INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
      VALUES ('role-coord-3', 'user-coord-3', 'COORDINATOR', 5, 'MUSIC_AND_PERFORMANCE', 'role-music-head', 1, NOW(), true, NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: 3rd active coordinator was allowed in same department!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('Maximum cap of two active coordinators per department exceeded')) {
      console.log('   [PASS] PASSED: trg_enforce_coordinator_cap successfully aborted 3rd active coordinator.');
    } else {
      throw err;
    }
  }

  // TEST 6: Independent Auditor Disqualification (GS/Treasurer Barred)
  console.log('\n[TEST 6] Testing Independent Auditor Disqualification Trigger...');
  // Create General Secretary & Treasurer
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-gs', '2031456042', 'samira.hossain@northsouth.edu', 'Samira Hossain', '+8801711000004', 3.88, 5, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  await db.query(`
    INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
    VALUES ('role-gs', 'user-gs', 'GENERAL_SECRETARY', 3, 'EXECUTIVE', 'role-pres', 1, NOW(), true, NOW(), NOW());
  `);

  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-neutral-1', '2132123042', 'sarafat.karim@northsouth.edu', 'Sarafat Karim', '+8801711000013', 3.72, 4, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);

  // Attempt to create AuditReport with GS as auditor (Must Fail!)
  try {
    await db.query(`
      INSERT INTO "AuditReport" ("id", "semesterId", "auditor1Id", "auditor2Id", "termStartDate", "termEndDate", "totalInflows", "totalOutflows", "closingBankBalance", "closingPettyCashBalance", "discrepancyAmount", "auditFindingsSummary", "reportDocumentUrl", "status", "createdAt", "updatedAt")
      VALUES ('audit-fail', 'sem-fall-2026', 'user-gs', 'user-neutral-1', NOW(), NOW() + INTERVAL '100 days', 10000, 2000, 8000, 500, 0, 'Summary', 'url', 'IN_PROGRESS', NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: Active General Secretary was allowed as Independent Auditor!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('Active General Secretary or Treasurer cannot serve as an Independent Auditor')) {
      console.log('   [PASS] PASSED: trg_disqualify_auditor successfully barred General Secretary from Audit team.');
    } else {
      throw err;
    }
  }

  // TEST 7: Single-Supervisor Hierarchy Validation Trigger
  console.log('\n[TEST 7] Testing Single-Supervisor Hierarchy Rule (Invalid reporting line)...');
  // Attempt to insert an Event Head reporting to General Secretary instead of Vice President
  await db.query(`
    INSERT INTO "User" ("id", "studentId", "nsuEmail", "legalName", "contactPhone", "cgpa", "completedSemesters", "hasProctorialClearance", "standing", "joinedSemesterId", "createdAt", "updatedAt")
    VALUES ('user-event-head', '2121789042', 'mehnaz.islam@northsouth.edu', 'Mehnaz Islam', '+8801711000007', 3.60, 4, true, 'ACTIVE', 'sem-fall-2026', NOW(), NOW());
  `);
  try {
    await db.query(`
      INSERT INTO "RoleAssignment" ("id", "userId", "role", "tierLevel", "department", "supervisorId", "termCount", "startDate", "isActive", "createdAt", "updatedAt")
      VALUES ('role-event-head-illegal', 'user-event-head', 'DEPT_HEAD_EVENT_LOGISTICS', 4, 'EVENT_AND_LOGISTICS', 'role-gs', 1, NOW(), true, NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: Event Dept Head was allowed to report to General Secretary instead of Vice President!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('Event & Logistics Dept Head must report strictly to Vice President')) {
      console.log('   [PASS] PASSED: trg_validate_single_supervisor strictly enforced correct Tier 3 executive supervisor.');
    } else {
      throw err;
    }
  }

  // TEST 8: Dynamic Financial Tier Validation Trigger
  console.log('\n[TEST 8] Testing Financial Tier Validation Trigger...');
  // Attempt to insert Tier 1 requisition with amount 3,000 BDT (ceiling is 2,000 BDT)
  try {
    await db.query(`
      INSERT INTO "FinancialRequisition" ("id", "requisitionNumber", "semesterId", "title", "category", "amount", "tier", "disbursementType", "purpose", "beneficiaryPayee", "filedById", "status", "createdAt", "updatedAt")
      VALUES ('req-fail-tier1', 'REQ-2026-001', 'sem-fall-2026', 'Invalid Tier 1', 'PERFORMANCE_PRODUCTION', 3000.00, 'TIER_1', 'CASH_PETTY', 'Snacks', 'Vendor', 'user-music-head', 'DRAFT', NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: Tier 1 requisition over ceiling was allowed!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('exceeds dynamic Tier 1 ceiling')) {
      console.log('   [PASS] PASSED: trg_validate_financial_requisition blocked amount exceeding Tier 1 ceiling.');
    } else {
      throw err;
    }
  }

  // TEST 9: Creative Autonomy Firewall Trigger (Music Dept Mutate Exclusivity)
  console.log('\n[TEST 9] Testing Creative Autonomy Firewall (Section 12)...');
  await db.query(`
    INSERT INTO "TrackCatalog" ("id", "title", "originalArtist", "genre", "status", "createdAt", "updatedAt")
    VALUES ('track-01', 'Purono Shei Diner Kotha', 'Rabindranath Tagore', 'Rabindra Sangeet', 'IN_REPERTOIRE', NOW(), NOW());
  `);

  // Attempt to create arrangement with VP as arranger (VP is Executive, NOT Music Dept!)
  try {
    await db.query(`
      INSERT INTO "Arrangement" ("id", "trackCatalogId", "arrangerId", "title", "vocalArrangementNotes", "instrumentalArrangementNotes", "versionNumber", "createdAt", "updatedAt")
      VALUES ('arr-fail-1', 'track-01', 'user-vp', 'Acoustic Version', 'Soprano Lead', 'Acoustic Guitar', 1, NOW(), NOW());
    `);
    console.error('   [FAIL] FAILED: Executive Body member was allowed to create musical arrangement!');
    process.exit(1);
  } catch (err: any) {
    if (err.message.includes('Creative Autonomy Firewall Violation')) {
      console.log('   [PASS] PASSED: trg_creative_autonomy_firewall barred non-music member from mutating music arrangements.');
    } else {
      throw err;
    }
  }

  // Allowed: Music Head creates arrangement
  await db.query(`
    INSERT INTO "Arrangement" ("id", "trackCatalogId", "arrangerId", "title", "vocalArrangementNotes", "instrumentalArrangementNotes", "versionNumber", "createdAt", "updatedAt")
    VALUES ('arr-success-1', 'track-01', 'user-music-head', 'Acoustic Version', 'Soprano Lead', 'Acoustic Guitar', 1, NOW(), NOW());
  `);
  console.log('   [PASS] PASSED: Music Department Head successfully created musical arrangement.');

  console.log('\n[SUCCESS] ALL 9 CONSTITUTIONAL INVARIANT TESTS PASSED WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('Fatal Test Failure:', err);
  process.exit(1);
});
