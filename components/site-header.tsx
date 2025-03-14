"use client";

import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  FileText,
  Lock,
  LogOut,
  Moon,
  PlusCircle,
  Sun,
  User,
  UserCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [showAuthOptions, setShowAuthOptions] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // This useEffect ensures hydration mismatch is avoided
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowAuthOptions(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "UN";

    if (user.name) {
      const nameParts = user.name.split(" ");
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }

    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className='w-full py-4 px-4 md:px-8 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 animate-in fade-in-50 duration-500 shadow-sm'>
      <div className='max-w-6xl mx-auto flex justify-between items-center'>
        <Link href='/' className='flex items-center gap-2 group hover-lift-sm'>
          <div className='relative'>
            <div className='absolute -inset-1 rounded-full blur-sm bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <div className='h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center relative transition-colors duration-300 group-hover:bg-primary/20'>
              <Lock className='h-5 w-5 text-primary animate-pulse-subtle' />
            </div>
          </div>
          <h1 className='text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent transition-all duration-300'>
            SecrecyNote
          </h1>
        </Link>

        <div className='flex items-center gap-3'>
          {isAuthenticated && user && mounted ? (
            <div className='flex items-center gap-3'>
              <div className='hidden md:flex items-center'>
                <Button
                  asChild
                  variant='default'
                  size='sm'
                  className='bg-primary/90 hover:bg-primary border border-primary/20 mr-2 hover-lift-sm'
                >
                  <Link href='/notes'>
                    <FileText className='h-4 w-4 mr-1.5' />
                    <span>My Notes</span>
                  </Link>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='relative h-9 w-9 rounded-full hover:bg-primary/10 transition-colors duration-300'
                    size='icon'
                  >
                    <Avatar className='h-9 w-9 border border-border/40 transition-all duration-300 hover:border-primary/50'>
                      <AvatarFallback className='bg-primary/10 text-primary font-medium'>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className='w-56 animate-scale border border-primary/20'
                  align='end'
                  forceMount
                >
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p className='text-sm font-medium leading-none'>
                        {user.name || "User"}
                      </p>
                      <p className='text-xs text-muted-foreground leading-none'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href='/notes'
                        className='cursor-pointer w-full flex items-center transition-colors hover:bg-primary/5'
                      >
                        <FileText className='mr-2 h-4 w-4' />
                        <span>My Notes</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href='/features'
                        className='cursor-pointer w-full flex items-center transition-colors hover:bg-primary/5'
                      >
                        <CheckCircle className='mr-2 h-4 w-4' />
                        <span>Features</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link
                        href='/account'
                        className='cursor-pointer w-full flex items-center transition-colors hover:bg-primary/5'
                      >
                        <UserCircle className='mr-2 h-4 w-4' />
                        <span>Account</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                      }
                      className='cursor-pointer transition-colors hover:bg-primary/5'
                    >
                      {theme === "dark" ? (
                        <>
                          <Sun className='mr-2 h-4 w-4' />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className='mr-2 h-4 w-4' />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className='cursor-pointer text-destructive focus:text-destructive transition-colors'
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Button
                asChild
                variant='ghost'
                size='sm'
                className='hover:bg-primary/5 hover-lift-sm'
              >
                <Link href='/features'>
                  <CheckCircle className='h-4 w-4 mr-1.5' />
                  <span>Features</span>
                </Link>
              </Button>
              <AuthModal
                trigger={
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-primary/20 hover:bg-primary/5 hover-lift-sm'
                  >
                    <User className='h-4 w-4 mr-1.5' />
                    <span>Login</span>
                  </Button>
                }
                onOpenChange={setShowAuthModal}
              />
              <Button
                asChild
                variant='default'
                size='sm'
                className='bg-primary/90 hover:bg-primary border border-primary/20 hover-lift-sm'
              >
                <Link href='/create?guest=true'>
                  <PlusCircle className='h-4 w-4 mr-1.5' />
                  <span>Create Note</span>
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
