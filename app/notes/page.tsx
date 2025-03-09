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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "title" | "expiration">(
    "created"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<
    "all" | "time" | "view" | "password"
  >("all");

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

  // Filter and sort notes
  const filteredAndSortedNotes = notes
    .filter((note) => {
      // Filter by search term
      if (
        searchTerm &&
        !note.title?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Filter by type
      if (filterType === "time" && note.expirationType !== "time") {
        return false;
      }
      if (filterType === "view" && note.expirationType !== "view") {
        return false;
      }
      if (filterType === "password" && !note.passwordProtected) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by criteria
      if (sortBy === "created") {
        return sortOrder === "asc"
          ? new Date(a.created).getTime() - new Date(b.created).getTime()
          : new Date(b.created).getTime() - new Date(a.created).getTime();
      }

      if (sortBy === "title") {
        const titleA = a.title || "Untitled";
        const titleB = b.title || "Untitled";
        return sortOrder === "asc"
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }

      if (sortBy === "expiration") {
        // Handle view-based expiration which has no date
        if (a.expirationType === "view" && b.expirationType !== "view")
          return sortOrder === "asc" ? -1 : 1;
        if (a.expirationType !== "view" && b.expirationType === "view")
          return sortOrder === "asc" ? 1 : -1;

        // If both are time-based, compare their expiration times
        if (a.expiration && b.expiration) {
          return sortOrder === "asc"
            ? a.expiration.localeCompare(b.expiration)
            : b.expiration.localeCompare(a.expiration);
        }

        return 0;
      }

      return 0;
    });

  return (
    <div className='flex min-h-screen flex-col items-center pt-8 px-4 pb-16 md:pt-16 md:px-8 md:pb-24 animate-in fade-in duration-500 bg-gradient-to-b from-background via-background/95 to-background/90'>
      <div className='w-full max-w-6xl space-y-10'>
        <div className='relative'>
          <div className='absolute -inset-x-10 -top-10 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl -z-10 rounded-full opacity-60'></div>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h2 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent'>
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
        </div>

        {/* Search and filter controls */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 animate-in slide-in-from-top-4 duration-700'>
          <div className='relative md:col-span-5'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4 text-muted-foreground'
              >
                <circle cx='11' cy='11' r='8'></circle>
                <path d='m21 21-4.3-4.3'></path>
              </svg>
            </div>
            <input
              type='text'
              placeholder='Search notes...'
              className='block w-full rounded-md border border-input bg-background px-10 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                <button
                  onClick={() => setSearchTerm("")}
                  className='text-muted-foreground hover:text-foreground'
                >
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
                    <path d='M18 6 6 18'></path>
                    <path d='m6 6 12 12'></path>
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className='flex space-x-2 md:col-span-7 justify-end'>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <option value='all'>All Notes</option>
              <option value='time'>Time-based Expiry</option>
              <option value='view'>View-based Expiry</option>
              <option value='password'>Password Protected</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <option value='created'>Created Date</option>
              <option value='title'>Title</option>
              <option value='expiration'>Expiration</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className='inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 w-10'
              title={sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
            >
              {sortOrder === "asc" ? (
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
                  <path d='m3 8 4-4 4 4'></path>
                  <path d='M7 4v16'></path>
                  <path d='M11 12h4'></path>
                  <path d='M11 16h7'></path>
                  <path d='M11 20h10'></path>
                </svg>
              ) : (
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
                  <path d='m3 16 4 4 4-4'></path>
                  <path d='M7 20V4'></path>
                  <path d='M11 4h10'></path>
                  <path d='M11 8h7'></path>
                  <path d='M11 12h4'></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Notes Display Section */}
        <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-700 stagger-1'>
          {filteredAndSortedNotes.length > 0 ? (
            filteredAndSortedNotes.map((note, index) => (
              <Card
                key={note.id}
                className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom-4 duration-700 h-full bg-card/50 backdrop-blur-sm relative'
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
                <div className='absolute right-0 top-0 h-16 w-16 bg-primary/10 rounded-bl-full -z-10 opacity-50'></div>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1.5 min-w-0 flex-1 pr-2'>
                      <CardTitle className='group-hover:text-primary transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden'>
                        <span className='truncate inline-block max-w-[calc(100%-24px)]'>
                          {note.title || "Untitled Note"}
                        </span>
                        {note.passwordProtected && (
                          <Shield className='h-4 w-4 text-primary flex-shrink-0' />
                        )}
                      </CardTitle>
                      <CardDescription className='flex items-center gap-2 truncate'>
                        <span className='inline-block w-2 h-2 rounded-full bg-primary/70 flex-shrink-0' />
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
                      className='h-8 w-8 text-muted-foreground hover:text-destructive opacity-60 hover:opacity-100 transition-opacity'
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
                    <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/60 backdrop-blur-sm'>
                      {note.expirationType === "view" ? (
                        <>
                          <Eye className='h-4 w-4 text-primary flex-shrink-0' />
                          <span className='truncate'>
                            Expires after viewing
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock className='h-4 w-4 text-primary flex-shrink-0' />
                          <span className='truncate'>
                            Expires {formatExpiration(note.expiration)}
                          </span>
                        </>
                      )}
                    </div>
                    {note.passwordProtected && (
                      <div className='flex items-center gap-2 p-2.5 rounded-lg bg-muted/60 backdrop-blur-sm'>
                        <Key className='h-4 w-4 text-primary flex-shrink-0' />
                        <span className='truncate'>Password protected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between gap-2 pt-4'>
                  <Button
                    asChild
                    variant='outline'
                    className='flex-1 transition-all duration-300 hover:bg-primary/5 border-primary/20'
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
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='w-4 h-4'
                      >
                        <path d='M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z'></path>
                        <path d='m15 5 4 4'></path>
                      </svg>
                      <span>Edit</span>
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : notes.length > 0 ? (
            <Card className='col-span-full p-8 text-center bg-gradient-to-br from-background to-muted/20 shadow-sm border-dashed border-2 animate-in fade-in zoom-in duration-500'>
              <CardHeader>
                <CardTitle className='text-2xl'>No matching notes</CardTitle>
                <CardDescription className='text-lg mt-2'>
                  Try adjusting your search or filter criteria
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='w-8 h-8 text-primary/60'
                  >
                    <circle cx='11' cy='11' r='8'></circle>
                    <path d='m21 21-4.3-4.3'></path>
                  </svg>
                </div>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setSortBy("created");
                    setSortOrder("desc");
                  }}
                  className='mt-2'
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className='col-span-full p-8 text-center bg-gradient-to-br from-background to-muted/20 shadow-sm border-dashed border-2 animate-in fade-in zoom-in duration-500'>
              <CardHeader>
                <CardTitle className='text-2xl'>
                  Welcome to Secure Notes
                </CardTitle>
                <CardDescription className='text-lg mt-2'>
                  Create your first secure, encrypted note that self-destructs.
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='max-w-md mx-auto'>
                  <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center'>
                    <PlusCircle className='w-10 h-10 text-primary/60' />
                  </div>
                  <p className='text-muted-foreground mb-8'>
                    Your notes are automatically encrypted and can be set to
                    expire after viewing or after a specific time. You can also
                    add password protection for extra security.
                  </p>
                </div>
              </CardContent>
              <CardFooter className='flex justify-center pt-0'>
                <Button
                  asChild
                  size='lg'
                  className='px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary'
                >
                  <Link href='/create' className='flex items-center gap-2'>
                    <PlusCircle className='w-5 h-5' />
                    <span className='font-medium'>Create Your First Note</span>
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Stats Section */}
        {notes.length > 0 && (
          <div className='rounded-lg border bg-card/30 backdrop-blur-sm p-6 mt-8 relative overflow-hidden group hover:border-primary/20 transition-colors animate-in slide-in-from-bottom-4 duration-700 delay-300'>
            <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10'>
              <div className='space-y-2'>
                <h3 className='text-xl font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                  Note Statistics
                </h3>
                <p className='text-sm text-muted-foreground'>
                  You have {notes.length} secure note
                  {notes.length !== 1 ? "s" : ""} in your account
                </p>
              </div>
              <div className='flex flex-wrap items-center gap-2'>
                <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium border-transparent bg-secondary/80 text-secondary-foreground'>
                  <svg
                    className='w-3.5 h-3.5 mr-1.5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                  {notes.filter((n) => n.expirationType === "view").length}{" "}
                  view-based
                </div>
                <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium border-transparent bg-secondary/80 text-secondary-foreground'>
                  <svg
                    className='w-3.5 h-3.5 mr-1.5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <circle cx='12' cy='12' r='10'></circle>
                    <polyline points='12 6 12 12 16 14'></polyline>
                  </svg>
                  {notes.filter((n) => n.expirationType === "time").length}{" "}
                  time-based
                </div>
                <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium border-transparent bg-secondary/80 text-secondary-foreground'>
                  <svg
                    className='w-3.5 h-3.5 mr-1.5'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect
                      width='18'
                      height='11'
                      x='3'
                      y='11'
                      rx='2'
                      ry='2'
                    ></rect>
                    <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
                  </svg>
                  {notes.filter((n) => n.passwordProtected).length} password
                  protected
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
