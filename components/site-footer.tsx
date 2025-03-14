"use client";

import {
  CheckCircle,
  ExternalLink,
  Eye,
  FileText,
  Lock,
  PlusCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className='w-full border-t bg-background/95 backdrop-blur-sm py-8 px-4 md:px-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-8'>
          <div className='col-span-2 md:col-span-1'>
            <div className='flex items-center gap-2 mb-4 group hover-lift-sm'>
              <div className='relative'>
                <div className='absolute -inset-1 rounded-full blur-sm bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center relative transition-colors duration-300 group-hover:bg-primary/20'>
                  <Lock className='h-5 w-5 text-primary animate-pulse-subtle' />
                </div>
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent transition-all duration-300'>
                SecrecyNote
              </span>
            </div>
            <p className='text-sm text-muted-foreground max-w-xs'>
              Create encrypted, self-destructing notes with end-to-end security
              and zero knowledge encryption.
            </p>
            <div className='flex gap-4 mt-4'>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition-colors hover-lift-sm'
                aria-label='Twitter'
              >
                <svg
                  className='h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' />
                </svg>
              </a>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-muted-foreground hover:text-primary transition-colors hover-lift-sm'
                aria-label='GitHub'
              >
                <svg
                  className='h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4' />
                  <path d='M9 18c-4.51 2-5-2-7-2' />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className='font-semibold mb-3 text-sm px-2 py-1 bg-primary/10 text-primary rounded-full inline-block'>
              Main
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <Lock className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/features'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <CheckCircle className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>Features</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/auth'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <User className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>Login / Register</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-3 text-sm px-2 py-1 bg-primary/10 text-primary rounded-full inline-block'>
              Actions
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/create'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <PlusCircle className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>Create Note</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/view'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <Eye className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>View Note</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/notes'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <FileText className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>My Notes</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-3 text-sm px-2 py-1 bg-primary/10 text-primary rounded-full inline-block'>
              Security
            </h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/account'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <User className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link
                  href='/features#security'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <ShieldCheck className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>Security Features</span>
                </Link>
              </li>
              <li>
                <a
                  href='https://github.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group'
                >
                  <div className='h-6 w-6 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/10 transition-colors'>
                    <ExternalLink className='h-3.5 w-3.5 text-primary' />
                  </div>
                  <span>GitHub Repo</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 -z-10'></div>
          <div className='pt-6 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4 relative'>
            <div className='text-xs text-muted-foreground'>
              © {new Date().getFullYear()} SecrecyNote. All rights reserved.
            </div>
            <div className='flex flex-wrap items-center justify-center gap-4'>
              <p className='text-xs text-muted-foreground'>
                Made with encryption and privacy in mind.
              </p>
              <div className='h-1 w-1 rounded-full bg-primary/20'></div>
              <Link
                href='/features'
                className='text-xs text-muted-foreground hover:text-primary transition-colors'
              >
                Learn about our security
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
