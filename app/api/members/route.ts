import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ConstitutionalOfficeDef {
  role: string;
  roleTitle: string;
  tier: number;
  tierLabel: string;
  department: string;
  departmentLabel: string;
  supervisor: string;
  appointmentRequirement: string;
  constitutionalClause: string;
}

const CONSTITUTIONAL_OFFICES: ConstitutionalOfficeDef[] = [
  {
    role: "FACULTY_ADVISOR",
    roleTitle: "Faculty Advisor",
    tier: 1,
    tierLabel: "Tier 1: Faculty Advisor",
    department: "EXECUTIVE",
    departmentLabel: "Executive Governance Desk",
    supervisor: "North South University Administration (OSA)",
    appointmentRequirement: "Formal NSU Administration & OSA Appointment Letter",
    constitutionalClause: "Articles 1.1, 1.2, 9.1 & 14",
  },
  {
    role: "PRESIDENT",
    roleTitle: "Club President",
    tier: 2,
    tierLabel: "Tier 2: Club President",
    department: "EXECUTIVE",
    departmentLabel: "Executive Governance Desk",
    supervisor: "Faculty Advisor",
    appointmentRequirement: "Article 8 Selection Panel & General Assembly Secret Ballot (or Article 8.1 Founder Induction)",
    constitutionalClause: "Articles 1.1, 3.1, 8.1, 8.2 & 9.1",
  },
  {
    role: "VICE_PRESIDENT",
    roleTitle: "Vice President",
    tier: 3,
    tierLabel: "Tier 3: Executive Board",
    department: "EXECUTIVE",
    departmentLabel: "Executive Governance Desk",
    supervisor: "Club President",
    appointmentRequirement: "Article 8 Selection Panel & General Assembly Secret Ballot",
    constitutionalClause: "Articles 1.1, 3.3, 5.1 & 6.4",
  },
  {
    role: "GENERAL_SECRETARY",
    roleTitle: "General Secretary",
    tier: 3,
    tierLabel: "Tier 3: Executive Board",
    department: "EXECUTIVE",
    departmentLabel: "Executive Governance Desk",
    supervisor: "Club President",
    appointmentRequirement: "Article 8 Selection Panel & General Assembly Secret Ballot",
    constitutionalClause: "Articles 1.1, 3.1, 5.1 & 7.2",
  },
  {
    role: "TREASURER",
    roleTitle: "Treasurer",
    tier: 3,
    tierLabel: "Tier 3: Executive Board",
    department: "EXECUTIVE",
    departmentLabel: "Executive Governance Desk",
    supervisor: "Club President",
    appointmentRequirement: "Article 8 Selection Panel & General Assembly Secret Ballot",
    constitutionalClause: "Articles 1.1, 3.1, 5.1 & 9.1",
  },
  {
    role: "DEPT_HEAD_MUSIC_PERFORMANCE",
    roleTitle: "Music & Performance Head",
    tier: 4,
    tierLabel: "Tier 4: Department Head",
    department: "MUSIC_AND_PERFORMANCE",
    departmentLabel: "Music & Performance Department",
    supervisor: "Vice President",
    appointmentRequirement: "Article 5.5 (3 Executive Board Votes & 1-Year Tenure)",
    constitutionalClause: "Articles 1.1, 5.1, 5.5 & 12.1",
  },
  {
    role: "DEPT_HEAD_EVENT_LOGISTICS",
    roleTitle: "Event & Logistics Head",
    tier: 4,
    tierLabel: "Tier 4: Department Head",
    department: "EVENT_AND_LOGISTICS",
    departmentLabel: "Event & Logistics Department",
    supervisor: "Vice President",
    appointmentRequirement: "Article 5.5 (3 Executive Board Votes & 1-Year Tenure)",
    constitutionalClause: "Articles 1.1, 5.1, 5.3 & Annexure 'A'",
  },
  {
    role: "DEPT_HEAD_MEDIA_DESIGN",
    roleTitle: "Media & Design Head",
    tier: 4,
    tierLabel: "Tier 4: Department Head",
    department: "MEDIA_AND_DESIGN",
    departmentLabel: "Media & Design Department",
    supervisor: "General Secretary",
    appointmentRequirement: "Article 5.5 (3 Executive Board Votes & 1-Year Tenure)",
    constitutionalClause: "Articles 1.1, 1.2 & 5.1",
  },
  {
    role: "DEPT_HEAD_MEMBER_MANAGEMENT",
    roleTitle: "Member Management & Discipline Head",
    tier: 4,
    tierLabel: "Tier 4: Department Head",
    department: "MEMBER_MANAGEMENT_AND_DISCIPLINE",
    departmentLabel: "Member Management & Discipline Department",
    supervisor: "General Secretary",
    appointmentRequirement: "Article 5.5 (3 Executive Board Votes & 1-Year Tenure)",
    constitutionalClause: "Articles 1.1, 2.2, 2.4 & 5.1",
  },
  {
    role: "DEPT_HEAD_SPONSORSHIP_PARTNERSHIP",
    roleTitle: "Sponsorship & Partnership Head",
    tier: 4,
    tierLabel: "Tier 4: Department Head",
    department: "SPONSORSHIP_AND_PARTNERSHIP",
    departmentLabel: "Sponsorship & Partnership Department",
    supervisor: "Treasurer",
    appointmentRequirement: "Article 5.5 (3 Executive Board Votes & 1-Year Tenure)",
    constitutionalClause: "Articles 1.1, 5.1, 9.4 & Annexure 'C'",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get("search") || "").trim().toLowerCase();
    const tierFilter = searchParams.get("tier");
    const deptFilter = searchParams.get("department");

    // Fetch active users with roles from Neon PostgreSQL
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
      orderBy: [{ legalName: "asc" }],
    });

    // Create a map of active role -> user
    const roleToUserMap = new Map<string, any>();
    const generalMembersList: any[] = [];

    users.forEach((u) => {
      const activeRole = u.roleAssignments[0] || null;
      if (activeRole) {
        if (activeRole.tierLevel <= 4) {
          roleToUserMap.set(activeRole.role, {
            user: u,
            assignment: activeRole,
          });
        } else {
          // Tier 5 General Members & Coordinators
          generalMembersList.push({
            id: u.id,
            isVacant: false,
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
            tier: activeRole.tierLevel,
            tierLabel: activeRole.role === "COORDINATOR" ? "Tier 5: Coordinator" : "Tier 5: General Member",
            role: activeRole.role,
            roleTitle: activeRole.role === "COORDINATOR" ? "Department Coordinator" : "General Assembly Member",
            department: activeRole.department,
            departmentLabel: activeRole.department.replace(/_/g, " "),
            isActing: Boolean(activeRole.isActing),
            supervisor: activeRole.supervisor?.user
              ? `${activeRole.supervisor.user.legalName} (${activeRole.supervisor.role})`
              : "Respective Department Head",
            appointmentRequirement: "Article 2 Audition Passing & Proctorial Clearance",
            constitutionalClause: "Articles 1.1, 2.1 & 5.4",
          });
        }
      } else {
        // Enrolled NSU Member awaiting specific departmental placement
        generalMembersList.push({
          id: u.id,
          isVacant: false,
          studentId: u.studentId,
          nsuEmail: u.nsuEmail,
          legalName: u.legalName,
          contactPhone: u.contactPhone || null,
          avatarUrl: (u as any).avatarUrl || null,
          standing: u.standing,
          hasProctorialClearance: u.hasProctorialClearance,
          cgpa: u.cgpa ? u.cgpa.toString() : null,
          completedSemesters: u.completedSemesters,
          joinedSemester: u.joinedSemester?.termName || "Fall 2026",
          tier: 5,
          tierLabel: "Tier 5: General Member",
          role: "GENERAL_MEMBER",
          roleTitle: "General Assembly Member",
          department: "GENERAL",
          departmentLabel: "General Assembly",
          isActing: false,
          supervisor: "Department Head (Pending Assignment)",
          appointmentRequirement: "Article 2 NSU Enrollment & General Assembly Registration",
          constitutionalClause: "Articles 1.1, 2.1 & 3.1",
        });
      }
    });

    // Build the 10 constitutional offices roster
    const constitutionalRoster = CONSTITUTIONAL_OFFICES.map((office) => {
      const occupied = roleToUserMap.get(office.role);

      if (occupied) {
        const u = occupied.user;
        const ra = occupied.assignment;
        return {
          id: u.id,
          isVacant: false,
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
          tier: office.tier,
          tierLabel: office.tierLabel,
          role: office.role,
          roleTitle: office.roleTitle,
          department: office.department,
          departmentLabel: office.departmentLabel,
          isActing: Boolean(ra.isActing),
          supervisor: ra.supervisor?.user
            ? `${ra.supervisor.user.legalName} (${ra.supervisor.role})`
            : office.supervisor,
          appointmentRequirement: office.appointmentRequirement,
          constitutionalClause: office.constitutionalClause,
        };
      }

      // VACANT CONSTITUTIONAL OFFICE (No mock/fake user)
      return {
        id: `vacant-${office.role.toLowerCase()}`,
        isVacant: true,
        studentId: "UNASSIGNED",
        nsuEmail: "office.vacant@northsouth.edu",
        legalName: "VACANT (পদ শূন্য)",
        contactPhone: null,
        avatarUrl: null,
        standing: "VACANT",
        hasProctorialClearance: true,
        cgpa: null,
        completedSemesters: 0,
        joinedSemester: "Pending Induction",
        tier: office.tier,
        tierLabel: office.tierLabel,
        role: office.role,
        roleTitle: office.roleTitle,
        department: office.department,
        departmentLabel: office.departmentLabel,
        isActing: false,
        supervisor: office.supervisor,
        appointmentRequirement: office.appointmentRequirement,
        constitutionalClause: office.constitutionalClause,
      };
    });

    const fullRoster = [...constitutionalRoster, ...generalMembersList];

    // Sorting by Tier ascending
    fullRoster.sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      return a.roleTitle.localeCompare(b.roleTitle);
    });

    // Filter by search query
    let filtered = fullRoster;
    if (search) {
      filtered = filtered.filter(
        (m) =>
          m.legalName.toLowerCase().includes(search) ||
          m.studentId.toLowerCase().includes(search) ||
          m.nsuEmail.toLowerCase().includes(search) ||
          m.roleTitle.toLowerCase().includes(search) ||
          m.departmentLabel.toLowerCase().includes(search) ||
          m.constitutionalClause.toLowerCase().includes(search)
      );
    }

    // Filter by tier
    if (tierFilter && tierFilter !== "ALL") {
      const targetTier = parseInt(tierFilter, 10);
      if (!isNaN(targetTier)) {
        filtered = filtered.filter((m) => m.tier === targetTier);
      }
    }

    // Filter by department
    if (deptFilter && deptFilter !== "ALL") {
      filtered = filtered.filter((m) => m.department === deptFilter);
    }

    const vacantCount = fullRoster.filter((m) => m.isVacant).length;
    const appointedCount = fullRoster.filter((m) => !m.isVacant).length;

    return NextResponse.json(
      {
        success: true,
        count: filtered.length,
        totalConstitutionalOffices: CONSTITUTIONAL_OFFICES.length,
        vacantOfficesCount: vacantCount,
        appointedMembersCount: appointedCount,
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
      { error: error?.message || "Failed to retrieve constitutional member roster" },
      { status: 500 }
    );
  }
}
