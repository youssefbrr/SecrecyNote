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
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/95'>
        <div className='relative'>
          <div className='absolute -inset-1 rounded-full blur-md bg-primary/30 animate-pulse'></div>
          <div className='animate-spin relative rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center pt-8 px-4 pb-16 md:pt-12 md:px-8 md:pb-20 animate-in fade-in duration-700 bg-gradient-to-b from-background via-background/95 to-background/90'>
      <div className='w-full max-w-6xl space-y-10'>
        <div className='relative'>
          <div className='absolute -inset-x-10 -top-10 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl -z-10 rounded-full opacity-60'></div>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-in slide-in-from-top-4 duration-700 delay-100'>
            <div>
              <h2 className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent'>
                Secure Notes
              </h2>
              <p className='mt-3 text-muted-foreground max-w-md text-base'>
                Create encrypted notes that self-destruct after viewing
              </p>
            </div>
            <div className='hidden md:flex items-center space-x-2'>
              <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20'>
                End-to-end encryption
              </span>
              <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20'>
                No tracking
              </span>
            </div>
          </div>
        </div>

        <div className='grid gap-8 md:grid-cols-2 animate-in slide-in-from-bottom-4 duration-700 delay-200'>
          <Card className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden h-full bg-card/50 backdrop-blur-sm relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
            <div className='absolute right-0 top-0 h-20 w-20 bg-primary/10 rounded-bl-full -z-10 opacity-70'></div>
            <CardHeader className='bg-gradient-to-r from-primary/10 to-transparent pb-6 space-y-2.5'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2 min-w-0 flex-1 pr-2'>
                  <CardTitle className='group-hover:text-primary transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden text-2xl'>
                    <User className='h-6 w-6 text-primary flex-shrink-0' />
                    <span>Account Access</span>
                  </CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    Sign in or create an account for enhanced features
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col space-y-5 px-6'>
              <div className='grid grid-cols-1 gap-4 mb-2'>
                <div className='flex items-start gap-3 group/item hover:bg-primary/5 p-2 rounded-lg transition-colors'>
                  <div className='bg-primary/15 p-2 rounded-full group-hover/item:bg-primary/20 transition-colors'>
                    <svg
                      className='h-4 w-4 text-primary'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                      <circle cx='12' cy='7' r='4' />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold'>
                      Personalized Dashboard
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Manage all your notes in one secure location
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/5 p-2 rounded-lg transition-colors'>
                  <div className='bg-primary/15 p-2 rounded-full group-hover/item:bg-primary/20 transition-colors'>
                    <svg
                      className='h-4 w-4 text-primary'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
                      <path d='M3 9h18' />
                      <path d='M9 21V9' />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold'>Note History</h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      View, organize, and track all your created notes
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/5 p-2 rounded-lg transition-colors'>
                  <div className='bg-primary/15 p-2 rounded-full group-hover/item:bg-primary/20 transition-colors'>
                    <svg
                      className='h-4 w-4 text-primary'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M12 2a10 10 0 1 0 10 10H12V2Z' />
                      <path d='M21.2 8A4 4 0 0 0 18 6a4 4 0 0 0-4 4' />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold'>
                      Advanced Analytics
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      See when your notes are viewed and accessed
                    </p>
                  </div>
                </div>
              </div>
              <AuthForm />
            </CardContent>
          </Card>

          <Card className='flex flex-col justify-between border group hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden h-full bg-card/50 backdrop-blur-sm relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
            <div className='absolute right-0 top-0 h-20 w-20 bg-primary/10 rounded-bl-full -z-10 opacity-70'></div>
            <CardHeader className='bg-gradient-to-r from-primary/10 to-transparent pb-6 space-y-2.5'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2 min-w-0 flex-1 pr-2'>
                  <CardTitle className='group-hover:text-primary transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden text-2xl'>
                    <Shield className='h-6 w-6 text-primary flex-shrink-0' />
                    <span>Quick Guest Access</span>
                  </CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    No account needed - create or access secure notes instantly
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col space-y-5 px-6'>
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex items-start gap-3 group/item hover:bg-primary/5 p-2 rounded-lg transition-colors'>
                  <div className='bg-primary/15 p-2 rounded-full group-hover/item:bg-primary/20 transition-colors'>
                    <PlusCircle className='h-4 w-4 text-primary' />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold'>
                      Private Note Creation
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Create encrypted notes that only the recipient can access
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/5 p-2 rounded-lg transition-colors'>
                  <div className='bg-primary/15 p-2 rounded-full group-hover/item:bg-primary/20 transition-colors'>
                    <svg
                      className='h-4 w-4 text-primary'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='m21 8-2 2-5-5 2-2 5 5Z' />
                      <path d='M19 10 9 20l-5.5.5.5-5.5L14 5l5 5Z' />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold'>Self-Destructing</h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Notes automatically delete after viewing for maximum
                      privacy
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/5 p-2 rounded-lg transition-colors'>
                  <div className='bg-primary/15 p-2 rounded-full group-hover/item:bg-primary/20 transition-colors'>
                    <svg
                      className='h-4 w-4 text-primary'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
                    </svg>
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold'>
                      End-to-End Encryption
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Your notes are encrypted and secure from prying eyes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col space-y-3 px-6 pt-2 pb-6 mt-auto'>
              <Button
                asChild
                className='w-full transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 font-medium h-11'
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
                className='w-full transition-all duration-300 hover:bg-primary/5 border-primary/20 h-11'
              >
                <Link
                  href='/view'
                  className='flex items-center justify-center gap-2'
                >
                  <svg
                    className='h-4 w-4 mr-1'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                    <circle cx='12' cy='12' r='3' />
                  </svg>
                  <span>View Guest Note</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className='rounded-lg border bg-card/30 backdrop-blur-sm p-6 md:p-8 mt-10 relative overflow-hidden group hover:border-primary/20 transition-colors animate-in slide-in-from-bottom-4 duration-700 delay-300'>
          <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10'>
            <div className='space-y-2'>
              <h3 className='text-xl font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                Why Choose SecrecyNote?
              </h3>
              <p className='text-sm text-muted-foreground max-w-lg'>
                Our platform prioritizes security and privacy for all your
                sensitive information with industry-leading encryption
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors'>
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
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
                No tracking
              </div>
              <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors'>
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
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
                Zero knowledge
              </div>
              <div className='inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary transition-colors'>
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
                  <polyline points='20 6 9 17 4 12'></polyline>
                </svg>
                Cryptographically secure
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
