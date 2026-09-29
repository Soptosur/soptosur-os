# Soptosur Chain of Command
## Soptosur Governance OS — Enterprise Database & Constitutional Engine (Phase 1)

Operating under **North South University (NSU) Office of Student Affairs (OSA)** regulations.

---

### Project Architecture Overview
- **Runtime & Language**: Node.js (ESM NodeNext), TypeScript
- **ORM & Data Modeling**: Prisma ORM (v6.19.3)
- **Database Engine**: PostgreSQL with raw PL/pgSQL triggers, check constraints, and partial unique indexes
- **Validation**: Full bidirectional relationship graphs, database-level constitutional invariants

---

### Constitutional 5-Tier Single-Supervisor Hierarchy
1. **Tier 1: Faculty Advisor**
   - Reports directly to NSU Administration / OSA (`supervisorId = null`).
2. **Tier 2: President**
   - Reports strictly to Faculty Advisor.
3. **Tier 3: Executive Officers**
   - Vice President, General Secretary, Treasurer report strictly to President.
4. **Tier 4: Department Heads**
   - **Music & Performance Dept Head** -> reports to Vice President.
   - **Event & Logistics Dept Head** -> reports to Vice President.
   - **Media & Design Dept Head** -> reports to General Secretary.
   - **Member Management & Discipline Dept Head** -> reports to General Secretary.
   - **Sponsorship & Partnership Dept Head** -> reports to Treasurer.
5. **Tier 5: Coordinators & General Members**
   - Report strictly to their respective Department Head.
   - Maximum cap of **two active coordinators per department** enforced via database trigger `trg_enforce_coordinator_cap`.

---

### Database-Enforced Constitutional Rules & Invariants
1. **Term Limits (Sections 3 & 5)**:
   - Check constraint `chk_role_term_limit` strictly enforces `termCount <= 2` across an officer's university tenure.
2. **Executive Uniqueness**:
   - Partial unique indexes ensure only one active user can simultaneously occupy `PRESIDENT`, `VICE_PRESIDENT`, `GENERAL_SECRETARY`, `TREASURER`, and each respective `DEPT_HEAD_*` role.
3. **Independent Auditor Disqualification (Section 9)**:
   - Trigger `trg_disqualify_auditor` immediately aborts any transaction attempting to assign an active General Secretary or Treasurer as an Independent Auditor.
   - Trigger `trg_prevent_auditor_becoming_executive` prevents active auditors from assuming GS or Treasurer roles.
4. **Dynamic Multi-Tier Financial Validation (Sections 9 & 11)**:
   - Trigger `trg_validate_financial_requisition` dynamically validates expenditure requests against configurable ceilings in `OrganizationConfig` (`tier1MaxAmount`, `tier2MaxAmount`).
   - Tier 1: Dual approval by GS & Treasurer; 72-hour receipt/voucher upload countdown.
   - Tier 2: Dual digital signatures from President & Treasurer.
   - Tier 3: Requires EB formal meeting resolution document attachment and Faculty Advisor written clearance.
   - System-wide petty cash freeze triggered automatically if vouchers are overdue past 72 hours.
5. **Creative Autonomy Firewall (Section 12)**:
   - Trigger `trg_creative_autonomy_firewall` protects song arrangements, vocal/instrumental assignments, and scores from external alteration, restricting write access strictly to active members of the `MUSIC_AND_PERFORMANCE` department.
6. **Parliamentary Operations Engine**:
   - Dual-quorum computation (40% active quorum for GBMs with 7-day adjournment; 33% Floor Quorum for constitutional amendments, removals, and dissolution).
   - Recusal tracking for officers facing complaints or conflicts of interest.

---

### Deliverables Manifest
- **`prisma/schema.prisma`**: 29 models, 15+ enums, explicit bidirectional relations, performance B-Tree and compound indexes.
- **`prisma/migrations/20260930000000_init_governance_rules/migration.sql`**: Complete PostgreSQL DDL (1400+ lines) including tables, constraints, partial unique indexes, and PL/pgSQL triggers.
- **`prisma/seed.ts`**: TypeScript seeding script initializing Singleton Config, Active Semester, Founder Council with Single-Supervisor hierarchy, Active Roster Snapshot, Neutral Auditors, and Immutable Audit Log.
- **`src/index.ts`**: Core exported Prisma client and governance constants.
- **`.env.example`**: PostgreSQL connection template.

---

### Execution Instructions
```bash
# Validate & Generate Prisma ORM
npm run prisma:validate
npm run prisma:format
npm run prisma:generate

# Build TypeScript Codebase
npm run build

# Run Phase 1 Database Invariant Tests (9 tests in PGlite)
npm run test:invariants

# Run Phase 2 Security & Anti-Bypass Guards Tests (8 tests)
npm run test:security

# Run All 17 Constitutional Tests
npm run test:all

# Next.js 14 Development Server (Port 3000)
npm run dev

# Strict TypeScript Compilation Check
npm run type-check

# Compile Next.js Production Build for Vercel
npm run build
```

---

### Phase 3: Next.js 14+ Role-Based Dashboards & Vercel Deployment

Phase 3 introduces an enterprise-grade responsive web frontend built with **Next.js 14+ (App Router)**, **Tailwind CSS**, and **Lucide Icons**:

#### Core Pages & Routes:
- `/` - Institutional Landing & Governance Gateway
- `/login` - NSU Domain Login Portal (`@northsouth.edu` validation) & 1-Click Persona Simulator
- `/dashboard` - Institutional Overview & 5-Tier Single-Supervisor Architectural Blueprint
- `/dashboard/advisor` - Tier 1: Whistleblower Tribunal Desk, Major Expenditure Approval Gate, Semester Audit Certification
- `/dashboard/president` - Tier 2: Dual-Signature Banking Desk, Executive Meeting Dispatcher (3/4 Quorum), 15-Day Vacancy Monitor
- `/dashboard/executive` - Tier 3: Treasurer Double-Entry Ledger, 72h Cash Bar, Petty Cash Freeze, GS Dispute Desk & Resignations Queue
- `/dashboard/departments` - Tier 4: Section 12 Creative Firewall Studio (write-protected for music lead, read-only spectator for others), 50% Attendance Cutoff Line
- `/dashboard/member` - Tier 5: Personal Attendance Meter, Leave Submission Drawer, Parliamentary Voting Booth (conflict recusal), Digital Petitions (25% threshold)
- `/unauthorized` - Next.js Middleware Edge deep-link route tampering interception

