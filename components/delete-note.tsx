"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function DeleteNote({ id }: { id: string }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete note")
      router.refresh()
    } catch (error) {
      console.error("Error deleting note:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}

