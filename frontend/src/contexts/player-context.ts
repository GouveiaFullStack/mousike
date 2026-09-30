import { createContext } from "react";

import type { PlayerSong } from "../types/player";

export type PlayerContextValue = {
  currentSong: PlayerSong | null;
  playbackId: number;

  playSong: (song: PlayerSong) => void;
  clearSong: () => void;
};

export const PlayerContext = createContext<PlayerContextValue | undefined>(
  undefined,
);
