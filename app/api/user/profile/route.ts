import { generateToken, getCurrentUser, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    console.log("Current user from token:", user);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();
    console.log("Received name update request:", name);

    // Validate input
    if (typeof name !== "string") {
      return NextResponse.json(
        { error: "Invalid name format" },
        { status: 400 }
      );
    }

    // Optional: Add additional name validation if needed
    const trimmedName = name.trim();
    console.log("Trimmed name:", trimmedName);

    if (trimmedName.length > 50) {
      return NextResponse.json(
        { error: "Name cannot exceed 50 characters" },
        { status: 400 }
      );
    }

    // Check if name contains any disallowed characters (optional)
    if (trimmedName && !/^[a-zA-Z0-9\s-'.]+$/.test(trimmedName)) {
      return NextResponse.json(
        { error: "Name contains invalid characters" },
        { status: 400 }
      );
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: trimmedName || null, // Allow empty name to be stored as null
        updated: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    console.log("Updated user in database:", updatedUser);

    // Generate a new token with the updated user data
    const newToken = generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
    });
    console.log("Generated new token with updated name");

    // Set the new token in the cookie
    setAuthCookie(newToken);
    console.log("Set new auth cookie");

    return NextResponse.json({
      ...updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);

    // Handle Prisma errors more specifically
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "An error occurred while updating the profile" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An error occurred while updating the profile" },
      { status: 500 }
    );
  }
}
