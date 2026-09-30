import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { id, studentId, nsuEmail, legalName, contactPhone, avatarUrl } = body;

    // Resolve user identifier
    const targetEmail = (nsuEmail || session?.user?.email || "").trim().toLowerCase();
    const userId = id || (session?.user as any)?.id;

    if (!targetEmail && !userId) {
      return NextResponse.json(
        { error: "User identity required" },
        { status: 400 }
      );
    }

    // Try finding existing user by ID or Email
    let user = null;
    if (userId && userId !== "authenticating" && userId !== "session-user") {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    }

    if (!user && targetEmail) {
      user = await prisma.user.findFirst({
        where: { nsuEmail: { equals: targetEmail, mode: "insensitive" } },
      });
    }

    if (!user) {
      // Find by studentId as fallback
      if (studentId) {
        user = await prisma.user.findUnique({
          where: { studentId },
        });
      }
    }

    if (user) {
      // Update existing database user
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          studentId: studentId ? studentId.trim() : user.studentId,
          nsuEmail: nsuEmail ? nsuEmail.trim().toLowerCase() : user.nsuEmail,
          legalName: legalName ? legalName.trim() : user.legalName,
          contactPhone: contactPhone ? contactPhone.trim() : user.contactPhone,
          avatarUrl: avatarUrl !== undefined ? avatarUrl : (user as any).avatarUrl,
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          id: updatedUser.id,
          legalName: updatedUser.legalName,
          email: updatedUser.nsuEmail,
          studentId: updatedUser.studentId,
          contactPhone: updatedUser.contactPhone,
          avatarUrl: (updatedUser as any).avatarUrl,
        },
      });
    } else {
      // User not in DB yet (e.g. mock persona in local preview)
      return NextResponse.json({
        success: true,
        simulated: true,
        user: {
          id: userId || "local-user",
          legalName: legalName || "Member",
          email: targetEmail,
          studentId: studentId || "2620000000",
          contactPhone: contactPhone || "+8801700000000",
          avatarUrl: avatarUrl || null,
        },
      });
    }
  } catch (error: any) {
    console.error("[PROFILE_UPDATE_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
