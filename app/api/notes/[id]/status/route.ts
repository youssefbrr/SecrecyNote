import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This endpoint just checks if a note exists and if it's password protected
// It doesn't "view" the note, so it won't trigger deletion for view-once notes
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: params.id },
      select: {
        title: true,
        passwordProtected: true,
        expirationType: true,
        expiration: true,
        created: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if the note has expired for time-based expiration
    if (note.expirationType === "time" && note.expiration) {
      try {
        const expirationDate = new Date(note.created);

        // Handle UI-friendly formats by converting them to the correct format for calculation
        let expirationValue = note.expiration;

        // Convert UI-friendly formats to calculation format (e.g., "1 hour" to "1h")
        if (note.expiration === "5 minutes") {
          expirationValue = "5m";
        } else if (note.expiration === "1 hour") {
          expirationValue = "1h";
        } else if (note.expiration === "1 day") {
          expirationValue = "1d";
        } else if (note.expiration === "7 days") {
          expirationValue = "7d";
        } else if (note.expiration === "30 days") {
          expirationValue = "30d";
        }

        const matches = expirationValue.match(/(\d+)([mhd])/);

        if (!matches) {
          return NextResponse.json(
            { error: "Invalid expiration format" },
            { status: 400 }
          );
        }

        const amount = parseInt(matches[1], 10);
        const unit = matches[2];

        switch (unit) {
          case "m":
            expirationDate.setMinutes(expirationDate.getMinutes() + amount);
            break;
          case "h":
            expirationDate.setHours(expirationDate.getHours() + amount);
            break;
          case "d":
            expirationDate.setDate(expirationDate.getDate() + amount);
            break;
          default:
            return NextResponse.json(
              { error: "Invalid time unit" },
              { status: 400 }
            );
        }

        const now = new Date();
        if (now > expirationDate) {
          // Delete expired note
          await prisma.note.delete({ where: { id: params.id } });
          return NextResponse.json(
            { error: "Note has expired" },
            { status: 410 }
          );
        }
      } catch (error) {
        console.error("Error processing expiration:", error);
        return NextResponse.json(
          { error: "Error processing note expiration" },
          { status: 500 }
        );
      }
    }

    // Return minimal information about the note
    return NextResponse.json({
      title: note.title,
      isPasswordProtected: note.passwordProtected,
    });
  } catch (error) {
    console.error("Error checking note status:", error);
    return NextResponse.json(
      { error: "Failed to check note status" },
      { status: 500 }
    );
  }
}
