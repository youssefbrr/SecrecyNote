"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Key,
  Layers,
  Lock,
  PlusCircle,
  RefreshCw,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className='flex min-h-screen flex-col bg-gradient-to-b from-background via-background/95 to-background/90'>
      <main className='flex-1 w-full max-w-6xl mx-auto px-4 pt-8 pb-16 md:pt-12 md:px-8 md:pb-20 animate-in fade-in duration-700'>
        {/* Hero Section */}
        <section className='relative mb-16 animate-in slide-in-from-top-4 duration-700 delay-100'>
          <div className='absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent blur-3xl -z-10 rounded-full opacity-60 animate-pulse-subtle'></div>

          <div className='text-center mb-16'>
            <Button
              asChild
              variant='ghost'
              className='mb-6 hover:bg-primary/10'
            >
              <Link href='/'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Back to Home
              </Link>
            </Button>
            <h1 className='text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent animate-slide-up'>
              Features & Capabilities
            </h1>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto mt-4'>
              Discover all the powerful features that make SecrecyNote the most
              secure platform for your sensitive information.
            </p>
          </div>
        </section>

        {/* Core Features Section */}
        <section className='mb-24 animate-in slide-in-from-bottom-4 duration-700 delay-200'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
              Core Security Features
            </h2>
            <p className='text-muted-foreground mt-3 max-w-2xl mx-auto text-lg'>
              Built from the ground up with privacy and security as our top
              priorities
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Feature Card 1 */}
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='rounded-xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg p-6 group-hover:border-primary/40 transition-colors duration-300 h-full flex flex-col'>
                <div className='h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors duration-300'>
                  <Lock className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  End-to-End Encryption
                </h3>
                <p className='text-muted-foreground flex-grow'>
                  Your notes are encrypted before they leave your device,
                  ensuring only intended recipients can read them.
                </p>
                <div className='mt-4 space-y-2'>
                  <div className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                    <span>AES-256 Encryption</span>
                  </div>
                  <div className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                    <span>Client-side encryption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='rounded-xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg p-6 group-hover:border-primary/40 transition-colors duration-300 h-full flex flex-col'>
                <div className='h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors duration-300'>
                  <Clock className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  Self-Destructing Notes
                </h3>
                <p className='text-muted-foreground flex-grow'>
                  Set notes to automatically delete after being viewed or after
                  a specific time period has elapsed.
                </p>
                <div className='mt-4 space-y-2'>
                  <div className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                    <span>One-time viewing</span>
                  </div>
                  <div className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                    <span>Custom expiration timers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-xl blur-sm -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-300'></div>
              <div className='rounded-xl border border-primary/20 shadow-lg overflow-hidden bg-card/50 backdrop-blur-lg p-6 group-hover:border-primary/40 transition-colors duration-300 h-full flex flex-col'>
                <div className='h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center mb-4 group-hover:bg-primary/25 transition-colors duration-300'>
                  <Shield className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>Zero Knowledge</h3>
                <p className='text-muted-foreground flex-grow'>
                  We cannot read your notes or access your encryption keys,
                  ensuring complete privacy.
                </p>
                <div className='mt-4 space-y-2'>
                  <div className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                    <span>No server-side decryption</span>
                  </div>
                  <div className='flex items-center text-sm'>
                    <CheckCircle className='h-4 w-4 mr-2 text-primary' />
                    <span>Private key management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Account Features Section */}
        <section className='mb-24 animate-in slide-in-from-bottom-4 duration-700 delay-300'>
          <div className='bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-sm border border-primary/10 rounded-2xl p-8 md:p-10 shadow-xl'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
                Enhanced Account Features
              </h2>
              <p className='text-muted-foreground mt-3 max-w-2xl mx-auto text-lg'>
                Create an account to unlock additional powerful features
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-10 lg:gap-16'>
              <div className='space-y-8'>
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
                      organization tools and tagging features
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 group'>
                  <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                    <RefreshCw className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                      Recurring Notes
                    </h4>
                    <p className='text-muted-foreground'>
                      Schedule recurring notes for regular communication with
                      consistent security settings
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 group'>
                  <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                    <ShieldCheck className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                      Advanced Security Options
                    </h4>
                    <p className='text-muted-foreground'>
                      Two-factor authentication, custom encryption settings,
                      password protection, and more
                    </p>
                  </div>
                </div>
              </div>

              <div className='space-y-8'>
                <div className='flex items-start gap-4 group'>
                  <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                    <Layers className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                      Templates & Formatting
                    </h4>
                    <p className='text-muted-foreground'>
                      Create and save templates for frequently used note types
                      with rich text formatting
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 group'>
                  <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                    <Search className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                      Advanced Search
                    </h4>
                    <p className='text-muted-foreground'>
                      Quickly find your secure notes with powerful search
                      capabilities across your entire library
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 group'>
                  <div className='h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center transition-colors group-hover:bg-primary/25 mt-1'>
                    <Settings className='h-5 w-5 text-primary' />
                  </div>
                  <div>
                    <h4 className='font-medium text-lg group-hover:text-primary transition-colors'>
                      Customization
                    </h4>
                    <p className='text-muted-foreground'>
                      Personalize your experience with custom themes, layout
                      options, and notification settings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-10 flex flex-wrap justify-center gap-4'>
              <Button
                asChild
                variant='gradient'
                className='font-medium h-11 px-6 transition-all duration-300 hover-lift'
              >
                <Link href='/auth?mode=signup'>
                  <UserPlus className='h-4 w-4 mr-2' />
                  Create Free Account
                </Link>
              </Button>
              <Button
                asChild
                variant='outline'
                className='border-primary/20 hover:bg-primary/5 h-11 px-6 hover-lift'
              >
                <Link href='/'>
                  <ArrowLeft className='h-4 w-4 mr-2' />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Technical Features Section */}
        <section className='mb-16 animate-in slide-in-from-bottom-4 duration-700 delay-400'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent'>
              Technical Excellence
            </h2>
            <p className='text-muted-foreground mt-3 max-w-2xl mx-auto text-lg'>
              Built with cutting-edge technology to ensure optimal security and
              performance
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            <div className='flex flex-col items-center text-center p-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-lg hover:border-primary/40 transition-colors duration-300'>
              <div className='h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center mb-4'>
                <Zap className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>High Performance</h3>
              <p className='text-muted-foreground'>
                Optimized for speed and reliability, with a responsive design
                that works on any device
              </p>
            </div>

            <div className='flex flex-col items-center text-center p-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-lg hover:border-primary/40 transition-colors duration-300'>
              <div className='h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center mb-4'>
                <Key className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>
                Modern Cryptography
              </h3>
              <p className='text-muted-foreground'>
                Utilizing the latest encryption standards and security best
                practices
              </p>
            </div>

            <div className='flex flex-col items-center text-center p-6 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-lg hover:border-primary/40 transition-colors duration-300'>
              <div className='h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center mb-4'>
                <Shield className='h-6 w-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold mb-2'>No Tracking</h3>
              <p className='text-muted-foreground'>
                We don't track your activity or collect unnecessary data about
                your usage
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='mt-16 mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-500'>
          <div className='relative rounded-2xl overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 -z-10'></div>
            <div className='p-8 md:p-10 text-center'>
              <h2 className='text-2xl md:text-3xl font-bold mb-4'>
                Ready to secure your sensitive information?
              </h2>
              <p className='text-muted-foreground mb-8 max-w-2xl mx-auto'>
                Start creating encrypted notes today - no account required to
                get started!
              </p>
              <div className='flex flex-wrap justify-center gap-4'>
                <Button
                  asChild
                  variant='gradient'
                  className='font-medium h-11 px-6 transition-all duration-300 hover-lift'
                  size='lg'
                >
                  <Link href='/create?guest=true'>
                    <PlusCircle className='h-4 w-4 mr-2' />
                    Create Secure Note
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  className='border-primary/20 hover:bg-primary/5 h-11 px-6 hover-lift'
                  size='lg'
                >
                  <Link href='/view'>
                    <Eye className='h-4 w-4 mr-2' />
                    View Secure Note
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
