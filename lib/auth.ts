import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { AuthService } from "../src/services/auth.service";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "institutional-credentials",
      name: "Institutional Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        personaId: { label: "PersonaId", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email.trim().toLowerCase();

        // Enforce institutional domain check (@northsouth.edu or @gmail.com for testing)
        if (!AuthService.validateNsuDomain(email)) {
          throw new Error("Institutional Access Restricted: Only official @northsouth.edu accounts (or whitelisted @gmail.com) are permitted.");
        }

        // Lookup user in database
        let dbUser = await prisma.user.findFirst({
          where: { nsuEmail: { equals: email, mode: "insensitive" } },
          include: {
            roleAssignments: {
              where: { isActive: true },
              orderBy: { tierLevel: "asc" },
            },
          },
        });

        // Auto-provision if newly authenticated user
        if (!dbUser) {
          let activeSemester = await prisma.semester.findFirst({
            where: { isActive: true },
          });
          if (!activeSemester) {
            activeSemester = await prisma.semester.findFirst();
          }
          if (!activeSemester) {
            activeSemester = await prisma.semester.create({
              data: {
                semesterCode: "FALL2026",
                academicYear: 2026,
                termName: "Fall 2026",
                startDate: new Date("2026-09-01"),
                endDate: new Date("2026-12-31"),
                week4LockDate: new Date("2026-09-29"),
                disputeWindowEndDate: new Date("2026-10-02"),
                isActive: true,
              },
            });
          }

          // Locate active Tier 4 Department Head for constitutional single-supervisor invariant
          const deptHead =
            (await prisma.roleAssignment.findFirst({
              where: {
                isActive: true,
                tierLevel: 4,
                department: "MEMBER_MANAGEMENT_AND_DISCIPLINE",
              },
            })) ||
            (await prisma.roleAssignment.findFirst({
              where: {
                isActive: true,
                tierLevel: 4,
              },
            }));

          const studentId = "262" + Math.floor(1000000 + Math.random() * 9000000).toString();

          const createData: any = {
            studentId,
            nsuEmail: email,
            legalName: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            contactPhone: "+8801700000000",
            cgpa: 3.50,
            completedSemesters: 2,
            hasProctorialClearance: true,
            standing: "ACTIVE",
            joinedSemesterId: activeSemester.id,
          };

          // Constitutional rule: Tier 1 (Faculty Advisor) has no supervisor in club (allowed to have supervisorId: null)
          if (email === "advisor@northsouth.edu") {
            createData.roleAssignments = {
              create: {
                role: "FACULTY_ADVISOR",
                tierLevel: 1,
                department: "EXECUTIVE",
                supervisorId: null,
                isActive: true,
              },
            };
          } else if (deptHead && deptHead.id) {
            // Tier 5 General Member only assigned a departmental role if an active Tier 4 supervisor exists
            createData.roleAssignments = {
              create: {
                role: "GENERAL_MEMBER",
                tierLevel: 5,
                department: deptHead.department,
                supervisorId: deptHead.id,
                isActive: true,
              },
            };
          }

          dbUser = await prisma.user.create({
            data: createData,
            include: {
              roleAssignments: {
                where: { isActive: true },
                orderBy: { tierLevel: "asc" },
              },
            },
          });
        }

        const activeRole = dbUser.roleAssignments[0] || null;

        return {
          id: dbUser.id,
          email: dbUser.nsuEmail,
          name: dbUser.legalName,
          studentId: dbUser.studentId,
          tier: activeRole?.tierLevel ?? 5,
          role: activeRole?.role ?? "GENERAL_MEMBER",
          department: activeRole?.department ?? "GENERAL",
          isActing: activeRole?.isActing ?? false,
          standing: dbUser.standing,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      const email = user.email.trim().toLowerCase();

      // Enforce domain check: @northsouth.edu or temporary @gmail.com
      if (!AuthService.validateNsuDomain(email)) {
        return false;
      }

      // If logging in via Google OAuth, map or provision user in DB
      if (account?.provider === "google") {
        let dbUser = await prisma.user.findFirst({
          where: { nsuEmail: { equals: email, mode: "insensitive" } },
          include: {
            roleAssignments: {
              where: { isActive: true },
              orderBy: { tierLevel: "asc" },
            },
          },
        });

        if (!dbUser) {
          let activeSemester = await prisma.semester.findFirst({
            where: { isActive: true },
          });
          if (!activeSemester) {
            activeSemester = await prisma.semester.findFirst();
          }
          if (!activeSemester) {
            activeSemester = await prisma.semester.create({
              data: {
                semesterCode: "FALL2026",
                academicYear: 2026,
                termName: "Fall 2026",
                startDate: new Date("2026-09-01"),
                endDate: new Date("2026-12-31"),
                week4LockDate: new Date("2026-09-29"),
                disputeWindowEndDate: new Date("2026-10-02"),
                isActive: true,
              },
            });
          }

          // Locate active Tier 4 Department Head for constitutional single-supervisor invariant
          const deptHead =
            (await prisma.roleAssignment.findFirst({
              where: {
                isActive: true,
                tierLevel: 4,
                department: "MEMBER_MANAGEMENT_AND_DISCIPLINE",
              },
            })) ||
            (await prisma.roleAssignment.findFirst({
              where: {
                isActive: true,
                tierLevel: 4,
              },
            }));

          const studentId = "262" + Math.floor(1000000 + Math.random() * 9000000).toString();

          const createData: any = {
            studentId,
            nsuEmail: email,
            legalName: user.name || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            contactPhone: "+8801700000000",
            cgpa: 3.50,
            completedSemesters: 2,
            hasProctorialClearance: true,
            standing: "ACTIVE",
            joinedSemesterId: activeSemester.id,
          };

          // Constitutional rule: Tier 1 (Faculty Advisor) has no supervisor in club
          if (email === "advisor@northsouth.edu") {
            createData.roleAssignments = {
              create: {
                role: "FACULTY_ADVISOR",
                tierLevel: 1,
                department: "EXECUTIVE",
                supervisorId: null,
                isActive: true,
              },
            };
          } else if (deptHead && deptHead.id) {
            // Tier 5 General Member only assigned a departmental role if an active Tier 4 supervisor exists
            createData.roleAssignments = {
              create: {
                role: "GENERAL_MEMBER",
                tierLevel: 5,
                department: deptHead.department,
                supervisorId: deptHead.id,
                isActive: true,
              },
            };
          }

          dbUser = await prisma.user.create({
            data: createData,
            include: {
              roleAssignments: {
                where: { isActive: true },
                orderBy: { tierLevel: "asc" },
              },
            },
          });
        }

        const activeRole = dbUser.roleAssignments[0] || null;
        (user as any).id = dbUser.id;
        (user as any).studentId = dbUser.studentId;
        (user as any).tier = activeRole?.tierLevel ?? 5;
        (user as any).role = activeRole?.role ?? "GENERAL_MEMBER";
        (user as any).department = activeRole?.department ?? "GENERAL";
        (user as any).isActing = activeRole?.isActing ?? false;
        (user as any).standing = dbUser.standing;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.studentId = (user as any).studentId;
        token.tier = (user as any).tier ?? 5;
        token.role = (user as any).role ?? "GENERAL_MEMBER";
        token.department = (user as any).department ?? "GENERAL";
        token.isActing = (user as any).isActing ?? false;
        token.standing = (user as any).standing ?? "ACTIVE";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).studentId = token.studentId;
        (session.user as any).tier = token.tier;
        (session.user as any).role = token.role;
        (session.user as any).department = token.department;
        (session.user as any).isActing = token.isActing;
        (session.user as any).standing = token.standing;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "soptosur-constitutional-secure-jwt-secret-key-2026",
};
