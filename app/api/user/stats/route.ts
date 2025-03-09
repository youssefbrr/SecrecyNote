import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user stats from database
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        created: true,
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      totalNotes: userData._count.notes,
      memberSince: userData.created.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user statistics" },
      { status: 500 }
    );
  }
}
