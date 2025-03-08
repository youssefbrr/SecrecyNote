"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useNoteRefresh } from "@/components/providers/note-refresh-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate, formatRelativeTime } from "@/lib/date-utils";
import { Clock, Eye, Key, PlusCircle, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  title: string | null;
  expirationType: string;
  expiration: string | null;
  passwordProtected: boolean;
  created: string;
  updated: string;
};

function formatExpiration(expiration: string | null): string {
  if (!expiration) return "soon";

  switch (expiration) {
    case "5 minutes":
      return "in 5 minutes";
    case "1 hour":
      return "in 1 hour";
    case "1 day":
      return "in 1 day";
    case "7 days":
      return "in 7 days";
    case "30 days":
      return "in 30 days";
    default:
      return `in ${expiration}`;
  }
}

export default function NotesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { refreshFlag } = useNoteRefresh();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/notes");
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, refreshFlag]);

  if (isLoading || loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

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
                className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom-4 duration-700 h-full'
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1.5 min-w-0 flex-1 pr-2'>
                      <CardTitle className='group-hover:text-primary/90 transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden'>
                        <span className='truncate inline-block max-w-[calc(100%-24px)]'>
                          {note.title || "Untitled Note"}
                        </span>
                        {note.passwordProtected && (
                          <Shield className='h-4 w-4 text-primary/70 flex-shrink-0' />
                        )}
                      </CardTitle>
                      <CardDescription className='flex items-center gap-2 truncate'>
                        <span className='inline-block w-2 h-2 rounded-full bg-primary/60 flex-shrink-0' />
                        <span
                          className='truncate'
                          title={formatDate(note.created)}
                        >
                          Created: {formatRelativeTime(note.created)}
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-muted-foreground hover:text-destructive'
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <span className='sr-only'>Delete</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='h-4 w-4'
                      >
                        <path d='M3 6h18'></path>
                        <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
                        <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-col space-y-3 text-sm'>
                    <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/50'>
                      {note.expirationType === "view" ? (
                        <>
                          <Eye className='h-4 w-4 text-primary/70 flex-shrink-0' />
                          <span className='truncate'>
                            Expires after viewing
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className='h-4 w-4 text-primary/70 flex-shrink-0' />
                          <span className='truncate'>
                            Expires {formatExpiration(note.expiration)}
                          </span>
                        </>
                      )}
                    </div>
                    {note.passwordProtected && (
                      <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/50'>
                        <Key className='h-4 w-4 text-primary/70 flex-shrink-0' />
                        <span className='truncate'>Password protected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between gap-2 pt-4'>
                  <Button
                    asChild
                    variant='outline'
                    className='flex-1 transition-all duration-300 hover:bg-muted'
                  >
                    <Link
                      href={`/view/${note.id}`}
                      className='flex items-center justify-center gap-2'
                    >
                      <Eye className='w-4 h-4' />
                      <span>View</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className='flex-1 transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary/90 to-primary/80'
                  >
                    <Link
                      href={`/edit/${note.id}`}
                      className='flex items-center justify-center gap-2'
                    >
                      <span>Edit</span>
                    </Link>
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
                  className='px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
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
