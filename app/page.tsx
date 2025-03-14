"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
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
  const [showAuthModal, setShowAuthModal] = useState(false);

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
          <div className='absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl -z-10 rounded-full opacity-60 animate-pulse-subtle'></div>

          <div className='flex flex-col md:flex-row gap-8 items-center justify-between'>
            <div className='max-w-xl space-y-4 animate-fade-in'>
              <h2
                className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent animate-slide-up'
                style={{ animationDelay: "0.05s" }}
              >
                Secure Notes, Simplified
              </h2>
              <p className='text-lg text-muted-foreground max-w-md'>
                Create secure, encrypted notes that automatically delete after
                viewing.
              </p>

              <div
                className='flex flex-wrap items-center gap-2 pt-2 animate-slide-up'
                style={{ animationDelay: "0.1s" }}
              >
                <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 hover-lift-sm'>
                  End-to-end encryption
                </span>
                <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 hover-lift-sm'>
                  No tracking
                </span>
                <span className='inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 hover-lift-sm'>
                  Zero knowledge
                </span>
              </div>

              <div
                className='flex flex-wrap gap-3 pt-4 animate-slide-up'
                style={{ animationDelay: "0.2s" }}
              >
                <Button
                  asChild
                  variant='gradient'
                  className='font-medium h-11 px-6 transition-all duration-300 hover-lift'
                >
                  <Link href='/create?guest=true'>
                    <PlusCircle className='h-4 w-4 mr-2 animate-pulse-subtle' />
                    Create Secure Note
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='border-primary/20 hover:bg-primary/5 h-11 px-6 hover-lift'
                >
                  <Link href='/view'>
                    <Eye className='h-4 w-4 mr-2' />
                    View Secure Note
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='ghost'
                  className='hover:bg-primary/5 h-11 px-6 hover-lift'
                >
                  <Link href='/features'>
                    <ArrowRight className='h-4 w-4 mr-2' />
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>

            <div
              className='relative max-w-md w-full animate-scale'
              style={{ animationDelay: "0.3s" }}
            >
              <div className='absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl blur-md -z-10 animate-pulse-subtle'></div>
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

        {/* Options Section - Redesigned without cards */}
        <section className='mt-24 mb-24 animate-in slide-in-from-bottom-4 duration-700 delay-200'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
              Choose Your SecrecyNote Path
            </h2>
            <p className='text-muted-foreground mt-3 max-w-2xl mx-auto text-lg'>
              Whether you need a permanent solution or a quick secure note,
              we've got you covered
            </p>
            <div className='mt-6'>
              <Button
                asChild
                variant='outline'
                className='border-primary/20 hover:bg-primary/5 h-10 px-5 hover-lift-sm'
              >
                <Link href='/features'>
                  <ArrowRight className='h-4 w-4 mr-2' />
                  Explore All Features
                </Link>
              </Button>
            </div>
          </div>

          {/* Account Access Section */}
          <div className='relative mb-28'>
            {/* Background gradient decorations */}
            <div className='absolute -left-10 top-10 h-32 w-32 bg-primary/20 rounded-full blur-3xl opacity-50 -z-10'></div>
            <div className='absolute right-20 bottom-10 h-24 w-24 bg-primary/30 rounded-full blur-2xl opacity-30 -z-10'></div>

            <div className='bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 md:p-10 shadow-xl'>
              <div className='grid md:grid-cols-2 items-center gap-10 md:gap-16'>
                {/* Left side - Content */}
                <div className='space-y-6'>
                  <div className='inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2'>
                    <User className='h-4 w-4 mr-2' />
                    Account Experience
                  </div>

                  <h3 className='text-2xl md:text-3xl font-bold leading-tight'>
                    {isAuthenticated
                      ? `Welcome back, ${user?.name || "User"}!`
                      : "Unlock Enhanced SecrecyNote Features"}
                  </h3>

                  <p className='text-muted-foreground text-lg'>
                    {isAuthenticated
                      ? "Your SecrecyNote dashboard is ready. Access and manage all your encrypted notes in one place."
                      : "Create an account to access advanced features, track note history, and manage all your secure communications."}
                  </p>

                  <div className='pt-2 grid gap-4'>
                    <div className='flex items-start gap-4 group'>
                      <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                        <FileText className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                          Organized Dashboard
                        </h4>
                        <p className='text-muted-foreground'>
                          Keep all your notes in one secure place with powerful
                          organization tools
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-4 group'>
                      <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                        <Lock className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                          Enhanced Security
                        </h4>
                        <p className='text-muted-foreground'>
                          Two-factor authentication, custom encryption settings,
                          and more
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='pt-4 flex flex-wrap gap-3'>
                    {isAuthenticated ? (
                      <>
                        <Button
                          asChild
                          className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-md hover:shadow-lg transition-all duration-300'
                          size='lg'
                        >
                          <Link
                            href='/notes'
                            className='flex items-center gap-2'
                          >
                            <FileText className='h-4 w-4' />
                            Go to My Notes
                          </Link>
                        </Button>
                        <Button
                          variant='outline'
                          className='border-primary/20 hover:bg-primary/5'
                          onClick={handleLogout}
                          size='lg'
                        >
                          Log Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <AuthModal
                          trigger={
                            <Button
                              className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2'
                              size='lg'
                            >
                              <User className='h-4 w-4' />
                              Sign In / Register
                            </Button>
                          }
                          onOpenChange={setShowAuthModal}
                        />
                        <Button
                          asChild
                          variant='outline'
                          className='border-primary/20 hover:bg-primary/5'
                          size='lg'
                        >
                          <Link
                            href='/create?guest=true'
                            className='flex items-center gap-2'
                          >
                            <PlusCircle className='h-4 w-4' />
                            Try without Account
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>

                  {!isAuthenticated && (
                    <div className='mt-3 text-center text-sm text-muted-foreground'>
                      <Link
                        href='/auth'
                        className='hover:text-primary hover:underline transition-colors'
                      >
                        Prefer a full page experience? Sign in to SecrecyNote
                        here
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right side - Visual */}
                <div className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-tr from-primary/15 to-transparent rounded-2xl -z-10'></div>

                  <div className='p-1 bg-gradient-to-br from-primary/30 via-primary/20 to-transparent rounded-2xl shadow-xl'>
                    <div className='backdrop-blur-sm bg-background/80 rounded-xl overflow-hidden p-6'>
                      <div className='flex items-center justify-between border-b border-border/40 pb-4 mb-5'>
                        <div className='flex items-center gap-3'>
                          <div className='h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center'>
                            <User className='h-5 w-5 text-primary' />
                          </div>
                          <div>
                            <h4 className='font-medium'>
                              SecrecyNote Dashboard
                            </h4>
                            <p className='text-xs text-muted-foreground'>
                              All your notes in one place
                            </p>
                          </div>
                        </div>
                        <div className='text-xs px-2 py-1 bg-primary/20 text-primary rounded-full'>
                          End-to-End Encrypted
                        </div>
                      </div>

                      <div className='space-y-4'>
                        {/* Note preview items */}
                        <div className='flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group'>
                          <div className='h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center'>
                            <Lock className='h-4 w-4 text-primary' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h5 className='font-medium truncate group-hover:text-primary transition-colors'>
                              Project Access Credentials
                            </h5>
                            <div className='flex items-center gap-2'>
                              <div className='text-xs text-muted-foreground'>
                                Created 2 days ago
                              </div>
                              <div className='h-1 w-1 rounded-full bg-muted-foreground'></div>
                              <div className='text-xs text-muted-foreground'>
                                Self-destructing
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group'>
                          <div className='h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center'>
                            <FileText className='h-4 w-4 text-primary' />
                          </div>
                          <div className='flex-1 min-w-0'>
                            <h5 className='font-medium truncate group-hover:text-primary transition-colors'>
                              Meeting Notes - Confidential
                            </h5>
                            <div className='flex items-center gap-2'>
                              <div className='text-xs text-muted-foreground'>
                                Created 1 week ago
                              </div>
                              <div className='h-1 w-1 rounded-full bg-muted-foreground'></div>
                              <div className='text-xs text-muted-foreground'>
                                Password protected
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='flex items-start justify-end'>
                          <Button
                            variant='ghost'
                            className='text-sm text-muted-foreground hover:text-primary'
                            size='sm'
                          >
                            View all notes{" "}
                            <ArrowRight className='h-3 w-3 ml-1' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Access Section */}
          <div className='relative mt-32'>
            {/* Background gradient decorations */}
            <div className='absolute right-0 top-0 h-40 w-40 bg-primary/20 rounded-full blur-3xl opacity-50 -z-10'></div>
            <div className='absolute -left-10 bottom-10 h-28 w-28 bg-primary/30 rounded-full blur-2xl opacity-30 -z-10'></div>

            <div className='bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 md:p-10 shadow-xl'>
              <div className='grid md:grid-cols-2 items-center gap-10 md:gap-16'>
                {/* Left side - Visual */}
                <div className='order-2 md:order-1'>
                  <div className='p-1 bg-gradient-to-tl from-primary/30 via-primary/20 to-transparent rounded-2xl shadow-xl'>
                    <div className='backdrop-blur-sm bg-background/80 rounded-xl overflow-hidden'>
                      <div className='bg-primary/10 py-3 px-5 flex items-center justify-between border-b border-primary/10'>
                        <div className='flex items-center gap-2'>
                          <Lock className='h-4 w-4 text-primary' />
                          <span className='text-sm font-medium'>
                            New SecrecyNote
                          </span>
                        </div>
                        <div className='text-xs px-2 py-1 bg-primary/20 rounded-full text-primary'>
                          Self-destructing
                        </div>
                      </div>

                      <div className='p-6'>
                        <div className='space-y-5'>
                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Note Title
                            </label>
                            <div className='h-10 w-full bg-muted/70 rounded-md animate-pulse'></div>
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Message
                            </label>
                            <div className='space-y-2'>
                              <div className='h-4 w-full bg-muted/50 rounded animate-pulse'></div>
                              <div className='h-4 w-full bg-muted/50 rounded animate-pulse'></div>
                              <div className='h-4 w-3/4 bg-muted/50 rounded animate-pulse'></div>
                            </div>
                          </div>

                          <div>
                            <label className='block text-sm font-medium mb-1'>
                              Expiration
                            </label>
                            <div className='h-10 w-2/3 bg-muted/70 rounded-md animate-pulse'></div>
                          </div>
                        </div>

                        <div className='flex justify-end mt-8'>
                          <div className='h-10 w-32 bg-primary/80 rounded-md animate-pulse'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className='space-y-6 order-1 md:order-2'>
                  <div className='inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2'>
                    <Shield className='h-4 w-4 mr-2' />
                    Quick Guest Access
                  </div>

                  <h3 className='text-2xl md:text-3xl font-bold leading-tight'>
                    No Registration Required
                  </h3>

                  <p className='text-muted-foreground text-lg'>
                    Create and share encrypted notes instantly without an
                    account. Perfect for one-time secure sharing of sensitive
                    information.
                  </p>

                  <div className='pt-2 grid gap-4'>
                    <div className='flex items-start gap-4 group'>
                      <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                        <PlusCircle className='h-5 w-5 text-primary' />
                      </div>
                      <div>
                        <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                          Instant SecrecyNotes
                        </h4>
                        <p className='text-muted-foreground'>
                          Create encrypted notes in seconds with zero setup or
                          registration
                        </p>
                      </div>
                    </div>

                    <div className='flex items-start gap-4 group'>
                      <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
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
                        <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                          Self-Destructing Messages
                        </h4>
                        <p className='text-muted-foreground'>
                          Notes automatically delete after viewing for zero
                          digital footprint
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='pt-4 flex flex-wrap gap-3'>
                    <Button
                      asChild
                      className='bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary/90 shadow-md hover:shadow-lg transition-all duration-300'
                      size='lg'
                    >
                      <Link
                        href='/create?guest=true'
                        className='flex items-center gap-2'
                      >
                        <PlusCircle className='h-4 w-4' />
                        Create Guest Note
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant='outline'
                      className='border-primary/20 hover:bg-primary/5'
                      size='lg'
                    >
                      <Link href='/view' className='flex items-center gap-2'>
                        <Eye className='h-4 w-4' />
                        View Received Note
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className='mt-16 animate-in slide-in-from-bottom-4 duration-700 delay-300'>
          <div className='text-center mb-10 animate-fade-in'>
            <h2 className='text-2xl md:text-3xl font-bold tracking-tight'>
              Why Choose SecrecyNote?
            </h2>
            <p className='text-muted-foreground mt-2 max-w-lg mx-auto'>
              Our platform prioritizes your privacy with industry-leading
              security features
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-6'>
            <Card
              className='border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 hover-lift animate-scale'
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-pulse-subtle'>
                  <Lock className='h-6 w-6 text-primary' />
                </div>
                <CardTitle className='text-xl'>End-to-End Encryption</CardTitle>
                <CardDescription>
                  Your data is encrypted before it leaves your device, ensuring
                  only intended recipients can read it
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className='border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 hover-lift animate-scale'
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-pulse-subtle'>
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

            <Card
              className='border-primary/10 bg-card/50 backdrop-blur-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 hover-lift animate-scale'
              style={{ animationDelay: "0.3s" }}
            >
              <CardHeader>
                <div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 animate-pulse-subtle'>
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
        <section className='rounded-lg border bg-card/30 backdrop-blur-sm p-6 md:p-8 mt-16 relative overflow-hidden group hover:border-primary/20 transition-colors animate-in slide-in-from-bottom-4 duration-700 delay-400 hover-lift'>
          <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6 relative z-10'>
            <div className='space-y-2 text-center md:text-left'>
              <h3 className='text-2xl font-medium bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                Ready to secure your private information with SecrecyNote?
              </h3>
              <p className='text-muted-foreground max-w-lg'>
                Start creating encrypted, self-destructing notes today - no
                account required
              </p>
            </div>
            <Button
              asChild
              size='lg'
              variant='gradient'
              className='font-medium transition-all duration-300 hover-lift px-8'
            >
              <Link href='/create' className='flex items-center gap-2'>
                <span>Try SecrecyNote Now</span>
                <ArrowRight className='h-4 w-4 animate-pulse-subtle' />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
