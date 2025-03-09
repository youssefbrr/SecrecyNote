"use client";

import { useNoteRefresh } from "@/components/providers/note-refresh-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='flex justify-center'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={handleBack}
              className='mt-4 w-full'
              variant='outline'
            >
              Back to Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // For password protected notes, show the password form
  if (note?.passwordProtected && !note.content) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Password Protected Note</CardTitle>
            <CardDescription>
              This note is protected. Please enter the password to view it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit}>
              <div className='space-y-4'>
                <div className='relative'>
                  <Input
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={isPasswordError ? "border-red-500" : ""}
                  />
                  <Lock className='absolute right-3 top-2.5 h-5 w-5 text-muted-foreground' />
                </div>
                {isPasswordError && (
                  <p className='text-sm text-red-500'>Incorrect password</p>
                )}
                <Button type='submit' className='w-full' disabled={loading}>
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleBack} variant='outline' className='w-full'>
              Back to Notes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // For non-password protected notes that haven't been viewed yet
  if (initialCheckDone && !note?.passwordProtected && !note?.content) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>{note?.title || "View Note"}</CardTitle>
            <CardDescription>
              This is a view-once note. After viewing, it will be permanently
              deleted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleViewNote}
              className='w-full'
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
          </CardContent>
          <CardFooter>
            <Button onClick={handleBack} variant='outline' className='w-full'>
              Back to Notes
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // For notes that have been fetched successfully
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>{note?.title || "Untitled Note"}</CardTitle>
          <CardDescription>
            This note will be deleted after viewing. Make sure to save any
            important information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg border bg-card p-4'>
            <pre className='whitespace-pre-wrap break-words font-sans'>
              {note?.content}
            </pre>
          </div>
        </CardContent>
        <CardFooter className='flex justify-end space-x-2'>
          <Button onClick={handleBack} variant='outline'>
            Back to Notes
          </Button>
          <Button onClick={() => router.push("/create")} variant='default'>
            Create Secure Note
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
