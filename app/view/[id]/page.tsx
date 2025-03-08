import { PasswordProtectedNote } from "@/components/password-protected-note";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { decrypt } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getNote(id: string) {
  const note = await prisma.note.findUnique({ where: { id } });

  if (!note) return null;

  // Check if the note has expired
  if (note.expirationType === "time" && note.expiration) {
    const expirationDate = new Date(note.created);
    const [value, unit] = note.expiration.split("");
    const amount = Number.parseInt(value);

    switch (unit) {
      case "m":
        expirationDate.setMinutes(expirationDate.getMinutes() + amount);
        break;
      case "h":
        expirationDate.setHours(expirationDate.getHours() + amount);
        break;
      case "d":
        expirationDate.setDate(expirationDate.getDate() + amount);
        break;
    }

    if (new Date() > expirationDate) {
      await prisma.note.delete({ where: { id } });
      return "expired";
    }
  }

  // If it's a "view once" note, delete it after retrieving
  if (note.expirationType === "view") {
    await prisma.note.delete({ where: { id } });
  }

  return note;
}

export default async function ViewNote({ params }: { params: { id: string } }) {
  const note = await getNote(params.id);

  if (!note) notFound();

  if (note === "expired") {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-4 md:p-24'>
        <div className='w-full max-w-md'>
          <Card>
            <CardHeader>
              <CardTitle>Note Expired</CardTitle>
              <CardDescription>
                This note has expired and is no longer available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <AlertTriangle className='h-8 w-8 text-destructive' />
                <p className='mt-4 font-medium text-destructive'>
                  This note has expired.
                </p>
                <p className='mt-2 text-sm text-muted-foreground'>
                  For security reasons, notes are automatically deleted after
                  their expiration time.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className='w-full'>
                <Link href='/'>Back to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  if (note.passwordProtected) {
    return <PasswordProtectedNote note={note} />;
  }

  const decryptedContent = await decrypt(note.content);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 md:p-24'>
      <div className='w-full max-w-md'>
        <Card>
          <CardHeader>
            <CardTitle>SecrecyNote</CardTitle>
            <CardDescription>
              This note has been decrypted for your viewing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-500'>
                <ShieldCheck className='h-4 w-4' />
                <span>
                  {note.expirationType === "view"
                    ? "This note has been decrypted and will be deleted after viewing"
                    : "This note has been decrypted successfully"}
                </span>
              </div>
              <div className='rounded-md bg-muted p-4'>
                <p className='whitespace-pre-wrap'>{decryptedContent}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className='w-full'>
              <Link href='/'>Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
