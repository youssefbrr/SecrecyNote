"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/notes");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center pt-8 px-4 pb-16 md:pt-16 md:px-8 md:pb-24 animate-in fade-in duration-500'>
      <div className='w-full max-w-6xl space-y-10'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <h2 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
              Secure Notes
            </h2>
            <p className='mt-2 text-muted-foreground max-w-md'>
              Create encrypted notes that self-destruct after viewing
            </p>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2 animate-in slide-in-from-bottom-4 duration-700'>
          <Card className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-full'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='space-y-1.5 min-w-0 flex-1 pr-2'>
                  <CardTitle className='group-hover:text-primary/90 transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden'>
                    <User className='h-5 w-5 text-primary/70 flex-shrink-0' />
                    <span>Account Access</span>
                  </CardTitle>
                  <CardDescription>
                    Login or create an account to manage your secure notes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AuthForm />
            </CardContent>
          </Card>

          <Card className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden h-full'>
            <div className='absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
            <CardHeader>
              <div className='flex items-start justify-between'>
                <div className='space-y-1.5 min-w-0 flex-1 pr-2'>
                  <CardTitle className='group-hover:text-primary/90 transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden'>
                    <Shield className='h-5 w-5 text-primary/70 flex-shrink-0' />
                    <span>Guest Access</span>
                  </CardTitle>
                  <CardDescription>
                    Create or view notes without an account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col space-y-4'>
              <p className='text-sm text-muted-foreground'>
                You can create and view secure notes without creating an
                account. Guest notes will be accessible via a unique link and
                will self-destruct after viewing.
              </p>
            </CardContent>
            <CardFooter className='flex flex-col space-y-2 pt-4'>
              <Button
                asChild
                className='w-full transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary/90 to-primary/80'
              >
                <Link
                  href='/create?guest=true'
                  className='flex items-center justify-center gap-2'
                >
                  <PlusCircle className='w-4 h-4' />
                  <span>Create Guest Note</span>
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='w-full transition-all duration-300'
              >
                <Link
                  href='/view'
                  className='flex items-center justify-center gap-2'
                >
                  <span>View Guest Note</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
