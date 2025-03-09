import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // 'week', 'month', 'year', 'all'

    // Calculate date range based on period
    const startDate = new Date();
    switch (period) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(1970); // 'all' - effectively no date limit
    }

    // Get all user notes with filter
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
        created: { gte: startDate },
      },
      select: {
        id: true,
        title: true,
        content: true,
        expirationType: true,
        passwordProtected: true,
        created: true,
        updated: true,
      },
      orderBy: { created: "desc" },
    });

    // Analyze by month
    const notesByMonth: Record<string, number> = {};
    const passwordProtectedByMonth: Record<string, number> = {};
    notes.forEach((note) => {
      const date = new Date(note.created);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      notesByMonth[monthKey] = (notesByMonth[monthKey] || 0) + 1;

      if (note.passwordProtected) {
        passwordProtectedByMonth[monthKey] =
          (passwordProtectedByMonth[monthKey] || 0) + 1;
      }
    });

    // Calculate content length statistics
    const contentLengths = notes.map((note) => note.content.length);
    const avgContentLength =
      contentLengths.length > 0
        ? Math.round(
            contentLengths.reduce((sum, len) => sum + len, 0) /
              contentLengths.length
          )
        : 0;
    const maxContentLength =
      contentLengths.length > 0 ? Math.max(...contentLengths) : 0;

    // Calculate activity by day of week
    const activityByDayOfWeek: number[] = Array(7).fill(0);
    notes.forEach((note) => {
      const date = new Date(note.created);
      const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)
      activityByDayOfWeek[dayOfWeek]++;
    });

    return NextResponse.json({
      totalNotes: notes.length,
      notesByMonth,
      passwordProtectedByMonth,
      contentStats: {
        avgContentLength,
        maxContentLength,
      },
      activityByDayOfWeek,
      expireTypesCount: notes.reduce((acc, note) => {
        acc[note.expirationType] = (acc[note.expirationType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    });
  } catch (error) {
    console.error("Error fetching note analytics:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching note analytics" },
      { status: 500 }
    );
  }
}
