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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatRelativeTime } from "@/lib/date-utils";
import {
  ArrowUpDown,
  Clock,
  Eye,
  Filter,
  Key,
  PlusCircle,
  Search,
  Shield,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Note = {
  id: string;
  title: string | null;
  expirationType: string;
  expiration: string | null;
  passwordProtected: boolean;
  created: string;
  updated: string;
  isExpired?: boolean;
};

// Helper function to check if a note is expired
function isNoteExpired(note: Note): boolean {
  if (note.isExpired !== undefined) {
    return note.isExpired;
  }

  if (note.expirationType === "never") return false;

  if (note.expirationType === "time" && note.expiration) {
    const expirationDate = new Date(note.created);

    // Convert UI-friendly formats to calculation format
    let expirationValue = note.expiration;

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
      return false;
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
        return false;
    }

    const now = new Date();
    return now > expirationDate;
  }

  // For view-based expiration, we can't determine client-side
  // This will need to be handled server-side
  return false;
}

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
  const { refreshFlag } = useNoteRefresh();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"created" | "title" | "expiration">(
    "created"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<
    "all" | "time" | "view" | "password" | "expired" | "active"
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

  // Calculate various stats for the notes
  const activeNotes = notes.filter((note) => !isNoteExpired(note));
  const expiredNotes = notes.filter((note) => isNoteExpired(note));
  const passwordProtectedNotes = notes.filter(
    (note) => note.passwordProtected
  ).length;
  const passwordProtectionRate =
    notes.length > 0
      ? Math.round((passwordProtectedNotes / notes.length) * 100)
      : 0;

  // Using useMemo to optimize filtering and sorting
  const filteredAndSortedNotes = useMemo(() => {
    // First filter notes based on type selection
    let filtered = notes;

    switch (filterType) {
      case "time":
        filtered = notes.filter((note) => note.expirationType === "time");
        break;
      case "view":
        filtered = notes.filter((note) => note.expirationType === "view");
        break;
      case "password":
        filtered = notes.filter((note) => note.passwordProtected);
        break;
      case "expired":
        filtered = expiredNotes;
        break;
      case "active":
        filtered = activeNotes;
        break;
    }

    // Then filter by search term
    filtered = filtered.filter((note) => {
      if (
        searchTerm &&
        !note.title?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    // Finally sort
    return filtered.sort((a, b) => {
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
  }, [
    notes,
    filterType,
    activeNotes,
    expiredNotes,
    searchTerm,
    sortOrder,
    sortBy,
  ]);

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
              className='px-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary hover:scale-[1.02]'
            >
              <Link href='/create' className='flex items-center gap-2'>
                <PlusCircle className='w-4 h-4' />
                <span>Create New Note</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and filter controls */}
        <div className='grid grid-cols-1 md:grid-cols-12 gap-4 animate-in slide-in-from-top-4 duration-700 bg-card/30 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm'>
          <div className='relative md:col-span-5'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-4 w-4 text-muted-foreground' />
            </div>
            <input
              type='text'
              placeholder='Search notes...'
              className='block w-full rounded-lg border border-input/50 bg-background/50 px-10 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                <button
                  onClick={() => setSearchTerm("")}
                  className='text-muted-foreground hover:text-foreground rounded-full hover:bg-background/70 p-1 transition-colors'
                >
                  <X className='h-3.5 w-3.5' />
                </button>
              </div>
            )}
          </div>

          <div className='flex flex-wrap gap-2 md:col-span-7 justify-end'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-10 gap-1.5 border-input/50 bg-background/50 hover:bg-background/80'
                >
                  <Filter className='h-3.5 w-3.5' />
                  <span>
                    {filterType === "all"
                      ? "All Notes"
                      : filterType === "time"
                      ? "Time-based"
                      : filterType === "view"
                      ? "View-based"
                      : filterType === "password"
                      ? "Password Protected"
                      : filterType === "expired"
                      ? "Expired Notes"
                      : "Active Notes"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='shadow-lg rounded-lg border-border/50'
              >
                <DropdownMenuItem
                  onClick={() => setFilterType("all")}
                  className='cursor-pointer'
                >
                  All Notes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("active")}
                  className='cursor-pointer flex items-center gap-2'
                >
                  <span className='text-primary font-medium'>Active Notes</span>
                  {activeNotes.length > 0 && (
                    <span className='bg-primary/10 text-primary text-xs font-medium rounded-full px-2 py-0.5'>
                      {activeNotes.length}
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("expired")}
                  className='cursor-pointer flex items-center gap-2'
                >
                  <span className='text-destructive font-medium'>
                    Expired Notes
                  </span>
                  {expiredNotes.length > 0 && (
                    <span className='bg-destructive/10 text-destructive text-xs font-medium rounded-full px-2 py-0.5'>
                      {expiredNotes.length}
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setFilterType("time")}
                  className='cursor-pointer'
                >
                  Time-based
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("view")}
                  className='cursor-pointer'
                >
                  View-based
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterType("password")}
                  className='cursor-pointer'
                >
                  Password Protected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className='flex items-center gap-2 border border-input/50 bg-background/50 px-3 py-2 rounded-md text-sm h-10'>
              <span className='text-muted-foreground text-xs'>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className='bg-transparent border-none outline-none focus:ring-0 p-0 h-auto text-sm w-24'
              >
                <option value='created'>Created</option>
                <option value='title'>Title</option>
                <option value='expiration'>Expiration</option>
              </select>

              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className='inline-flex items-center justify-center rounded-md text-sm hover:bg-muted/50 p-1 transition-colors'
                title={
                  sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"
                }
              >
                <ArrowUpDown className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Display Section */}
        <div className='grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-in slide-in-from-bottom-4 duration-700 stagger-1'>
          {filteredAndSortedNotes.length > 0 ? (
            filteredAndSortedNotes.map((note, index) => (
              <Card
                key={note.id}
                className={`group relative overflow-hidden transition-all duration-300 hover:shadow-md dark:hover:shadow-primary/5 ${
                  isNoteExpired(note)
                    ? "border-destructive/30 bg-destructive/5 dark:bg-destructive/10"
                    : "hover:border-primary/50 border-border/50 bg-card"
                }`}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                {isNoteExpired(note) && (
                  <>
                    <div className='absolute inset-0 bg-destructive/5 backdrop-blur-[1px] pointer-events-none z-0'></div>
                    <div className='absolute -bottom-4 -right-4 text-destructive/10 font-bold rotate-12 text-8xl select-none pointer-events-none z-10'>
                      EXPIRED
                    </div>
                  </>
                )}
                <CardHeader className='relative z-20'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-1.5'>
                      <CardTitle
                        className={`group-hover:text-primary transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden ${
                          isNoteExpired(note) ? "text-muted-foreground" : ""
                        }`}
                      >
                        <span className='truncate inline-block max-w-[calc(100%-24px)]'>
                          {note.title || "Untitled Note"}
                        </span>
                        {note.passwordProtected && (
                          <Shield
                            className={`h-4 w-4 flex-shrink-0 ${
                              isNoteExpired(note)
                                ? "text-muted-foreground"
                                : "text-primary"
                            }`}
                          />
                        )}
                      </CardTitle>
                      <CardDescription className='flex items-center gap-2 truncate'>
                        <span
                          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                            isNoteExpired(note)
                              ? "bg-destructive/70"
                              : "bg-primary/70"
                          }`}
                        />
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
                      className='h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-60 hover:opacity-100 transition-all rounded-full'
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <span className='sr-only'>Delete</span>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                  {isNoteExpired(note) && (
                    <div className='absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-md border border-destructive/20 animate-pulse duration-[4000ms]'>
                      Expired
                    </div>
                  )}
                </CardHeader>
                <CardContent className='relative z-20'>
                  <div className='flex flex-col space-y-3 text-sm'>
                    <div
                      className={`flex items-center gap-2 p-2.5 rounded-lg backdrop-blur-sm ${
                        isNoteExpired(note)
                          ? "bg-destructive/10"
                          : "bg-muted/60"
                      }`}
                    >
                      {note.expirationType === "view" ? (
                        <>
                          <Eye
                            className={`h-4 w-4 flex-shrink-0 ${
                              isNoteExpired(note)
                                ? "text-destructive"
                                : "text-primary"
                            }`}
                          />
                          <span className='truncate'>
                            {isNoteExpired(note)
                              ? "Expired after viewing"
                              : "Expires after viewing"}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock
                            className={`h-4 w-4 flex-shrink-0 ${
                              isNoteExpired(note)
                                ? "text-destructive"
                                : "text-primary"
                            }`}
                          />
                          <span className='truncate'>
                            {isNoteExpired(note)
                              ? "Expired"
                              : `Expires ${formatExpiration(note.expiration)}`}
                          </span>
                        </>
                      )}
                    </div>
                    {note.passwordProtected && (
                      <div
                        className={`flex items-center gap-2 p-2.5 rounded-lg backdrop-blur-sm ${
                          isNoteExpired(note)
                            ? "bg-destructive/10"
                            : "bg-muted/60"
                        }`}
                      >
                        <Key
                          className={`h-4 w-4 flex-shrink-0 ${
                            isNoteExpired(note)
                              ? "text-destructive"
                              : "text-primary"
                          }`}
                        />
                        <span className='truncate'>Password protected</span>
                      </div>
                    )}
                    {isNoteExpired(note) && (
                      <div className='p-3 rounded-lg bg-destructive/15 border border-destructive/20'>
                        <p className='text-center text-destructive text-xs font-medium'>
                          This note has expired and cannot be viewed or edited
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between gap-2 pt-4 relative z-20'>
                  <Button
                    asChild={!isNoteExpired(note)}
                    variant='outline'
                    className={`flex-1 transition-all duration-300 ${
                      isNoteExpired(note)
                        ? "opacity-70 cursor-not-allowed bg-destructive/10 border-destructive/30 text-destructive/70"
                        : "hover:bg-primary/5 border-primary/20 hover:border-primary/40"
                    }`}
                    disabled={isNoteExpired(note)}
                  >
                    {isNoteExpired(note) ? (
                      <div className='flex items-center justify-center gap-2'>
                        <Eye className='w-4 h-4' />
                        <span>View</span>
                      </div>
                    ) : (
                      <Link
                        href={`/view/${note.id}`}
                        className='flex items-center justify-center gap-2 w-full h-full'
                      >
                        <Eye className='w-4 h-4' />
                        <span>View</span>
                      </Link>
                    )}
                  </Button>
                  <Button
                    asChild={!isNoteExpired(note)}
                    className={`flex-1 transition-all duration-300 ${
                      isNoteExpired(note)
                        ? "opacity-70 cursor-not-allowed bg-destructive/10 text-destructive/70"
                        : "hover:scale-[1.02] bg-gradient-to-r from-primary/90 to-primary/80 hover:shadow-md"
                    }`}
                    disabled={isNoteExpired(note)}
                  >
                    {isNoteExpired(note) ? (
                      <div className='flex items-center justify-center gap-2'>
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
                      </div>
                    ) : (
                      <Link
                        href={`/edit/${note.id}`}
                        className='flex items-center justify-center gap-2 w-full h-full'
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
                    )}
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
                  <Search className='w-8 h-8 text-primary/60' />
                </div>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setSortOrder("desc");
                  }}
                  className='mt-2 hover:border-primary/30 hover:text-primary transition-colors'
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className='col-span-full p-8 text-center bg-gradient-to-br from-background to-muted/20 shadow-sm border-dashed border-2 animate-in fade-in zoom-in duration-500'>
              <CardHeader>
                <CardTitle className='text-2xl bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent'>
                  Welcome to Secure Notes
                </CardTitle>
                <CardDescription className='text-lg mt-2'>
                  Create your first secure, encrypted note that self-destructs.
                </CardDescription>
              </CardHeader>
              <CardContent className='pt-4'>
                <div className='max-w-md mx-auto'>
                  <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-inner'>
                    <PlusCircle className='w-10 h-10 text-primary/70' />
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
                  className='px-8 py-6 rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary hover:scale-[1.02]'
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
          <div className='rounded-xl border bg-card/30 backdrop-blur-sm p-6 mt-8 relative overflow-hidden group hover:border-primary/20 transition-colors animate-in slide-in-from-bottom-4 duration-700 delay-300 shadow-sm'>
            <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10'>
              <div className='space-y-2'>
                <h3 className='text-xl font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                  Note Statistics
                </h3>
                <p className='text-sm text-muted-foreground'>
                  You have {notes.length} total notes in your account (
                  {activeNotes.length} active, {expiredNotes.length} expired)
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
                  {passwordProtectedNotes} password protected (
                  {passwordProtectionRate}%)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
