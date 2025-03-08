"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [expirationType, setExpirationType] = useState("view");
  const [expiration, setExpiration] = useState("1 hour");
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [noteLink, setNoteLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);

  const handleExpirationTypeChange = (type: string) => {
    setExpirationType(type);
    if (type === "time" && !expiration) {
      setExpiration("1 hour");
    }
  };

  const handleCreateNote = async () => {
    if (!note.trim()) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim() || "Untitled Note",
          content: note,
          expirationType,
          expiration: expirationType === "time" ? expiration : null,
          password: passwordProtected ? password : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create note");

      const createdNote = await response.json();
      setNoteLink(`${window.location.origin}/view/${createdNote.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(noteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const createNewNote = () => {
    router.push("/");
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-500'>
      <div className='w-full max-w-md'>
        <Card className='border-2 shadow-lg overflow-hidden'>
          <div className='absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80'></div>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-2xl font-bold'>
              Create a Secure Note
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              Your note will be encrypted and only accessible via the generated
              link.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            {!noteLink ? (
              <>
                <div className='space-y-2 animate-in slide-in-from-left duration-300'>
                  <Label htmlFor='title' className='text-sm font-medium'>
                    Title (optional)
                  </Label>
                  <Input
                    id='title'
                    placeholder='Enter a title for your note'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='border-muted-foreground/20 focus:border-primary/50'
                  />
                </div>

                <div
                  className='space-y-2 animate-in slide-in-from-left duration-300'
                  style={{ animationDelay: "75ms" }}
                >
                  <Label htmlFor='note' className='text-sm font-medium'>
                    Your Note
                  </Label>
                  <Textarea
                    id='note'
                    placeholder='Type your secure message here...'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className='min-h-[150px] resize-y border-muted-foreground/20 focus:border-primary/50'
                  />
                </div>

                <div
                  className='space-y-4 pt-2 animate-in slide-in-from-left duration-300'
                  style={{ animationDelay: "150ms" }}
                >
                  <div className='bg-muted/50 rounded-lg p-3 space-y-3'>
                    <Label className='text-sm font-medium'>
                      Expiration Settings
                    </Label>
                    <div className='grid grid-cols-2 gap-2'>
                      <div
                        className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-all ${
                          expirationType === "view"
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/20 hover:border-muted-foreground/40"
                        }`}
                        onClick={() => handleExpirationTypeChange("view")}
                      >
                        <input
                          type='radio'
                          name='expirationType'
                          checked={expirationType === "view"}
                          onChange={() => handleExpirationTypeChange("view")}
                          className='accent-primary'
                        />
                        <p className='text-sm'>After viewing</p>
                      </div>
                      <div
                        className={`flex items-center gap-2 rounded-md border p-3 cursor-pointer transition-all ${
                          expirationType === "time"
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/20 hover:border-muted-foreground/40"
                        }`}
                        onClick={() => handleExpirationTypeChange("time")}
                      >
                        <input
                          type='radio'
                          name='expirationType'
                          checked={expirationType === "time"}
                          onChange={() => handleExpirationTypeChange("time")}
                          className='accent-primary'
                        />
                        <p className='text-sm'>After time</p>
                      </div>
                    </div>

                    {expirationType === "time" && (
                      <Select
                        value={expiration}
                        onValueChange={setExpiration}
                        defaultValue='1 hour'
                      >
                        <SelectTrigger
                          id='expiration'
                          className='bg-background border-muted-foreground/20'
                        >
                          <SelectValue placeholder='Select expiration time'>
                            {expiration}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='5 minutes'>5 minutes</SelectItem>
                          <SelectItem value='1 hour'>1 hour</SelectItem>
                          <SelectItem value='1 day'>1 day</SelectItem>
                          <SelectItem value='7 days'>7 days</SelectItem>
                          <SelectItem value='30 days'>30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className='bg-muted/50 rounded-lg p-3 space-y-3'>
                    <div className='flex items-center justify-between'>
                      <Label
                        htmlFor='password-protected'
                        className='text-sm font-medium cursor-pointer'
                      >
                        Password Protected
                      </Label>
                      <Switch
                        id='password-protected'
                        checked={passwordProtected}
                        onCheckedChange={setPasswordProtected}
                      />
                    </div>

                    {passwordProtected && (
                      <div className='pt-2 animate-in slide-in-from-top-2 duration-200'>
                        <Input
                          id='password'
                          type='password'
                          placeholder='Enter a password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className='border-muted-foreground/20 focus:border-primary/50 mt-2'
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCreateNote}
                  disabled={
                    !note || (passwordProtected && !password) || isCreating
                  }
                  className='w-full mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300'
                >
                  {isCreating ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Creating...
                    </span>
                  ) : (
                    "Create Secure Note"
                  )}
                </Button>
              </>
            ) : (
              <div className='space-y-6 animate-in fade-in-50 duration-300'>
                <div className='rounded-md bg-primary/10 p-4 border border-primary/30'>
                  <h3 className='font-medium mb-2 text-primary'>
                    Note Created Successfully!
                  </h3>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Share this link with anyone you want to access the note:
                  </p>
                  <div className='flex items-center gap-2 bg-background rounded-md p-2 border border-border'>
                    <Input
                      value={noteLink}
                      readOnly
                      className='border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                    />
                    <Button
                      onClick={copyToClipboard}
                      size='sm'
                      variant='outline'
                      className='shrink-0 h-8 border-primary/20 hover:bg-primary/5'
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className='text-center space-y-2'>
                  <p className='text-sm text-muted-foreground'>
                    {expirationType === "view"
                      ? "The note will be deleted after it's viewed."
                      : `The note will expire after ${expiration}.`}
                  </p>
                  <Button
                    onClick={createNewNote}
                    variant='outline'
                    className='mt-2 w-full border-primary/20 hover:bg-primary/5 transition-all duration-300'
                  >
                    Create Another Note
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
