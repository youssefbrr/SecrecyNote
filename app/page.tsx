import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Eye, Clock, Key } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { DeleteNote } from "@/components/delete-note"

export const dynamic = "force-dynamic"

async function getNotes() {
  const notes = await prisma.note.findMany({
    select: {
      id: true,
      title: true,
      expirationType: true,
      expiration: true,
      passwordProtected: true,
      created: true,
    },
    orderBy: { created: "desc" },
  })
  return notes
}

export default async function Home() {
  const notes = await getNotes()

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-4 md:p-24">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">SecureNote</h1>
            <p className="mt-2 text-muted-foreground">Manage your private, encrypted notes</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Create a new note</CardTitle>
              <CardDescription>Write a new encrypted note that self-destructs.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/create">Create Secure Note</Link>
              </Button>
            </CardFooter>
          </Card>

          {notes.map((note) => (
            <Card key={note.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="truncate">{note.title || "Untitled Note"}</span>
                  <DeleteNote id={note.id} />
                </CardTitle>
                <CardDescription>Created: {new Date(note.created).toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  {note.expirationType === "view" ? <Eye className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  <span>{note.expirationType === "view" ? "Expires after viewing" : `Expires ${note.expiration}`}</span>
                </div>
                {note.passwordProtected && (
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <Key className="h-4 w-4" />
                    <span>Password protected</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <Link href={`/view/${note.id}`}>View</Link>
                </Button>
                <Button asChild>
                  <Link href={`/edit/${note.id}`}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

