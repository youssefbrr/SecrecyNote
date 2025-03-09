"use client";

import { AuthForm } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthModal({
  trigger,
  defaultOpen = false,
  onOpenChange,
}: AuthModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className='bg-primary/90 hover:bg-primary flex items-center gap-2'>
            <User className='h-4 w-4' />
            <span>Sign In</span>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='sm:max-w-md md:max-w-lg'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>
            SecrecyNote Account
          </DialogTitle>
          <DialogDescription>
            Sign in or create an account to unlock all SecrecyNote features.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <AuthForm onSuccess={() => handleOpenChange(false)} />
        </div>

        <DialogFooter className='flex flex-col gap-2 sm:gap-0'>
          <p className='text-center text-sm text-muted-foreground'>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
