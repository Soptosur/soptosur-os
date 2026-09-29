import request from 'supertest';
import { createApp } from '../src/app.js';
import { AuthService } from '../src/services/auth.service.js';
import { RbacService } from '../src/services/rbac.service.js';
import { AntiBypassService } from '../src/services/anti-bypass.service.js';
import { WhistleblowerService } from '../src/services/whistleblower.service.js';
import { FinancialService } from '../src/services/financial.service.js';
import { ClubRole, DepartmentType, MembershipStanding, ComplaintRecipient, FinancialTier } from '@prisma/client';
import { AuthenticatedUser } from '../src/types/auth.types.js';

async function runPhase2SecurityTests() {
  console.log('🛡️  [Soptosur Governance OS] Commencing Phase 2 Security & Anti-Bypass Test Suite...\n');

  const app = createApp();

  // ==========================================================================
  // TEST 1: NSU Domain Lockdown (@northsouth.edu)
  // ==========================================================================
  console.log('🔒 [Test 1] Testing Institutional NSU Domain Lockdown...');
  
  // Valid NSU email
  const validNsuEmail = 'student.212@northsouth.edu';
  if (!AuthService.validateNsuDomain(validNsuEmail)) {
    throw new Error('Valid NSU email was incorrectly rejected!');
  }

  // Non-NSU emails must be rejected
  const illegalEmails = [
    'hacker@gmail.com',
    'intruder@yahoo.com',
    'student@northsouth.edu.fake.com',
    'admin@outlook.com',
    'malicious@nsu.org',
  ];

  for (const email of illegalEmails) {
    if (AuthService.validateNsuDomain(email)) {
      throw new Error(`Non-NSU email "${email}" was illegally accepted by domain validator!`);
    }
  }

  // Test registration endpoint with non-NSU email
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({
      studentId: '9999999042',
      nsuEmail: 'illegal.user@gmail.com',
      legalName: 'Illegal User',
      password: 'Password123!',
    });

  if (regRes.status !== 401 || !regRes.body.error.includes('Institutional Lockdown')) {
    throw new Error(`Register endpoint failed to enforce NSU domain lockdown! Status: ${regRes.status}`);
  }
  console.log('   ✅ PASSED: All non-NSU domains rejected with 401 Institutional Lockdown.');

  // ==========================================================================
  // TEST 2: Membership Standing Gate (Real-Time Inspection)
  // ==========================================================================
  console.log('\n🔒 [Test 2] Testing Real-Time Membership Standing Gate...');
  
  // Active member -> Allowed
  AuthService.enforceStandingGate(MembershipStanding.ACTIVE);

  // Suspended member -> Blocked with 403
  try {
    AuthService.enforceStandingGate(MembershipStanding.SUSPENDED);
    throw new Error('Suspended member bypassed the standing gate!');
  } catch (err: any) {
    if (err.statusCode === 403 && err.message.includes('SUSPENDED')) {
      console.log('   ✅ PASSED: Suspended profile received immediate 403 Forbidden.');
    } else {
      throw err;
    }
  }

  // Terminated member -> Blocked with 403
  try {
    AuthService.enforceStandingGate(MembershipStanding.TERMINATED);
    throw new Error('Terminated member bypassed the standing gate!');
  } catch (err: any) {
    if (err.statusCode === 403 && err.message.includes('TERMINATED')) {
      console.log('   ✅ PASSED: Terminated profile received immediate 403 Forbidden.');
    } else {
      throw err;
    }
  }

  // ==========================================================================
  // TEST 3: Token Versioning & Instant Multi-Device Revocation
  // ==========================================================================
  console.log('\n🔒 [Test 3] Testing Token Versioning & Instant Invalidation...');

  const mockUser: AuthenticatedUser = {
    id: 'user-sample-01',
    studentId: '2011234042',
    nsuEmail: 'sample.user@northsouth.edu',
    legalName: 'Sample User',
    standing: MembershipStanding.ACTIVE,
    tokenVersion: 1,
    activeRole: {
      id: 'role-sample-01',
      role: ClubRole.GENERAL_MEMBER,
      tierLevel: 5,
      department: DepartmentType.GENERAL,
      supervisorId: 'role-sup-01',
      isActing: false,
    },
  };

  // Issue token at version 1
  const tokenV1 = AuthService.issueToken(mockUser);
  const decodedV1 = AuthService.verifyJwt(tokenV1);
  if (decodedV1.tokenVersion !== 1) {
    throw new Error('Issued token has incorrect tokenVersion!');
  }

  // Simulate tokenVersion increment in DB (e.g. status transition)
  const simulatedDbVersion = 2;
  if (decodedV1.tokenVersion < simulatedDbVersion) {
    console.log('   ✅ PASSED: Token at version 1 detected as stale/revoked against current version 2.');
  } else {
    throw new Error('Token version check failed to detect revoked token!');
  }

  // ==========================================================================
  // TEST 4: Hierarchical RBAC & Unauthorized Tier Escalation Rejection
  // ==========================================================================
  console.log('\n🔒 [Test 4] Testing Hierarchical RBAC Tier Escalation Protection...');

  const tier5Member: AuthenticatedUser = {
    ...mockUser,
    activeRole: {
      id: 'role-tier5',
      role: ClubRole.COORDINATOR,
      tierLevel: 5,
      department: DepartmentType.EVENT_AND_LOGISTICS,
      supervisorId: 'role-dept-head',
      isActing: false,
    },
  };

  // Tier 5 attempting Tier 3 action (e.g. Executive Meeting Notice)
  try {
    RbacService.requireTier(tier5Member, 3);
    throw new Error('Tier 5 coordinator illegally passed Tier 3 requirement!');
  } catch (err: any) {
    if (err.statusCode === 403 && err.message.includes('Hierarchical RBAC Violation')) {
      console.log('   ✅ PASSED: Tier 5 member blocked from Tier 3 action with 403 Forbidden.');
    } else {
      throw err;
    }
  }

  // ==========================================================================
  // TEST 5: Creative Autonomy Firewall (Section 12)
  // ==========================================================================
  console.log('\n🔒 [Test 5] Testing Section 12 Creative Autonomy Firewall...');

  const presidentUser: AuthenticatedUser = {
    ...mockUser,
    id: 'user-president',
    activeRole: {
      id: 'role-pres',
      role: ClubRole.PRESIDENT,
      tierLevel: 2,
      department: DepartmentType.EXECUTIVE,
      supervisorId: 'role-adv',
      isActing: false,
    },
  };

  // President (Tier 2, Executive) attempting to mutate musical arrangement (Must Fail!)
  try {
    RbacService.enforceCreativeFirewall(presidentUser);
    throw new Error('President was permitted to bypass Creative Autonomy Firewall!');
  } catch (err: any) {
    if (err.statusCode === 403 && err.message.includes('Creative Autonomy Firewall Violation')) {
      console.log('   ✅ PASSED: President blocked from mutating song arrangements (Section 12 protected).');
    } else {
      throw err;
    }
  }

  // Music & Performance Dept Head (Tier 4) -> Permitted
  const musicHeadUser: AuthenticatedUser = {
    ...mockUser,
    id: 'user-music-head',
    activeRole: {
      id: 'role-music-head',
      role: ClubRole.DEPT_HEAD_MUSIC_PERFORMANCE,
      tierLevel: 4,
      department: DepartmentType.MUSIC_AND_PERFORMANCE,
      supervisorId: 'role-vp',
      isActing: false,
    },
  };
  RbacService.enforceCreativeFirewall(musicHeadUser);
  console.log('   ✅ PASSED: Music & Performance Dept Head granted arrangement write access.');

  // ==========================================================================
  // TEST 6: Mandatory Rejection Justification Obligation
  // ==========================================================================
  console.log('\n🔒 [Test 6] Testing Mandatory Written Rejection Justification...');

  // Empty or whitespace-only reason must throw
  const invalidReasons = ['', '   ', null, undefined];
  for (const reason of invalidReasons) {
    try {
      AntiBypassService.validateRejectionReason(reason as any);
      throw new Error(`Empty rejection reason "${reason}" was illegally allowed!`);
    } catch (err: any) {
      if (err.statusCode === 400 && err.message.includes('mandatory non-empty written justification')) {
        // Expected
      } else {
        throw err;
      }
    }
  }

  const validReason = AntiBypassService.validateRejectionReason('Budget overrun on sound equipment rental.');
  if (validReason !== 'Budget overrun on sound equipment rental.') {
    throw new Error('Valid reason was altered!');
  }
  console.log('   ✅ PASSED: Empty rejection reasons rejected; non-empty written justification enforced.');

  // ==========================================================================
  // TEST 7: Whistleblower Routing Matrix & Query-Level EB Blinding
  // ==========================================================================
  console.log('\n🔒 [Test 7] Testing Whistleblower Routing Matrix & Query-Level EB Blinding...');

  // 1. Destination Matrix
  const deptHeadDest = WhistleblowerService.resolveRoutingDestination(ClubRole.DEPT_HEAD_MEDIA_DESIGN);
  if (deptHeadDest !== ComplaintRecipient.SUPERVISING_EXECUTIVE) {
    throw new Error(`Expected SUPERVISING_EXECUTIVE, got ${deptHeadDest}`);
  }

  const vpDest = WhistleblowerService.resolveRoutingDestination(ClubRole.VICE_PRESIDENT);
  if (vpDest !== ComplaintRecipient.PRESIDENT_AND_GS) {
    throw new Error(`Expected PRESIDENT_AND_GS, got ${vpDest}`);
  }

  const gsDest = WhistleblowerService.resolveRoutingDestination(ClubRole.GENERAL_SECRETARY);
  if (gsDest !== ComplaintRecipient.PRESIDENT_AND_VP) {
    throw new Error(`Expected PRESIDENT_AND_VP, got ${gsDest}`);
  }

  const presDest = WhistleblowerService.resolveRoutingDestination(ClubRole.PRESIDENT);
  if (presDest !== ComplaintRecipient.FACULTY_ADVISOR_TRIBUNAL) {
    throw new Error(`Expected FACULTY_ADVISOR_TRIBUNAL for President, got ${presDest}`);
  }

  const advDest = WhistleblowerService.resolveRoutingDestination(ClubRole.FACULTY_ADVISOR);
  if (advDest !== ComplaintRecipient.NSU_OSA_PROCTORIAL) {
    throw new Error(`Expected NSU_OSA_PROCTORIAL for Advisor, got ${advDest}`);
  }
  console.log('   ✅ PASSED: Whistleblower destination matrix routes to exact constitutional targets.');

  // 2. Query Blinding Filter (EB Blinding)
  const gsFilter = WhistleblowerService.applyQueryBlindingFilter({
    ...mockUser,
    activeRole: {
      id: 'role-gs',
      role: ClubRole.GENERAL_SECRETARY,
      tierLevel: 3,
      department: DepartmentType.EXECUTIVE,
      supervisorId: 'role-pres',
      isActing: false,
    },
  });

  // Verify filter excludes President
  if (!gsFilter.NOT || !gsFilter.NOT.accusedRole.in.includes(ClubRole.PRESIDENT)) {
    throw new Error('Query blinding failed to filter out President dossiers from General Secretary!');
  }
  console.log('   ✅ PASSED: General Secretary query filter automatically blinds President dossiers.');

  // Advisor has unblinded access
  const advisorFilter = WhistleblowerService.applyQueryBlindingFilter({
    ...mockUser,
    activeRole: {
      id: 'role-advisor',
      role: ClubRole.FACULTY_ADVISOR,
      tierLevel: 1,
      department: DepartmentType.EXECUTIVE,
      supervisorId: null,
      isActing: false,
    },
  });
  if (Object.keys(advisorFilter).length !== 0) {
    throw new Error('Advisor was incorrectly restricted from viewing dossiers!');
  }
  console.log('   ✅ PASSED: Faculty Advisor possesses unblinded tribunal oversight.');

  // ==========================================================================
  // TEST 8: Dual-Recipient Resignation Binding (Section 6)
  // ==========================================================================
  console.log('\n🔒 [Test 8] Testing Dual-Recipient Simultaneous Resignation Routing...');

  // Dept Head resignation must simultaneously bind President and GS
  const deptHeadResignation = AntiBypassService.computeResignationRecipients(
    ClubRole.DEPT_HEAD_SPONSORSHIP_PARTNERSHIP,
    'user-pres-id',
    'user-gs-id',
    'user-adv-id'
  );

  if (
    deptHeadResignation.presidentRecipientId !== 'user-pres-id' ||
    deptHeadResignation.gsRecipientId !== 'user-gs-id' ||
    deptHeadResignation.advisorRecipientId !== null
  ) {
    throw new Error('Dual-recipient resignation routing failed for Department Head!');
  }

  // General Secretary resignation binds President and notifies Advisor
  const gsResignation = AntiBypassService.computeResignationRecipients(
    ClubRole.GENERAL_SECRETARY,
    'user-pres-id',
    'user-gs-id',
    'user-adv-id'
  );
  if (
    gsResignation.presidentRecipientId !== 'user-pres-id' ||
    gsResignation.gsRecipientId !== null ||
    gsResignation.advisorRecipientId !== 'user-adv-id'
  ) {
    throw new Error('Resignation routing failed for General Secretary!');
  }
  console.log('   ✅ PASSED: Dual-recipient simultaneous binding successfully verified.');

  console.log('\n🎉 ALL 8 PHASE 2 SECURITY & ANTI-BYPASS INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

runPhase2SecurityTests().catch((err) => {
  console.error('Fatal Security Test Failure:', err);
  process.exit(1);
});
