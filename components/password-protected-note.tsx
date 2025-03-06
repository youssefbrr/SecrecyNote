"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, AlertTriangle } from "lucide-react"

export function PasswordProtectedNote({ note }: { note: any }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (!password.trim()) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to decrypt note")
      }

      setDecryptedContent(data.content)
      if (note.expirationType === "view") {
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message || "Incorrect password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (decryptedContent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
        <div className="w-full max-w-md space-y-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Secure Note</CardTitle>
              <CardDescription>This note has been decrypted for your viewing.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                  <ShieldCheck className="h-4 w-4" />
                  <span>
                    {note.expirationType === "view"
                      ? "This note has been decrypted and will be deleted after viewing"
                      : "This note has been decrypted successfully"}
                  </span>
                </div>
                <div className="rounded-md bg-muted p-4">
                  <p className="whitespace-pre-wrap">{decryptedContent}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/">Back to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Password Protected Note</CardTitle>
            <CardDescription>This note is protected. Please enter the password to view its contents.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <Lock className="h-8 w-8 text-primary" />
                <p className="mt-2 font-medium">This note is password protected</p>
                <p className="mt-1 text-sm text-muted-foreground">Enter the password to view the contents.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the note password"
                      disabled={isLoading}
                      className={`pr-10 ${error ? "border-destructive" : ""}`}
                    />
                    {isLoading && (
                      <div className="absolute inset-y-0 right-0 flex items-center justify-center pr-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="rounded-md bg-destructive/15 p-3">
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <p>{error}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Decrypting..." : "Decrypt Note"}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

