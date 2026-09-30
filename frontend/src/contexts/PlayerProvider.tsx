import { useState, type ReactNode } from "react";

import { PlayerContext } from "./player-context";
import type { PlayerSong } from "../types/player";

type PlayerProviderProps = {
  children: ReactNode;
};

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentSong, setCurrentSong] = useState<PlayerSong | null>(null);

  function playSong(song: PlayerSong) {
    setCurrentSong(song);
  }

  function clearSong() {
    setCurrentSong(null);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        playSong,
        clearSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
