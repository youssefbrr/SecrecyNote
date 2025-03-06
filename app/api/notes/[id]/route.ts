import { decrypt, encrypt } from "@/lib/encryption"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  })

  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  // Check if the note has expired
  if (note.expirationType === "time" && note.expiration) {
    const expirationDate = new Date(note.created)
    const [value, unit] = note.expiration.split("")
    const amount = Number.parseInt(value)

    switch (unit) {
      case "m":
        expirationDate.setMinutes(expirationDate.getMinutes() + amount)
        break
      case "h":
        expirationDate.setHours(expirationDate.getHours() + amount)
        break
      case "d":
        expirationDate.setDate(expirationDate.getDate() + amount)
        break
    }

    if (new Date() > expirationDate) {
      await prisma.note.delete({ where: { id: params.id } })
      return NextResponse.json({ error: "Note has expired" }, { status: 410 })
    }
  }

  // If it's a "view once" note, delete it after retrieving
  if (note.expirationType === "view") {
    await prisma.note.delete({ where: { id: params.id } })
  }

  // Only return encrypted content if password protected
  if (note.password) {
    return NextResponse.json({
      ...note,
      content: null, // Don't send decrypted content for password-protected notes
      isPasswordProtected: true,
    })
  }

  // If not password protected, decrypt and return content
  const decryptedContent = await decrypt(note.content)
  return NextResponse.json({
    ...note,
    content: decryptedContent,
    isPasswordProtected: false,
  })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({
    where: { id: params.id },
  })

  if (!note || !note.password) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  const { password } = await request.json()

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 })
  }

  try {
    const decryptedStoredPassword = await decrypt(note.password)
    
    if (password !== decryptedStoredPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    const decryptedContent = await decrypt(note.content)

    // If it's a "view once" note, delete it after successful password verification
    if (note.expirationType === "view") {
      await prisma.note.delete({ where: { id: params.id } })
    }

    return NextResponse.json({ content: decryptedContent })
  } catch (error) {
    console.error('Decryption error:', error)
    return NextResponse.json({ error: "Failed to decrypt note" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const data = await request.json()
  const { title, content, expirationType, expiration, password } = data

  const encryptedContent = await encrypt(content)
  const encryptedPassword = password ? await encrypt(password) : null

  const updatedNote = await prisma.note.update({
    where: { id: params.id },
    data: {
      title,
      content: encryptedContent,
      expirationType,
      expiration,
      passwordProtected: !!password,
      password: encryptedPassword,
    },
  })

  return NextResponse.json(updatedNote)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await prisma.note.delete({ where: { id: params.id } })
  return NextResponse.json({ message: "Note deleted successfully" })
}

