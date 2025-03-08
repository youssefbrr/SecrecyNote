"use client";

import { useNoteRefresh } from "@/components/providers/note-refresh-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function NotesRefreshHandler() {
  const { shouldRefresh, setShouldRefresh } = useNoteRefresh();
  const router = useRouter();

  useEffect(() => {
    if (shouldRefresh) {
      // Use router.refresh() to trigger a server component refresh
      router.refresh();

      // Reset the refresh flag
      setShouldRefresh(false);
    }
  }, [shouldRefresh, setShouldRefresh, router]);

  // This component doesn't render anything visible
  return null;
}
