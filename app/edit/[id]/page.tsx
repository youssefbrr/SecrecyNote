"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Eye, Key, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditNote() {
  const router = useRouter();
  const params = useParams();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [expirationType, setExpirationType] = useState("view");
  const [expiration, setExpiration] = useState("1h");
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [includePasswordInLink, setIncludePasswordInLink] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadNote = () => {
      const storedNotes = JSON.parse(
        localStorage.getItem("secureNotes") || "[]"
      );
      const noteToEdit = storedNotes.find((n: any) => n.id === params.id);

      if (noteToEdit) {
        setTitle(noteToEdit.title || "");
        setNote(atob(noteToEdit.content)); // Decode the content
        setExpirationType(noteToEdit.expirationType);
        setExpiration(noteToEdit.expiration || "1h");
        setUsePassword(noteToEdit.passwordProtected);
        if (noteToEdit.passwordProtected) {
          setPassword(atob(noteToEdit.password)); // Decode the password
        }
      } else {
        router.push("/");
      }

      setIsLoading(false);
    };

    loadNote();
  }, [params.id, router]);

  const handleSaveNote = async () => {
    if (!note.trim()) return;

    setIsSaving(true);

    try {
      const storedNotes = JSON.parse(
        localStorage.getItem("secureNotes") || "[]"
      );
      const updatedNotes = storedNotes.map((n: any) => {
        if (n.id === params.id) {
          return {
            ...n,
            title: title.trim() || "Untitled Note",
            content: btoa(note), // Encode the content
            expirationType,
            expiration: expirationType === "time" ? expiration : null,
            passwordProtected: usePassword && password ? true : false,
            password: usePassword && password ? btoa(password) : null, // Encode the password
            updated: new Date().toISOString(),
          };
        }
        return n;
      });

      localStorage.setItem("secureNotes", JSON.stringify(updatedNotes));
      router.push("/");
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 md:p-24'>
      <div className='w-full max-w-md'>
        <Card>
          <CardHeader>
            <CardTitle>Edit Secure Note</CardTitle>
            <CardDescription>Update your encrypted note.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title (optional)</Label>
              <Input
                id='title'
                placeholder='Enter a title for your note'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='note'>Your Note</Label>
              <Textarea
                id='note'
                placeholder='Type your secure message here...'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className='min-h-[200px]'
              />
            </div>

            <div className='space-y-3'>
              <Label>Expiration Settings</Label>
              <RadioGroup
                value={expirationType}
                onValueChange={setExpirationType}
                className='space-y-2'
              >
                <div className='flex items-start space-x-2'>
                  <RadioGroupItem value='view' id='view' className='mt-1' />
                  <div className='grid gap-1.5 leading-none'>
                    <Label htmlFor='view' className='flex items-center gap-1.5'>
                      <Eye className='h-3.5 w-3.5' />
                      <span>Expire after viewing</span>
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      The note will be deleted immediately after being viewed.
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-2'>
                  <RadioGroupItem value='time' id='time' className='mt-1' />
                  <div className='grid gap-1.5 leading-none'>
                    <Label htmlFor='time' className='flex items-center gap-1.5'>
                      <Clock className='h-3.5 w-3.5' />
                      <span>Expire after time period</span>
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      The note will expire after the selected time period.
                    </p>
                    {expirationType === "time" && (
                      <Select
                        value={expiration}
                        onValueChange={setExpiration}
                        className='mt-2'
                      >
                        <SelectTrigger id='expiration'>
                          <SelectValue placeholder='Select expiration time' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='5m'>5 minutes</SelectItem>
                          <SelectItem value='1h'>1 hour</SelectItem>
                          <SelectItem value='1d'>1 day</SelectItem>
                          <SelectItem value='7d'>7 days</SelectItem>
                          <SelectItem value='30d'>30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='usePassword'
                  checked={usePassword}
                  onCheckedChange={(checked) =>
                    setUsePassword(checked === true)
                  }
                />
                <Label
                  htmlFor='usePassword'
                  className='flex items-center gap-1.5'
                >
                  <Key className='h-3.5 w-3.5' />
                  <span>Password protect this note</span>
                </Label>
              </div>

              {usePassword && (
                <div className='space-y-3 pl-6'>
                  <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                      id='password'
                      type='password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder='Enter a secure password'
                    />
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Checkbox
                      id='includePassword'
                      checked={includePasswordInLink}
                      onCheckedChange={(checked) =>
                        setIncludePasswordInLink(checked === true)
                      }
                    />
                    <Label htmlFor='includePassword' className='text-sm'>
                      Include password in link (no separate password needed)
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button variant='outline' onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveNote}
              disabled={!note.trim() || isSaving || (usePassword && !password)}
            >
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
