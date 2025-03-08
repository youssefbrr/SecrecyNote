"use client";

import { createContext, useContext, useState } from "react";

type NoteRefreshContextType = {
  refreshNotes: () => void;
  refreshFlag: number;
};

const NoteRefreshContext = createContext<NoteRefreshContextType | undefined>(
  undefined
);

export function NoteRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const refreshNotes = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <NoteRefreshContext.Provider value={{ refreshNotes, refreshFlag }}>
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
