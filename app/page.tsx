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
import {
  ArrowRight,
  CheckCircle,
  Eye,
  FileText,
  Lock,
  PlusCircle,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const router = useRouter();
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  useEffect(() => {
    // Only redirect if explicitly logged in and not showing options
    if (isAuthenticated && !isLoading && !showAuthOptions) {
      router.push("/notes");
    }
  }, [isAuthenticated, isLoading, router, showAuthOptions]);

  const handleLogout = async () => {
    await logout();
    // Stay on the landing page after logout
    setShowAuthOptions(false);
  };

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
      <main className='flex-1 w-full max-w-6xl mx-auto px-4 pt-8 pb-16 md:pt-12 md:px-8 md:pb-20 animate-in fade-in duration-700'>
        {/* Hero Section */}
        <section className='relative mb-16 animate-in slide-in-from-top-4 duration-700 delay-100'>
          <div className='absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl -z-10 rounded-full opacity-60'></div>

          <div className='flex flex-col md:flex-row gap-8 items-center justify-between'>
            <div className='max-w-xl space-y-4'>
              <h2 className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent'>
                Secure, Private Notes that Self-Destruct
              </h2>
              <p className='text-lg text-muted-foreground max-w-md'>
                Create encrypted notes that only the recipient can access, and
                automatically delete after viewing.
              </p>

              <div className='flex flex-wrap items-center gap-2 pt-2'>
                <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20'>
                  End-to-end encryption
                </span>
                <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20'>
                  No tracking
                </span>
                <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20'>
                  Zero knowledge
                </span>
              </div>

              <div className='flex flex-wrap gap-3 pt-4'>
                <Button
                  asChild
                  className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary font-medium h-11 px-6 transition-all duration-300'
                >
                  <Link href='/create'>
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Create Secure Note
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='border-primary/20 hover:bg-primary/5 h-11 px-6'
                >
                  <Link href='/view'>
                    <Eye className='h-4 w-4 mr-2' />
                    View Secure Note
                  </Link>
                </Button>
              </div>
            </div>

            <div className='relative max-w-md w-full'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl blur-md -z-10'></div>
              <div className='rounded-2xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-2'>
                    <Lock className='h-5 w-5 text-primary' />
                    <h3 className='font-medium'>New Secure Note</h3>
                  </div>
                  <div className='text-xs text-muted-foreground px-2 py-1 bg-primary/10 rounded-full'>
                    Self-destructing
                  </div>
                </div>
                <div className='space-y-3'>
                  <div className='h-6 w-3/4 bg-muted/50 rounded animate-pulse'></div>
                  <div className='h-6 w-full bg-muted/50 rounded animate-pulse'></div>
                  <div className='h-6 w-5/6 bg-muted/50 rounded animate-pulse'></div>
                  <div className='h-6 w-2/3 bg-muted/50 rounded animate-pulse'></div>
                </div>
                <div className='mt-6 flex justify-end'>
                  <div className='h-9 w-24 bg-primary/80 rounded animate-pulse'></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Options Section */}
        <section className='grid gap-8 md:grid-cols-2 animate-in slide-in-from-bottom-4 duration-700 delay-200'>
          {/* Account Access Card */}
          <Card className='flex flex-col justify-between border-2 group hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden h-full bg-card/50 backdrop-blur-sm relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
            <div className='absolute right-0 top-0 h-24 w-24 bg-primary/15 rounded-bl-full -z-10 opacity-80'></div>
            <CardHeader className='bg-gradient-to-r from-primary/15 to-transparent pb-6 space-y-3'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2 min-w-0 flex-1 pr-2'>
                  <div className='bg-primary/20 text-primary text-xs font-medium py-1 px-3 rounded-full w-fit mb-1'>
                    {isAuthenticated
                      ? "Premium Features"
                      : "Enhanced Experience"}
                  </div>
                  <CardTitle className='group-hover:text-primary transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden text-2xl'>
                    <User className='h-6 w-6 text-primary flex-shrink-0' />
                    <span>
                      {isAuthenticated ? "Your Account" : "Account Access"}
                    </span>
                  </CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    {isAuthenticated
                      ? "Manage your secure notes and account settings"
                      : "Sign in or create an account for an enhanced secure notes experience"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col space-y-5 px-6'>
              {isAuthenticated ? (
                <div className='grid grid-cols-1 gap-4 mb-2'>
                  <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                    <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                      <FileText className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                        Your Notes Dashboard
                      </h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Access and manage all your secure notes in one place
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                    <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                      <Lock className='h-5 w-5 text-primary' />
                    </div>
                    <div>
                      <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                        Profile Settings
                      </h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Update your profile and security preferences
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-1 gap-4 mb-2'>
                  <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                    <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                      <svg
                        className='h-5 w-5 text-primary'
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
                      <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                        Personalized Dashboard
                      </h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Manage all your notes in one secure, dedicated space
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                    <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                      <svg
                        className='h-5 w-5 text-primary'
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
                          height='18'
                          x='3'
                          y='3'
                          rx='2'
                          ry='2'
                        />
                        <path d='M3 9h18' />
                        <path d='M9 21V9' />
                      </svg>
                    </div>
                    <div>
                      <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                        Note History & Analytics
                      </h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Track, organize, and see statistics about your secure
                        notes
                      </p>
                    </div>
                  </div>

                  <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                    <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                      <svg
                        className='h-5 w-5 text-primary'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10' />
                        <path d='M8 11h8' />
                        <path d='M12 15V7' />
                      </svg>
                    </div>
                    <div>
                      <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                        Advanced Security Options
                      </h4>
                      <p className='text-xs text-muted-foreground mt-0.5'>
                        Enable 2FA and customize encryption settings for maximum
                        security
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isAuthenticated ? (
                <div className='space-y-3'>
                  <Button
                    asChild
                    className='w-full transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 font-medium h-11 shadow-sm shadow-primary/20'
                  >
                    <Link
                      href='/notes'
                      className='flex items-center justify-center gap-2'
                    >
                      <FileText className='h-4 w-4 mr-1' />
                      <span>View My Notes</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant='outline'
                    className='w-full transition-all duration-300 hover:bg-primary/5 border-primary/20 h-11'
                    onClick={handleLogout}
                  >
                    <Link
                      href='/settings'
                      className='flex items-center justify-center gap-2'
                    >
                      <User className='h-4 w-4 mr-1' />
                      <span>Account Settings</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className='p-4 bg-primary/5 rounded-lg border border-primary/10'>
                  <AuthForm />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guest Access Card */}
          <Card className='flex flex-col justify-between border-2 group hover:border-primary/40 hover:shadow-xl transition-all duration-300 overflow-hidden h-full bg-card/50 backdrop-blur-sm relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10'></div>
            <div className='absolute right-0 top-0 h-24 w-24 bg-primary/15 rounded-bl-full -z-10 opacity-80'></div>
            <CardHeader className='bg-gradient-to-r from-primary/15 to-transparent pb-6 space-y-3'>
              <div className='flex items-start justify-between'>
                <div className='space-y-2 min-w-0 flex-1 pr-2'>
                  <div className='bg-primary/20 text-primary text-xs font-medium py-1 px-3 rounded-full w-fit mb-1'>
                    No Account Required
                  </div>
                  <CardTitle className='group-hover:text-primary transition-colors duration-300 flex items-center gap-2 max-w-full overflow-hidden text-2xl'>
                    <Shield className='h-6 w-6 text-primary flex-shrink-0' />
                    <span>Quick Guest Access</span>
                  </CardTitle>
                  <CardDescription className='text-sm font-medium'>
                    Create or access secure notes instantly - no registration
                    needed
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className='flex flex-col space-y-5 px-6'>
              <div className='grid grid-cols-1 gap-4'>
                <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                  <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                    <PlusCircle className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                      Instant Secure Notes
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Create encrypted notes in seconds with no setup required
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                  <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                    <svg
                      className='h-5 w-5 text-primary'
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
                    <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                      Self-Destructing Messages
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Notes automatically delete after viewing for zero digital
                      footprint
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                  <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                    <svg
                      className='h-5 w-5 text-primary'
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
                    <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                      Military-Grade Encryption
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Your notes are protected with the highest level of
                      encryption
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-3 group/item hover:bg-primary/10 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-1'>
                  <div className='bg-primary/15 p-2.5 rounded-full group-hover/item:bg-primary/25 transition-colors'>
                    <svg
                      className='h-5 w-5 text-primary'
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
                  </div>
                  <div>
                    <h4 className='text-sm font-semibold group-hover/item:text-primary transition-colors'>
                      Custom Expiration Times
                    </h4>
                    <p className='text-xs text-muted-foreground mt-0.5'>
                      Set custom expiration times for your time-sensitive notes
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className='flex flex-col space-y-3 px-6 pt-2 pb-6 mt-auto'>
              <Button
                asChild
                className='w-full transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 font-medium h-11 shadow-sm shadow-primary/20'
              >
                <Link
                  href='/create?guest=true'
                  className='flex items-center justify-center gap-2'
                >
                  <PlusCircle className='w-4 h-4 mr-1' />
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
        </section>

        {/* Features Section */}
        <section className='mt-16 animate-in slide-in-from-bottom-4 duration-700 delay-300'>
          <div className='text-center mb-10'>
            <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
              Why Choose Secure Notes?
            </h2>
            <p className='text-muted-foreground mt-2 max-w-lg mx-auto'>
              Our platform prioritizes your privacy with industry-leading
              security features
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            <Card className='border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-primary/20'>
              <CardHeader>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2'>
                  <Lock className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl'>End-to-End Encryption</CardTitle>
                <CardDescription>
                  Your data is encrypted before it leaves your device, ensuring
                  only intended recipients can read it
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-primary/20'>
              <CardHeader>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2'>
                  <Eye className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl'>
                  Self-Destructing Notes
                </CardTitle>
                <CardDescription>
                  Notes automatically delete after being viewed, leaving no
                  traces behind
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className='border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-primary/20'>
              <CardHeader>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2'>
                  <CheckCircle className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl'>Zero Knowledge</CardTitle>
                <CardDescription>
                  We can't read your notes even if we wanted to - your privacy
                  is guaranteed
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className='rounded-lg border bg-card/30 backdrop-blur-sm p-6 md:p-8 mt-16 relative overflow-hidden group hover:border-primary/20 transition-colors animate-in slide-in-from-bottom-4 duration-700 delay-400'>
          <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6 relative z-10'>
            <div className='space-y-2 text-center md:text-left'>
              <h3 className='text-2xl font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                Ready to secure your private information?
              </h3>
              <p className='text-muted-foreground max-w-lg'>
                Start creating encrypted, self-destructing notes today - no
                account required
              </p>
            </div>
            <Button
              asChild
              size='lg'
              className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary font-medium transition-all duration-300 hover:scale-[1.02] px-8'
            >
              <Link href='/create' className='flex items-center gap-2'>
                <span>Get Started</span>
                <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
