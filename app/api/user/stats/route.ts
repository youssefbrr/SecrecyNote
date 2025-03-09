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
        id: true,
        email: true,
        name: true,
        created: true,
        updated: true,
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

    // Get additional stats about notes
    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        passwordProtected: true,
        expirationType: true,
        created: true,
        updated: true,
      },
      orderBy: { created: "desc" },
    });

    // Calculate additional statistics
    const passwordProtectedCount = notes.filter(
      (note) => note.passwordProtected
    ).length;
    const expirationTypes = notes.reduce((acc, note) => {
      acc[note.expirationType] = (acc[note.expirationType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get last activity date
    const lastActivityDate =
      notes.length > 0 ? notes[0].created : userData.created;

    // Calculate notes created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentNotesCount = notes.filter(
      (note) => new Date(note.created) > thirtyDaysAgo
    ).length;

    return NextResponse.json({
      totalNotes: userData._count.notes,
      memberSince: userData.created.toISOString(),
      lastActivity: lastActivityDate.toISOString(),
      accountUpdated: userData.updated.toISOString(),
      passwordProtectedNotes: passwordProtectedCount,
      expirationDistribution: expirationTypes,
      recentNotesCount: recentNotesCount,
      latestNotes: notes.slice(0, 5).map((note) => ({
        id: note.id,
        title: note.title || "Untitled Note",
        created: note.created.toISOString(),
        isPasswordProtected: note.passwordProtected,
      })),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user statistics" },
      { status: 500 }
    );
  }
}
