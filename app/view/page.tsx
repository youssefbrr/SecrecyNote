"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  Loader2,
  Search,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ViewNotePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [noteId, setNoteId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteId.trim()) {
      setError("Please enter a note ID");
      return;
    }

    // Check if note exists before redirecting
    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${noteId.trim()}/status`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Note not found");
      }

      // Note exists, redirect to it
      router.push(`/view/${noteId.trim()}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Note not found");
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background/95 to-background/90'>
        <div className='relative'>
          <div className='absolute -inset-1 rounded-full blur-md bg-primary/30 animate-pulse'></div>
          <div className='animate-spin relative rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background via-background/95 to-background/90'>
      <div className='relative max-w-md w-full animate-scale'>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
        <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg'>
          <div className='flex items-center justify-between px-6 py-4 border-b border-primary/10'>
            <div className='flex items-center gap-2'>
              <Eye className='h-5 w-5 text-primary' />
              <h3 className='font-medium'>View Secure Note</h3>
            </div>
            <div className='text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full text-primary'>
              End-to-end encrypted
            </div>
          </div>

          <div className='p-6'>
            {error && (
              <Alert variant='destructive' className='mb-4'>
                <AlertTriangle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label htmlFor='noteId' className='text-sm font-medium'>
                    Enter Note ID
                  </label>
                </div>
                <div className='relative'>
                  <Input
                    id='noteId'
                    placeholder='Paste the secure note ID here'
                    value={noteId}
                    onChange={(e) => {
                      setNoteId(e.target.value);
                      setError("");
                    }}
                    className='pr-10 border-primary/20 focus:border-primary transition-all bg-card'
                    disabled={loading}
                  />
                  <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
                    <Search className='h-4 w-4' />
                  </div>
                </div>
              </div>

              <div className='pt-2'>
                <Button
                  type='submit'
                  variant='gradient'
                  className='w-full font-medium h-11 hover-lift'
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Eye className='h-4 w-4 mr-2' />
                      Access Secure Note
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className='flex flex-col gap-3 mt-6 pt-6 border-t border-primary/10'>
              {!isAuthenticated && (
                <AuthModal
                  trigger={
                    <Button
                      variant='outline'
                      className='w-full border-primary/20 hover:bg-primary/5 h-11 hover-lift'
                    >
                      <User className='h-4 w-4 mr-2' />
                      Login or Register
                    </Button>
                  }
                  onOpenChange={setShowAuthModal}
                />
              )}

              <Button
                asChild
                variant='outline'
                className='w-full border-primary/20 hover:bg-primary/5 h-11 hover-lift'
                disabled={loading}
              >
                <Link href='/'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
