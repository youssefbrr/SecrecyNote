"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Copy, Check, Eye, Clock, Key } from "lucide-react"

export default function CreateNote() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [expirationType, setExpirationType] = useState("view")
  const [expiration, setExpiration] = useState("1h")
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [noteLink, setNoteLink] = useState("")
  const [copied, setCopied] = useState(false)

  const handleCreateNote = async () => {
    if (!note.trim()) return

    setIsCreating(true)

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
          password: usePassword ? password : null,
        }),
      })

      if (!response.ok) throw new Error("Failed to create note")

      const createdNote = await response.json()
      setNoteLink(`${window.location.origin}/view/${createdNote.id}`)
    } catch (error) {
      console.error("Error creating note:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(noteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const createNewNote = () => {
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Create a Secure Note</CardTitle>
            <CardDescription>Your note will be encrypted and only accessible via the generated link.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!noteLink ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your note"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Your Note</Label>
                  <Textarea
                    id="note"
                    placeholder="Type your secure message here..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Expiration Settings</Label>
                  <RadioGroup value={expirationType} onValueChange={setExpirationType} className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="view" id="view" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="view" className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          <span>Expire after viewing</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          The note will be deleted immediately after being viewed.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="time" id="time" className="mt-1" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="time" className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Expire after time period</span>
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          The note will expire after the selected time period.
                        </p>
                        {expirationType === "time" && (
                          <Select value={expiration} onValueChange={setExpiration} className="mt-2">
                            <SelectTrigger id="expiration">
                              <SelectValue placeholder="Select expiration time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5m">5 minutes</SelectItem>
                              <SelectItem value="1h">1 hour</SelectItem>
                              <SelectItem value="1d">1 day</SelectItem>
                              <SelectItem value="7d">7 days</SelectItem>
                              <SelectItem value="30d">30 days</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="usePassword"
                      checked={usePassword}
                      onCheckedChange={(checked) => setUsePassword(checked === true)}
                    />
                    <Label htmlFor="usePassword" className="flex items-center gap-1.5">
                      <Key className="h-3.5 w-3.5" />
                      <span>Password protect this note</span>
                    </Label>
                  </div>

                  {usePassword && (
                    <div className="space-y-3 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter a secure password"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-medium">Secure Note Link</p>
                  <p className="mt-2 break-all text-xs text-muted-foreground">{noteLink}</p>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Share this link with your recipient.</p>
                  <p className="mt-2">
                    {expirationType === "view"
                      ? "The note will be deleted after it's viewed."
                      : `The note will expire after ${
                          expiration === "5m"
                            ? "5 minutes"
                            : expiration === "1h"
                              ? "1 hour"
                              : expiration === "1d"
                                ? "1 day"
                                : expiration === "7d"
                                  ? "7 days"
                                  : "30 days"
                        }.`}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            {!noteLink ? (
              <Button
                className="w-full"
                onClick={handleCreateNote}
                disabled={!note.trim() || isCreating || (usePassword && !password)}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Secure Note"
                )}
              </Button>
            ) : (
              <>
                <Button className="w-full" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={createNewNote}>
                  Back to Dashboard
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

