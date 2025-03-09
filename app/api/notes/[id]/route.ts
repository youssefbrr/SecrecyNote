import { decrypt, encrypt } from "@/lib/encryption";
import { isNoteExpired } from "@/lib/note-utils";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching note with ID:", params.id);

    const note = await prisma.note.findUnique({
      where: { id: params.id },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if the note has expired
    if (isNoteExpired(note)) {
      return NextResponse.json(
        { error: "Note has expired and cannot be viewed" },
        { status: 410 }
      );
    }

    let response;
    let shouldDelete = false;

    try {
      // Prepare the response based on note type
      if (note.password) {
        response = {
          ...note,
          content: null,
          isPasswordProtected: true,
        };
      } else {
        const decryptedContent = await decrypt(note.content);
        response = {
          ...note,
          content: decryptedContent,
          isPasswordProtected: false,
        };

        // Mark for deletion if it's a view-once note without password
        if (note.expirationType === "view" && !note.password) {
          shouldDelete = true;
        }
      }

      // Send the response first
      const jsonResponse = NextResponse.json(response);

      // Delete the note after sending response if needed
      if (shouldDelete) {
        await prisma.note.delete({ where: { id: params.id } });
      }

      return jsonResponse;
    } catch (error) {
      console.error("Error processing note:", error);
      return NextResponse.json(
        { error: "Failed to process note" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  });

  if (!note || !note.password) {
    return NextResponse.json(
      { error: "Note not found or not password protected" },
      { status: 404 }
    );
  }

  // Check if the note has expired
  if (isNoteExpired(note)) {
    return NextResponse.json(
      { error: "Note has expired and cannot be accessed" },
      { status: 410 }
    );
  }

  const { password } = await request.json();

  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }

  try {
    const decryptedStoredPassword = await decrypt(note.password);

    if (password !== decryptedStoredPassword) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const decryptedContent = await decrypt(note.content);

    // If it's a "view once" note, delete it after successful password verification
    if (note.expirationType === "view") {
      await prisma.note.delete({ where: { id: params.id } });
    }

    return NextResponse.json({
      ...note,
      content: decryptedContent,
      isPasswordProtected: true,
    });
  } catch (error) {
    console.error("Decryption error:", error);
    return NextResponse.json(
      { error: "Failed to decrypt note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // First get the existing note
  const existingNote = await prisma.note.findUnique({
    where: { id: params.id },
  });

  if (!existingNote) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // Check if the note has expired
  if (isNoteExpired(existingNote)) {
    return NextResponse.json(
      { error: "Note has expired and cannot be edited" },
      { status: 410 }
    );
  }

  const data = await request.json();
  const { title, content } = data;

  // Encrypt the new content
  const encryptedContent = await encrypt(content);

  // Update the note while preserving existing fields
  const updatedNote = await prisma.note.update({
    where: { id: params.id },
    data: {
      title,
      content: encryptedContent,
      // Preserve existing expiration settings and password
      expirationType: existingNote.expirationType,
      expiration: existingNote.expiration,
      passwordProtected: existingNote.passwordProtected,
      password: existingNote.password,
    },
  });

  return NextResponse.json({
    ...updatedNote,
    content: content, // Return decrypted content
    isPasswordProtected: updatedNote.passwordProtected,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.note.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Note deleted successfully" });
}
