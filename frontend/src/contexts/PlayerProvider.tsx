import { useState, type ReactNode } from "react";

import { PlayerContext } from "./player-context";

import type { PlayerSong } from "../types/player";

type PlayerProviderProps = {
  children: ReactNode;
};

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentSong, setCurrentSong] = useState<PlayerSong | null>(null);

  const [playbackId, setPlaybackId] = useState(0);

  function playSong(song: PlayerSong) {
    setCurrentSong(song);

    setPlaybackId((current) => current + 1);
  }

  function clearSong() {
    setCurrentSong(null);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        playbackId,
        playSong,
        clearSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
