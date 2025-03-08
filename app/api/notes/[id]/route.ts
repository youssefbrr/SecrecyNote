import { decrypt, encrypt } from "@/lib/encryption";
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
