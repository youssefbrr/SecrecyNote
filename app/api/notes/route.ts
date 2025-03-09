import { getCurrentUser } from "@/lib/auth";
import { encrypt } from "@/lib/encryption";
import { isNoteExpired } from "@/lib/note-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  let notes = [];

  // If user is authenticated, show their notes
  if (user) {
    notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        expirationType: true,
        expiration: true,
        passwordProtected: true,
        created: true,
        updated: true,
      },
      orderBy: { created: "desc" },
    });
  } else {
    // For guest users, only show guest notes
    notes = await prisma.note.findMany({
      where: {
        isGuest: true,
        userId: null,
      },
      select: {
        id: true,
        title: true,
        expirationType: true,
        expiration: true,
        passwordProtected: true,
        created: true,
        updated: true,
      },
      orderBy: { created: "desc" },
    });
  }

  // Add an isExpired flag to each note
  const notesWithExpirationFlag = notes.map((note) => ({
    ...note,
    isExpired: isNoteExpired(note),
  }));

  return NextResponse.json(notesWithExpirationFlag);
}

export async function POST(request: Request) {
  const data = await request.json();
  const { title, content, expirationType, expiration, password, isGuest } =
    data;

  // Validate expiration format if it's time-based
  if (expirationType === "time" && expiration) {
    // The UI provides expiration in friendly formats like "1 hour", "1 day", etc.
    // This is already correct for database storage - we don't need to transform it here
    // The transformation to "1h", "1d" is handled when we need to calculate expiration dates

    // For custom formats (if any), validate here
    if (
      !["5 minutes", "1 hour", "1 day", "7 days", "30 days"].includes(
        expiration
      )
    ) {
      // Handle any custom format validation if needed in the future
      return NextResponse.json(
        { error: "Invalid expiration format" },
        { status: 400 }
      );
    }
  }

  const encryptedContent = await encrypt(content);
  const encryptedPassword = password ? await encrypt(password) : null;

  // Check if user is authenticated
  const user = await getCurrentUser();

  const note = await prisma.note.create({
    data: {
      title,
      content: encryptedContent,
      expirationType,
      expiration,
      passwordProtected: !!password,
      password: encryptedPassword,
      isGuest: isGuest || !user,
      userId: user?.id || null,
    },
  });

  return NextResponse.json(note);
}
