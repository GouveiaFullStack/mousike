import { useContext } from "react";

import { LibraryContext } from "../contexts/library-context";

export function useLibrary() {
  const context = useContext(LibraryContext);

  if (!context) {
    throw new Error("useLibrary deve ser usado dentro de LibraryProvider");
  }

  return context;
}
