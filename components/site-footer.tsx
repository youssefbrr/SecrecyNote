"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className='w-full border-t bg-background/95 backdrop-blur-sm py-8 px-4 md:px-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 mb-8'>
          <div className='col-span-2 md:col-span-1'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                <Lock className='h-4 w-4 text-primary' />
              </div>
              <span className='font-medium text-lg'>SecrecyNote</span>
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
                className='text-muted-foreground hover:text-primary transition-colors'
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
                className='text-muted-foreground hover:text-primary transition-colors'
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
            <h3 className='font-semibold mb-3 text-sm'>Product</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/features'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href='/security'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href='/pricing'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href='/faq'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-3 text-sm'>Resources</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/help'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href='/guides'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href='/blog'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href='/status'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='font-semibold mb-3 text-sm'>Company</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  href='/about'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href='/privacy'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href='/terms'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href='/contact'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='pt-6 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} SecrecyNote. All rights reserved.
          </div>
          <div className='flex items-center gap-4'>
            <Link
              href='/privacy'
              className='text-xs text-muted-foreground hover:text-primary transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='/terms'
              className='text-xs text-muted-foreground hover:text-primary transition-colors'
            >
              Terms of Service
            </Link>
            <Link
              href='/cookies'
              className='text-xs text-muted-foreground hover:text-primary transition-colors'
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
