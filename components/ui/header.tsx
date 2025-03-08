import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export function Header() {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 '>
      <div className='container flex h-24 items-center'>
        <div className='mr-4 flex'>
          <Link href='/' className='mr-6 flex items-center space-x-2'>
            <div>
              <h1 className='text-4xl font-bold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent'>
                SecrecyNote
              </h1>
              <p className='mt-1 text-muted-foreground text-sm'>
                Manage your private, encrypted notes
              </p>
            </div>
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'></div>
          <nav className='flex items-center space-x-6'>
            <div className='hidden md:flex space-x-4 mr-2'>
              <Link
                href='/create'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                Create
              </Link>
              <Link
                href='/'
                className='text-sm font-medium hover:text-primary transition-colors'
              >
                My Notes
              </Link>
            </div>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
