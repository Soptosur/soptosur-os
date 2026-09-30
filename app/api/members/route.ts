import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ROLE_TITLES: Record<string, string> = {
  FACULTY_ADVISOR: "Faculty Advisor",
  PRESIDENT: "Club President",
  ACTING_PRESIDENT: "Acting President",
  VICE_PRESIDENT: "Vice President",
  GENERAL_SECRETARY: "General Secretary",
  TREASURER: "Treasurer",
  ACTING_OFFICER: "Acting Officer",
  DEPT_HEAD_MUSIC_PERFORMANCE: "Music & Performance Head",
  DEPT_HEAD_EVENT_LOGISTICS: "Event & Logistics Head",
  DEPT_HEAD_MEDIA_DESIGN: "Media & Design Head",
  DEPT_HEAD_MEMBER_MANAGEMENT: "Member Management Head",
  DEPT_HEAD_SPONSORSHIP_PARTNERSHIP: "Sponsorship & Partnership Head",
  COORDINATOR: "Department Coordinator",
  GENERAL_MEMBER: "General Assembly Member",
};

const DEPT_LABELS: Record<string, string> = {
  EXECUTIVE: "Executive Council",
  MUSIC_AND_PERFORMANCE: "Music & Performance",
  EVENT_AND_LOGISTICS: "Event & Logistics",
  MEDIA_AND_DESIGN: "Media & Design",
  MEMBER_MANAGEMENT_AND_DISCIPLINE: "Member Management & Discipline",
  SPONSORSHIP_AND_PARTNERSHIP: "Sponsorship & Partnership",
  GENERAL: "General Assembly",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const tierFilter = searchParams.get("tier");
    const deptFilter = searchParams.get("department");

    // Fetch users with their active role assignments and supervisor relationships
    const users = await prisma.user.findMany({
      include: {
        roleAssignments: {
          where: { isActive: true },
          include: {
            supervisor: {
              include: {
                user: {
                  select: {
                    legalName: true,
                    studentId: true,
                  },
                },
              },
            },
          },
        },
        joinedSemester: {
          select: {
            termName: true,
            semesterCode: true,
          },
        },
      },
      orderBy: [
        { legalName: "asc" },
      ],
    });

    // Map each user into a clean, normalized governance roster record
    const formattedMembers = users.map((u) => {
      const activeRole = u.roleAssignments[0] || null;
      const tier = activeRole ? activeRole.tierLevel : 5;
      const roleEnum = activeRole ? activeRole.role : "GENERAL_MEMBER";
      const roleTitle = ROLE_TITLES[roleEnum] || roleEnum.replace(/_/g, " ");
      const deptEnum = activeRole ? activeRole.department : "GENERAL";
      const departmentLabel = DEPT_LABELS[deptEnum] || deptEnum.replace(/_/g, " ");
      const supervisor = activeRole?.supervisor?.user
        ? `${activeRole.supervisor.user.legalName} (${activeRole.supervisor.role})`
        : tier === 1
        ? "NSU OSA & University Administration"
        : null;

      let tierLabel = `Tier ${tier}: Member`;
      if (tier === 1) tierLabel = "Tier 1: Faculty Advisor";
      else if (tier === 2) tierLabel = "Tier 2: Club President";
      else if (tier === 3) tierLabel = `Tier 3: Executive Board`;
      else if (tier === 4) tierLabel = `Tier 4: Department Head`;
      else if (tier === 5) tierLabel = activeRole?.role === "COORDINATOR" ? "Tier 5: Coordinator" : "Tier 5: General Member";

      return {
        id: u.id,
        studentId: u.studentId,
        nsuEmail: u.nsuEmail,
        legalName: u.legalName,
        contactPhone: u.contactPhone || null,
        avatarUrl: u.avatarUrl || null,
        standing: u.standing,
        hasProctorialClearance: u.hasProctorialClearance,
        cgpa: u.cgpa ? u.cgpa.toString() : null,
        completedSemesters: u.completedSemesters,
        joinedSemester: u.joinedSemester?.termName || "Fall 2026",
        tier,
        tierLabel,
        role: roleEnum,
        roleTitle,
        department: deptEnum,
        departmentLabel,
        isActing: Boolean(activeRole?.isActing),
        supervisor,
      };
    });

    // Sort by Tier ascending (Tier 1 -> Tier 2 -> Tier 3 -> Tier 4 -> Tier 5)
    formattedMembers.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.legalName.localeCompare(b.legalName);
    });

    // Filter by search query if provided
    let filtered = formattedMembers;
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.legalName.toLowerCase().includes(search) ||
          m.studentId.toLowerCase().includes(search) ||
          m.nsuEmail.toLowerCase().includes(search) ||
          m.roleTitle.toLowerCase().includes(search) ||
          m.departmentLabel.toLowerCase().includes(search)
      );
    }

    // Filter by tier if provided
    if (tierFilter && tierFilter !== "ALL") {
      const targetTier = parseInt(tierFilter, 10);
      if (!isNaN(targetTier)) {
        filtered = filtered.filter((m) => m.tier === targetTier);
      }
    }

    // Filter by department if provided
    if (deptFilter && deptFilter !== "ALL") {
      filtered = filtered.filter((m) => m.department === deptFilter);
    }

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        totalInDatabase: formattedMembers.length,
        syncedAt: new Date().toISOString(),
        members: filtered,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("[MEMBERS_API_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to retrieve member roster" },
      { status: 500 }
    );
  }
}
