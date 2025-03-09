"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/notes");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/95'>
        <div className='relative'>
          <div className='absolute -inset-1 rounded-full blur-md bg-primary/30 animate-pulse'></div>
          <div className='animate-spin relative rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-background via-background/95 to-background/90'>
      <div className='flex-1 flex items-center justify-center p-4 sm:p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8'>
            <Link
              href='/'
              className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              <ArrowLeft className='h-4 w-4 mr-1' />
              Back to Home
            </Link>

            <h1 className='text-3xl font-bold mt-6 mb-2'>
              Welcome to SecrecyNote
            </h1>
            <p className='text-muted-foreground'>
              Sign in or create an account to access your encrypted notes
            </p>
          </div>

          <div className='bg-background/60 backdrop-blur-sm border border-primary/10 rounded-xl p-6 shadow-lg'>
            <AuthForm onSuccess={() => router.push("/notes")} />
          </div>

          <div className='mt-8 text-center text-sm text-muted-foreground'>
            <p>
              By signing in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
