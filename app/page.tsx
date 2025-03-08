import { DeleteNote } from "@/components/delete-note";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Clock, Eye, Key, PlusCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
  });
  return notes;
}

export default async function Home() {
  const notes = await getNotes();

  return (
    <div className='flex min-h-screen flex-col items-center pt-8 px-4 pb-16 md:pt-16 md:px-8 md:pb-24 animate-in fade-in duration-500'>
      <div className='w-full max-w-6xl space-y-10'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h2 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Your Notes
            </h2>
            <p className='mt-2 text-muted-foreground max-w-md'>
              Securely manage your encrypted notes in one place
            </p>
          </div>
          <Button
            asChild
            size='lg'
            className='px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
          >
            <Link href='/create' className='flex items-center gap-2'>
              <PlusCircle className='w-4 h-4' />
              <span>Create New Note</span>
            </Link>
          </Button>
        </div>

        <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-700 stagger-1'>
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <Card
                key={note.id}
                className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom-4 duration-700'
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <CardHeader>
                  <CardTitle className='flex justify-between items-center group-hover:text-primary/90 transition-colors duration-300'>
                    <span className='truncate'>
                      {note.title || "Untitled Note"}
                    </span>
                    <DeleteNote id={note.id} />
                  </CardTitle>
                  <CardDescription className='flex items-center gap-2'>
                    <span className='inline-block w-2 h-2 rounded-full bg-primary/60'></span>
                    Created: {new Date(note.created).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col space-y-3 text-sm'>
                    <div className='flex items-center gap-2 p-2 rounded-lg bg-muted/50'>
                      {note.expirationType === "view" ? (
                        <Eye className='h-4 w-4 text-primary/70' />
                      ) : (
                        <Clock className='h-4 w-4 text-primary/70' />
                      )}
                      <span>
                        {note.expirationType === "view"
                          ? "Expires after viewing"
                          : `Expires ${note.expiration}`}
                      </span>
                    </div>
                    {note.passwordProtected && (
                      <div className='flex items-center gap-2 p-2 rounded-lg bg-muted/50'>
                        <Key className='h-4 w-4 text-primary/70' />
                        <span>Password protected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between pt-2'>
                  <Button
                    asChild
                    variant='outline'
                    className='w-[48%] transition-all duration-300 hover:bg-muted'
                  >
                    <Link href={`/view/${note.id}`}>View</Link>
                  </Button>
                  <Button
                    asChild
                    className='w-[48%] transition-all duration-300 hover:scale-105'
                  >
                    <Link href={`/edit/${note.id}`}>Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className='col-span-full p-8 text-center bg-gradient-to-br from-background to-muted/20 shadow-sm border-dashed border-2 animate-in fade-in zoom-in duration-500'>
              <CardHeader>
                <CardTitle className='text-2xl'>No notes yet</CardTitle>
                <CardDescription className='text-lg mt-2'>
                  Create your first secure, encrypted note that self-destructs.
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center'>
                  <PlusCircle className='w-8 h-8 text-primary/60' />
                </div>
              </CardContent>
              <CardFooter className='flex justify-center pt-0'>
                <Button
                  asChild
                  size='lg'
                  className='px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300'
                >
                  <Link href='/create' className='flex items-center gap-2'>
                    <span>Create Your First Note</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
