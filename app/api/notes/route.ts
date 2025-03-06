import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/encryption"

export async function GET() {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      expirationType: true,
      expiration: true,
      passwordProtected: true,
      created: true,
      updated: true,
    },
  })
  return NextResponse.json(notes)
}

export async function POST(request: Request) {
  const data = await request.json()
  const { title, content, expirationType, expiration, password } = data

  const encryptedContent = await encrypt(content)
  const encryptedPassword = password ? await encrypt(password) : null

  const note = await prisma.note.create({
    data: {
      title,
      content: encryptedContent,
      expirationType,
      expiration,
      passwordProtected: !!password,
      password: encryptedPassword,
    },
  })

  return NextResponse.json(note)
}

