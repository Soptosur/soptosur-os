import { PrismaClient, MembershipStanding, ClubRole, DepartmentType, RosterSnapshotType, AuditStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('[BOOTSTRAP] [Soptosur Governance OS] Commencing Enterprise Database Bootstrap...');

  // ==========================================================================
  // 1. SINGLETON ORGANIZATION CONFIGURATION
  // ==========================================================================
  console.log('[CONFIG] Initializing singleton OrganizationConfig with constitutional ceilings...');
  const config = await prisma.organizationConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      clubTitle: 'Soptosur - The Musical Club of NSU',
      osaApprovalDate: new Date('2026-01-15T00:00:00Z'),
      charterVersion: '1.0.0',
      isPettyCashFrozen: false,
      bankBalance: 150000.00,
      pettyCashBalance: 15000.00,
      tier1MaxAmount: 2000.00,   // Base Tier 1: up to 2,000 BDT
      tier2MaxAmount: 20000.00,  // Base Tier 2: 2,001 to 20,000 BDT
    },
  });
  console.log(`   ✅ OrganizationConfig initialized. Charter Version: ${config.charterVersion}`);

  // ==========================================================================
  // 2. ACTIVE ACADEMIC SEMESTER
  // ==========================================================================
  console.log('📅 Initializing active academic semester...');
  const semester = await prisma.semester.upsert({
    where: { semesterCode: 'FALL2026' },
    update: {},
    create: {
      semesterCode: 'FALL2026',
      academicYear: 2026,
      termName: 'Fall 2026',
      startDate: new Date('2026-09-01T00:00:00Z'),
      endDate: new Date('2026-12-31T23:59:59Z'),
      week4LockDate: new Date('2026-09-29T23:59:59Z'),        // Day 29
      disputeWindowEndDate: new Date('2026-10-02T23:59:59Z'), // Exactly 72 hours later
      isActive: true,
      isCompleted: false,
    },
  });
  console.log(`   ✅ Active Semester: ${semester.termName} (${semester.semesterCode})`);

  // ==========================================================================
  // 3. FOUNDER COUNCIL IDENTITIES & ROLE ASSIGNMENTS
  //    Enforces 5-Tier Hierarchy & Single-Supervisor Invariant
  // ==========================================================================
  console.log('👥 Bootstrapping Founder Council & Single-Supervisor Hierarchy...');

  // --- Tier 1: Faculty Advisor ---
  const advisorUser = await prisma.user.upsert({
    where: { studentId: 'FAC-00109' },
    update: {},
    create: {
      studentId: 'FAC-00109',
      nsuEmail: 'tanvir.ahmed@northsouth.edu',
      legalName: 'Dr. Tanvir Ahmed',
      contactPhone: '+8801711000001',
      cgpa: 4.00,
      completedSemesters: 20,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const advisorRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier1-advisor' },
    update: {},
    create: {
      id: 'role-tier1-advisor',
      userId: advisorUser.id,
      role: ClubRole.FACULTY_ADVISOR,
      tierLevel: 1,
      department: DepartmentType.EXECUTIVE,
      supervisorId: null, // Tier 1 reports strictly to NSU Administration / OSA
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // --- Tier 2: President (Reports strictly to Faculty Advisor) ---
  const presidentUser = await prisma.user.upsert({
    where: { studentId: '2011234042' },
    update: {},
    create: {
      studentId: '2011234042',
      nsuEmail: 'abrar.chowdhury@northsouth.edu',
      legalName: 'Abrar Chowdhury',
      contactPhone: '+8801711000002',
      cgpa: 3.82,
      completedSemesters: 6,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const presidentRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier2-president' },
    update: {},
    create: {
      id: 'role-tier2-president',
      userId: presidentUser.id,
      role: ClubRole.PRESIDENT,
      tierLevel: 2,
      department: DepartmentType.EXECUTIVE,
      supervisorId: advisorRole.id, // Strictly reports to Faculty Advisor
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // --- Tier 3: Vice President, General Secretary, Treasurer (Report strictly to President) ---
  const vpUser = await prisma.user.upsert({
    where: { studentId: '2021345042' },
    update: {},
    create: {
      studentId: '2021345042',
      nsuEmail: 'nabil.rahman@northsouth.edu',
      legalName: 'Nabil Rahman',
      contactPhone: '+8801711000003',
      cgpa: 3.75,
      completedSemesters: 5,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const vpRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier3-vp' },
    update: {},
    create: {
      id: 'role-tier3-vp',
      userId: vpUser.id,
      role: ClubRole.VICE_PRESIDENT,
      tierLevel: 3,
      department: DepartmentType.EXECUTIVE,
      supervisorId: presidentRole.id, // Strictly reports to President
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  const gsUser = await prisma.user.upsert({
    where: { studentId: '2031456042' },
    update: {},
    create: {
      studentId: '2031456042',
      nsuEmail: 'samira.hossain@northsouth.edu',
      legalName: 'Samira Hossain',
      contactPhone: '+8801711000004',
      cgpa: 3.88,
      completedSemesters: 5,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const gsRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier3-gs' },
    update: {},
    create: {
      id: 'role-tier3-gs',
      userId: gsUser.id,
      role: ClubRole.GENERAL_SECRETARY,
      tierLevel: 3,
      department: DepartmentType.EXECUTIVE,
      supervisorId: presidentRole.id, // Strictly reports to President
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  const treasurerUser = await prisma.user.upsert({
    where: { studentId: '2011567042' },
    update: {},
    create: {
      studentId: '2011567042',
      nsuEmail: 'farhan.kabir@northsouth.edu',
      legalName: 'Farhan Kabir',
      contactPhone: '+8801711000005',
      cgpa: 3.65,
      completedSemesters: 6,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const treasurerRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier3-treasurer' },
    update: {},
    create: {
      id: 'role-tier3-treasurer',
      userId: treasurerUser.id,
      role: ClubRole.TREASURER,
      tierLevel: 3,
      department: DepartmentType.EXECUTIVE,
      supervisorId: presidentRole.id, // Strictly reports to President
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // --- Tier 4: Department Heads ---
  // Music & Performance Head -> Reports to Vice President
  const musicHeadUser = await prisma.user.upsert({
    where: { studentId: '2111678042' },
    update: {},
    create: {
      studentId: '2111678042',
      nsuEmail: 'zafir.ahsan@northsouth.edu',
      legalName: 'Zafir Ahsan',
      contactPhone: '+8801711000006',
      cgpa: 3.55,
      completedSemesters: 4,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const musicHeadRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier4-head-music' },
    update: {},
    create: {
      id: 'role-tier4-head-music',
      userId: musicHeadUser.id,
      role: ClubRole.DEPT_HEAD_MUSIC_PERFORMANCE,
      tierLevel: 4,
      department: DepartmentType.MUSIC_AND_PERFORMANCE,
      supervisorId: vpRole.id, // Strictly reports to Vice President
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // Event & Logistics Head -> Reports to Vice President
  const eventHeadUser = await prisma.user.upsert({
    where: { studentId: '2121789042' },
    update: {},
    create: {
      studentId: '2121789042',
      nsuEmail: 'mehnaz.islam@northsouth.edu',
      legalName: 'Mehnaz Islam',
      contactPhone: '+8801711000007',
      cgpa: 3.60,
      completedSemesters: 4,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const eventHeadRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier4-head-event' },
    update: {},
    create: {
      id: 'role-tier4-head-event',
      userId: eventHeadUser.id,
      role: ClubRole.DEPT_HEAD_EVENT_LOGISTICS,
      tierLevel: 4,
      department: DepartmentType.EVENT_AND_LOGISTICS,
      supervisorId: vpRole.id, // Strictly reports to Vice President
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // Media & Design Head -> Reports to General Secretary
  const mediaHeadUser = await prisma.user.upsert({
    where: { studentId: '2131890042' },
    update: {},
    create: {
      studentId: '2131890042',
      nsuEmail: 'rayan.siddiqui@northsouth.edu',
      legalName: 'Rayan Siddiqui',
      contactPhone: '+8801711000008',
      cgpa: 3.70,
      completedSemesters: 3,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const mediaHeadRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier4-head-media' },
    update: {},
    create: {
      id: 'role-tier4-head-media',
      userId: mediaHeadUser.id,
      role: ClubRole.DEPT_HEAD_MEDIA_DESIGN,
      tierLevel: 4,
      department: DepartmentType.MEDIA_AND_DESIGN,
      supervisorId: gsRole.id, // Strictly reports to General Secretary
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // Member Management & Discipline Head -> Reports to General Secretary
  const memberMgmtHeadUser = await prisma.user.upsert({
    where: { studentId: '2111901042' },
    update: {},
    create: {
      studentId: '2111901042',
      nsuEmail: 'tasnim.haque@northsouth.edu',
      legalName: 'Tasnim Haque',
      contactPhone: '+8801711000009',
      cgpa: 3.80,
      completedSemesters: 4,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const memberMgmtHeadRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier4-head-member-mgmt' },
    update: {},
    create: {
      id: 'role-tier4-head-member-mgmt',
      userId: memberMgmtHeadUser.id,
      role: ClubRole.DEPT_HEAD_MEMBER_MANAGEMENT,
      tierLevel: 4,
      department: DepartmentType.MEMBER_MANAGEMENT_AND_DISCIPLINE,
      supervisorId: gsRole.id, // Strictly reports to General Secretary
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // Sponsorship & Partnership Head -> Reports to Treasurer
  const sponsorshipHeadUser = await prisma.user.upsert({
    where: { studentId: '2122012042' },
    update: {},
    create: {
      studentId: '2122012042',
      nsuEmail: 'kazi.shahriar@northsouth.edu',
      legalName: 'Kazi Shahriar',
      contactPhone: '+8801711000010',
      cgpa: 3.68,
      completedSemesters: 4,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  const sponsorshipHeadRole = await prisma.roleAssignment.upsert({
    where: { id: 'role-tier4-head-sponsorship' },
    update: {},
    create: {
      id: 'role-tier4-head-sponsorship',
      userId: sponsorshipHeadUser.id,
      role: ClubRole.DEPT_HEAD_SPONSORSHIP_PARTNERSHIP,
      tierLevel: 4,
      department: DepartmentType.SPONSORSHIP_AND_PARTNERSHIP,
      supervisorId: treasurerRole.id, // Strictly reports to Treasurer
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // --- Tier 5: Department Coordinators (Max 2 per Department) ---
  const musicCoordUser = await prisma.user.upsert({
    where: { studentId: '2212345042' },
    update: {},
    create: {
      studentId: '2212345042',
      nsuEmail: 'arham.karim@northsouth.edu',
      legalName: 'Arham Karim',
      contactPhone: '+8801711000011',
      cgpa: 3.40,
      completedSemesters: 3,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  await prisma.roleAssignment.upsert({
    where: { id: 'role-tier5-coord-music' },
    update: {},
    create: {
      id: 'role-tier5-coord-music',
      userId: musicCoordUser.id,
      role: ClubRole.COORDINATOR,
      tierLevel: 5,
      department: DepartmentType.MUSIC_AND_PERFORMANCE,
      supervisorId: musicHeadRole.id, // Reports strictly to Music Dept Head
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  const logisticsCoordUser = await prisma.user.upsert({
    where: { studentId: '2222456042' },
    update: {},
    create: {
      studentId: '2222456042',
      nsuEmail: 'sarah.zaman@northsouth.edu',
      legalName: 'Sarah Zaman',
      contactPhone: '+8801711000012',
      cgpa: 3.52,
      completedSemesters: 3,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  await prisma.roleAssignment.upsert({
    where: { id: 'role-tier5-coord-logistics' },
    update: {},
    create: {
      id: 'role-tier5-coord-logistics',
      userId: logisticsCoordUser.id,
      role: ClubRole.COORDINATOR,
      tierLevel: 5,
      department: DepartmentType.EVENT_AND_LOGISTICS,
      supervisorId: eventHeadRole.id, // Reports strictly to Event & Logistics Dept Head
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // ==========================================================================
  // 4. TWO NEUTRAL ACTIVE MEMBERS AS INTERIM AUDIT TEAM
  //    (Advisor consent, barred from GS & Treasurer)
  // ==========================================================================
  console.log('⚖️  Seeding Two Neutral Independent Auditors...');

  const auditor1User = await prisma.user.upsert({
    where: { studentId: '2132123042' },
    update: {},
    create: {
      studentId: '2132123042',
      nsuEmail: 'sarafat.karim@northsouth.edu',
      legalName: 'Sarafat Karim',
      contactPhone: '+8801711000013',
      cgpa: 3.72,
      completedSemesters: 4,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  await prisma.roleAssignment.upsert({
    where: { id: 'role-tier5-member-auditor1' },
    update: {},
    create: {
      id: 'role-tier5-member-auditor1',
      userId: auditor1User.id,
      role: ClubRole.GENERAL_MEMBER,
      tierLevel: 5,
      department: DepartmentType.GENERAL,
      supervisorId: memberMgmtHeadRole.id,
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  const auditor2User = await prisma.user.upsert({
    where: { studentId: '2112234042' },
    update: {},
    create: {
      studentId: '2112234042',
      nsuEmail: 'anika.tabassum@northsouth.edu',
      legalName: 'Anika Tabassum',
      contactPhone: '+8801711000014',
      cgpa: 3.65,
      completedSemesters: 4,
      hasProctorialClearance: true,
      standing: MembershipStanding.ACTIVE,
      joinedSemesterId: semester.id,
    },
  });

  await prisma.roleAssignment.upsert({
    where: { id: 'role-tier5-member-auditor2' },
    update: {},
    create: {
      id: 'role-tier5-member-auditor2',
      userId: auditor2User.id,
      role: ClubRole.GENERAL_MEMBER,
      tierLevel: 5,
      department: DepartmentType.GENERAL,
      supervisorId: memberMgmtHeadRole.id,
      termCount: 1,
      startDate: new Date('2026-01-15T00:00:00Z'),
      isActive: true,
      isActing: false,
    },
  });

  // Seed interim audit report for active semester
  await prisma.auditReport.upsert({
    where: { semesterId: semester.id },
    update: {},
    create: {
      semesterId: semester.id,
      auditor1Id: auditor1User.id,
      auditor2Id: auditor2User.id,
      advisorSignerId: advisorUser.id,
      termStartDate: semester.startDate,
      termEndDate: semester.endDate,
      totalInflows: 150000.00,
      totalOutflows: 0.00,
      closingBankBalance: 150000.00,
      closingPettyCashBalance: 15000.00,
      discrepancyAmount: 0.00,
      auditFindingsSummary: 'Interim founder audit report initialized under Section 9. Opening balances verified with NSU OSA financial clearance.',
      status: AuditStatus.IN_PROGRESS,
      reportDocumentUrl: 'https://docs.soptosur.northsouth.edu/audits/fall2026_interim_audit.pdf',
    },
  });
  console.log('   [OK] Independent Audit Team & Interim Audit Report instantiated.');

  // ==========================================================================
  // 5. INITIAL ACTIVE ROSTER SNAPSHOT (Founder / Primary Member List)
  // ==========================================================================
  console.log('[ROSTER] Initializing Founder Council Active Roster Snapshot (100% Attendance)...');

  const allSeedUsers = [
    advisorUser, presidentUser, vpUser, gsUser, treasurerUser,
    musicHeadUser, eventHeadUser, mediaHeadUser, memberMgmtHeadUser, sponsorshipHeadUser,
    musicCoordUser, logisticsCoordUser, auditor1User, auditor2User
  ];

  for (const user of allSeedUsers) {
    await prisma.activeRosterSnapshot.upsert({
      where: {
        semesterId_userId_snapshotType: {
          semesterId: semester.id,
          userId: user.id,
          snapshotType: RosterSnapshotType.FOUNDER_INITIAL,
        },
      },
      update: {},
      create: {
        semesterId: semester.id,
        userId: user.id,
        snapshotType: RosterSnapshotType.FOUNDER_INITIAL,
        totalOfficialEvents: 10,
        attendedEvents: 10,
        authorizedLeaves: 0,
        effectiveDenominator: 10,
        attendancePercentage: 100.00,
        isActive: true,
        isLocked: true,
      },
    });
  }
  console.log(`   [OK] Active Roster Snapshot initialized for ${allSeedUsers.length} primary members.`);

  // ==========================================================================
  // 6. IMMUTABLE AUDIT LOG BOOTSTRAP RECORD
  // ==========================================================================
  console.log('[AUDIT] Appending initial bootstrap ledger entry to immutable AuditLog...');
  await prisma.auditLog.create({
    data: {
      userId: advisorUser.id,
      action: 'SYSTEM_BOOTSTRAP_INITIALIZED',
      targetEntity: 'OrganizationConfig',
      targetEntityId: config.id,
      ipAddress: '127.0.0.1',
      diffPayload: {
        charterVersion: config.charterVersion,
        osaApprovalDate: config.osaApprovalDate,
        activeSemester: semester.semesterCode,
        founderCouncilCount: allSeedUsers.length,
        governanceRules: {
          singleSupervisorEnforced: true,
          auditorDisqualificationEnforced: true,
          coordinatorCapPerDept: 2,
          termLimitMax: 2,
          pettyCashCeilingBDT: 2000,
          tier2CeilingBDT: 20000,
        },
      },
    },
  });
  console.log('   [OK] Immutable AuditLog bootstrap record committed.');

  console.log('\n[SUCCESS] [Soptosur Governance OS] Phase 1 Database Architecture & Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('[ERROR] Seeding failed with error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
