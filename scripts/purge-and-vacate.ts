import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("================================================================================");
  console.log("[PURGE] Initiating complete database purge of all mock and seeded users...");
  console.log("================================================================================");

  // 1. Delete all relational child records
  await prisma.ballot.deleteMany({});
  await prisma.motion.deleteMany({});
  await prisma.meetingAttendance.deleteMany({});
  await prisma.meeting.deleteMany({});
  await prisma.petitionSignature.deleteMany({});
  await prisma.petition.deleteMany({});
  await prisma.resignationNotice.deleteMany({});
  await prisma.auditReport.deleteMany({});
  await prisma.financialRequisition.deleteMany({});
  await prisma.financialDeposit.deleteMany({});
  await prisma.disciplinaryAction.deleteMany({});
  await prisma.rosterDispute.deleteMany({});
  await prisma.activeRosterSnapshot.deleteMany({});
  await prisma.leaveApplication.deleteMany({});
  await prisma.attendanceRecord.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.investigationPanelMember.deleteMany({});
  await prisma.clubAsset.deleteMany({});
  await prisma.executiveNomination.deleteMany({});
  await prisma.selectionPanel.deleteMany({});
  await prisma.councilTransition.deleteMany({});
  await prisma.roleAssignment.deleteMany({});

  // 2. Delete all users completely
  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`[OK] Successfully purged ${deletedUsers.count} users from Neon PostgreSQL.`);

  // 3. Reset OrganizationConfig to clean baseline
  await prisma.organizationConfig.upsert({
    where: { id: "singleton" },
    update: {
      charterVersion: "2.0.0 (Official 15-Article Charter)",
      isPettyCashFrozen: false,
      bankBalance: 0.0,
      pettyCashBalance: 0.0,
      tier1MaxAmount: 2000.0,
      tier2MaxAmount: 20000.0,
    },
    create: {
      id: "singleton",
      clubTitle: "Soptosur - The Musical Club of NSU",
      osaApprovalDate: new Date("2026-09-30T00:00:00Z"),
      charterVersion: "2.0.0 (Official 15-Article Charter)",
      isPettyCashFrozen: false,
      bankBalance: 0.0,
      pettyCashBalance: 0.0,
      tier1MaxAmount: 2000.0,
      tier2MaxAmount: 20000.0,
    },
  });

  // 4. Ensure active semester exists
  await prisma.semester.upsert({
    where: { semesterCode: "FALL2026" },
    update: {
      isActive: true,
      isCompleted: false,
    },
    create: {
      semesterCode: "FALL2026",
      academicYear: 2026,
      termName: "Fall 2026",
      startDate: new Date("2026-09-01T00:00:00Z"),
      endDate: new Date("2026-12-31T23:59:59Z"),
      week4LockDate: new Date("2026-09-29T23:59:59Z"),
      disputeWindowEndDate: new Date("2026-10-02T23:59:59Z"),
      isActive: true,
      isCompleted: false,
    },
  });

  console.log("[OK] Neon PostgreSQL is now in 100% pure Genesis state with zero users.");
  console.log("[OK] All 10 Constitutional Offices are officially VACANT.");
  console.log("================================================================================");
}

main()
  .catch((e) => {
    console.error("[ERROR] Failed to purge database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
