"use client";

import { useNoteRefresh } from "@/components/providers/note-refresh-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ViewNote({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { refreshNotes } = useNoteRefresh();
  const [password, setPassword] = useState("");
  const [note, setNote] = useState<{
    title: string;
    content: string;
    passwordProtected: boolean;
    isPasswordProtected?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const hasFetchedWithPasswordRef = useRef(false);

  // First check if the note exists and if it's password protected
  // This doesn't count as "viewing" the note for view-once notes
  const checkNoteStatus = async () => {
    try {
      // Only do a HEAD request to check if the note exists
      // This doesn't count as "viewing" the note
      const response = await fetch(`/api/notes/${params.id}/status`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to check note status");
      }

      const data = await response.json();

      // Just set if it's password protected or not
      setNote({
        title: data.title || "",
        content: "",
        passwordProtected: data.isPasswordProtected,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  };

  // This is the actual fetch that will "view" the note
  const fetchNoteContent = async (password?: string) => {
    // Prevent duplicate fetches with password
    if (password && hasFetchedWithPasswordRef.current) {
      return;
    }

    setLoading(true);
    setError("");
    setIsPasswordError(false);

    try {
      const response = await fetch(`/api/notes/${params.id}`, {
        method: password ? "POST" : "GET",
        headers: {
          ...(password && { "Content-Type": "application/json" }),
        },
        ...(password && { body: JSON.stringify({ password }) }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setIsPasswordError(true);
          throw new Error("Incorrect password");
        }
        throw new Error("Failed to fetch note");
      }

      const data = await response.json();
      setNote(data);

      if (password) {
        hasFetchedWithPasswordRef.current = true;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // On component mount, just check if the note exists and if it's password protected
  useEffect(() => {
    checkNoteStatus();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchNoteContent(password);
  };

  const handleViewNote = async () => {
    // This is the function to view a non-password protected note
    // It's only called when the user clicks the "View Note" button
    await fetchNoteContent();
  };

  const handleBack = () => {
    // Trigger refresh before navigating back to home page
    refreshNotes();
    router.push("/");
  };

  if (loading && !initialCheckDone) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/90'>
        <div className='relative max-w-md w-full animate-scale'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
          <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg'>
            <div className='flex items-center justify-center p-8'>
              <div className='relative'>
                <div className='absolute -inset-1 rounded-full blur-md bg-primary/30 animate-pulse'></div>
                <div className='animate-spin relative rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/90'>
        <div className='relative max-w-md w-full animate-scale'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
          <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-primary/10'>
              <div className='flex items-center gap-2'>
                <AlertTriangle className='h-5 w-5 text-destructive' />
                <h3 className='font-medium'>Error</h3>
              </div>
              <div className='text-xs text-muted-foreground px-2 py-1 bg-destructive/10 rounded-full text-destructive'>
                Note Unavailable
              </div>
            </div>

            <div className='p-6'>
              <Alert variant='destructive' className='mb-4'>
                <AlertTriangle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>

              <Button
                onClick={handleBack}
                variant='outline'
                className='w-full border-primary/20 hover:bg-primary/5 h-11 hover-lift'
              >
                Back to Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For password protected notes, show the password form
  if (note?.passwordProtected && !note.content) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/90'>
        <div className='relative max-w-md w-full animate-scale'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
          <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-primary/10'>
              <div className='flex items-center gap-2'>
                <Lock className='h-5 w-5 text-primary' />
                <h3 className='font-medium'>Password Protected</h3>
              </div>
              <div className='text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full'>
                Secure Note
              </div>
            </div>

            <div className='p-6'>
              <p className='text-muted-foreground mb-4'>
                This note is protected. Please enter the password to view it.
              </p>

              <form onSubmit={handlePasswordSubmit}>
                <div className='space-y-4'>
                  <div className='relative'>
                    <Input
                      type='password'
                      placeholder='Enter password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`h-11 ${
                        isPasswordError ? "border-red-500" : "border-primary/20"
                      }`}
                    />
                    <Lock className='absolute right-3 top-3 h-5 w-5 text-muted-foreground' />
                  </div>
                  {isPasswordError && (
                    <p className='text-sm text-red-500'>Incorrect password</p>
                  )}
                  <Button
                    type='submit'
                    variant='gradient'
                    className='w-full font-medium h-11 transition-all duration-300 hover-lift'
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Unlocking...
                      </>
                    ) : (
                      "Unlock Note"
                    )}
                  </Button>
                </div>
              </form>

              <div className='mt-4'>
                <Button
                  onClick={handleBack}
                  variant='outline'
                  className='w-full border-primary/20 hover:bg-primary/5 h-11 hover-lift'
                >
                  Back to Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For non-password protected notes that haven't been viewed yet
  if (initialCheckDone && !note?.passwordProtected && !note?.content) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/90'>
        <div className='relative max-w-md w-full animate-scale'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
          <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-primary/10'>
              <div className='flex items-center gap-2'>
                <Lock className='h-5 w-5 text-primary' />
                <h3 className='font-medium'>{note?.title || "View Note"}</h3>
              </div>
              <div className='text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full'>
                Self-destructing
              </div>
            </div>

            <div className='p-6'>
              <p className='text-muted-foreground mb-4'>
                This is a view-once note. After viewing, it will be permanently
                deleted.
              </p>

              <Button
                onClick={handleViewNote}
                variant='gradient'
                className='w-full font-medium h-11 transition-all duration-300 hover-lift'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Loading...
                  </>
                ) : (
                  "View Note"
                )}
              </Button>

              <div className='mt-4'>
                <Button
                  onClick={handleBack}
                  variant='outline'
                  className='w-full border-primary/20 hover:bg-primary/5 h-11 hover-lift'
                >
                  Back to Notes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For notes that have been fetched successfully
  return (
    <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/90'>
      <div className='relative max-w-2xl w-full animate-scale'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
        <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg'>
          <div className='flex items-center justify-between px-6 py-4 border-b border-primary/10'>
            <div className='flex items-center gap-2'>
              <Lock className='h-5 w-5 text-primary' />
              <h3 className='font-medium'>{note?.title || "Untitled Note"}</h3>
            </div>
            <div className='text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full'>
              Self-destructing
            </div>
          </div>

          <div className='p-6'>
            <div className='rounded-lg border border-primary/10 bg-card/70 p-5 space-y-3'>
              <pre className='whitespace-pre-wrap break-words font-sans text-lg'>
                {note?.content}
              </pre>
            </div>

            <div className='flex justify-end space-x-3 mt-6'>
              <Button
                onClick={handleBack}
                variant='outline'
                className='border-primary/20 hover:bg-primary/5 h-11 px-6 hover-lift'
              >
                Back to Notes
              </Button>
              <Button
                onClick={() => router.push("/create")}
                variant='gradient'
                className='font-medium h-11 px-6 transition-all duration-300 hover-lift'
              >
                Create Secure Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
