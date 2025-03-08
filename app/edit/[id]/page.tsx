"use client";

import { useNoteRefresh } from "@/components/providers/note-refresh-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditNote({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { refreshNotes } = useNoteRefresh();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch note");

        const data = await response.json();
        setTitle(data.title || "");
        setContent(data.content || "");
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load note"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [params.id]);

  const handleSave = async () => {
    if (!content.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/notes/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content,
        }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      refreshNotes();
      router.push("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save note");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <div className='flex justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardContent className='pt-6'>
            <Alert variant='destructive'>
              <AlertTriangle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/")}
              className='mt-4 w-full'
              variant='outline'
            >
              Back to Notes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-4 md:p-12 animate-in fade-in duration-500'>
      <div className='w-full max-w-2xl'>
        <Card className='border-2 shadow-lg'>
          <CardHeader>
            <CardTitle>Edit Note</CardTitle>
            <CardDescription>
              Make changes to your note. The note's expiration settings will
              remain unchanged.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Title (optional)</Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter a title for your note'
                className='border-muted-foreground/20 focus:border-primary/50'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='content'>Content</Label>
              <Textarea
                id='content'
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='Type your note content here...'
                className='min-h-[300px] resize-y border-muted-foreground/20 focus:border-primary/50'
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end space-x-2'>
            <Button
              variant='outline'
              onClick={() => router.push("/")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!content.trim() || saving}
              className='bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
            >
              {saving ? (
                <span className='flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Saving...
                </span>
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
