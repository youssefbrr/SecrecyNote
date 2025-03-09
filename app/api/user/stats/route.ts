import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user stats from database - this gets the total notes count directly from the database
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
        content: true,
        passwordProtected: true,
        expirationType: true,
        expiration: true,
        created: true,
        updated: true,
      },
      orderBy: { created: "desc" },
    });

    // Calculate additional statistics
    const passwordProtectedCount = notes.filter(
      (note) => note.passwordProtected === true
    ).length;

    // Calculate expiration types properly
    const expirationTypes = notes.reduce((acc, note) => {
      acc[note.expirationType] = (acc[note.expirationType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get last activity date (more recent of created or updated date)
    let lastActivityDate = userData.created;
    for (const note of notes) {
      const noteCreated = new Date(note.created);
      const noteUpdated = new Date(note.updated);
      const mostRecentNoteActivity =
        noteCreated > noteUpdated ? noteCreated : noteUpdated;

      if (mostRecentNoteActivity > lastActivityDate) {
        lastActivityDate = mostRecentNoteActivity;
      }
    }

    // Calculate notes created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentNotesCount = notes.filter(
      (note) => new Date(note.created) > thirtyDaysAgo
    ).length;

    // Check for expired notes based on expiration settings
    const now = new Date();
    const expiredNotes = notes.filter((note) => {
      if (note.expirationType === "never") return false;

      if (note.expirationType === "time" && note.expiration) {
        const expirationDate = new Date(note.expiration);
        return expirationDate < now;
      }

      // Note: For 'view' type, we can't determine from just the database if it's expired
      // This would need to be tracked separately in the database
      return false;
    });

    const expiredCount = expiredNotes.length;

    // Calculate average content length - ensure we handle missing content
    const contentLengths = notes
      .filter((note) => note.content !== null && note.content !== undefined)
      .map((note) => note.content.length);

    const avgContentLength =
      contentLengths.length > 0
        ? Math.round(
            contentLengths.reduce((sum, len) => sum + len, 0) /
              contentLengths.length
          )
        : 0;

    // Get the max content length for reference
    const maxContentLength =
      contentLengths.length > 0 ? Math.max(...contentLengths) : 0;

    return NextResponse.json({
      // Total notes should always be the total count regardless of expiration status
      totalNotes: userData._count.notes,
      activeNotes: notes.length - expiredCount,
      expiredNotes: expiredCount,
      memberSince: userData.created.toISOString(),
      lastActivity: lastActivityDate.toISOString(),
      accountUpdated: userData.updated.toISOString(),
      passwordProtectedNotes: passwordProtectedCount,
      passwordProtectionRate:
        notes.length > 0
          ? Math.round((passwordProtectedCount / notes.length) * 100)
          : 0,
      expirationDistribution: expirationTypes,
      recentNotesCount: recentNotesCount,
      avgContentLength: avgContentLength,
      maxContentLength: maxContentLength,
      latestNotes: notes.slice(0, 5).map((note) => {
        // Determine if note is expired
        let isExpired = false;
        if (note.expirationType === "time" && note.expiration) {
          const expirationDate = new Date(note.expiration);
          isExpired = expirationDate < now;
        }

        return {
          id: note.id,
          title: note.title || "Untitled Note",
          created: note.created.toISOString(),
          updated: note.updated.toISOString(),
          isPasswordProtected: note.passwordProtected === true,
          isExpired: isExpired,
          expirationType: note.expirationType,
          contentLength: note.content ? note.content.length : 0,
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching user statistics" },
      { status: 500 }
    );
  }
}
