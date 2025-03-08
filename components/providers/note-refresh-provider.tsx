"use client";

import { createContext, useContext, useState } from "react";

type NoteRefreshContextType = {
  shouldRefresh: boolean;
  setShouldRefresh: (value: boolean) => void;
  refreshNotes: () => void;
};

const NoteRefreshContext = createContext<NoteRefreshContextType | undefined>(
  undefined
);

export function NoteRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const refreshNotes = () => {
    setShouldRefresh(true);
  };

  return (
    <NoteRefreshContext.Provider
      value={{ shouldRefresh, setShouldRefresh, refreshNotes }}
    >
      {children}
    </NoteRefreshContext.Provider>
  );
}

export function useNoteRefresh() {
  const context = useContext(NoteRefreshContext);
  if (context === undefined) {
    throw new Error("useNoteRefresh must be used within a NoteRefreshProvider");
  }
  return context;
}
