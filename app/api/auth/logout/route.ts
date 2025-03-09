import { removeAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  removeAuthCookie();
  return NextResponse.json({ success: true });
}
