import { createContext } from "react";

import type { CreatePlaylistData, Favorite, Playlist } from "../types/library";

export type LibraryContextValue = {
  favorites: Favorite[];
  playlists: Playlist[];
  isLoading: boolean;
  errorMessage: string;

  isFavorite: (songId: number) => boolean;
  toggleFavorite: (songId: number) => Promise<void>;

  createNewPlaylist: (data: CreatePlaylistData) => Promise<void>;

  addSong: (playlistId: number, songId: number) => Promise<void>;

  removeSong: (playlistId: number, songId: number) => Promise<void>;

  removePlaylist: (playlistId: number) => Promise<void>;

  refreshPlaylists: () => Promise<void>;
};

export const LibraryContext = createContext<LibraryContextValue | undefined>(
  undefined,
);
