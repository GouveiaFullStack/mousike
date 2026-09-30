import { useEffect, useState, type ReactNode } from "react";

import { LibraryContext } from "./library-context";
import { useAuth } from "../hooks/useAuth";

import {
  addFavorite,
  addSongToPlaylist,
  createPlaylist,
  deletePlaylist,
  getFavorites,
  getUserPlaylists,
  removeFavorite,
  removeSongFromPlaylist,
} from "../services/library.service";

import type { CreatePlaylistData, Favorite, Playlist } from "../types/library";

type LibraryProviderProps = {
  children: ReactNode;
};

export function LibraryProvider({ children }: LibraryProviderProps) {
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;

    async function loadLibrary() {
      try {
        const [favoriteList, playlistList] = await Promise.all([
          getFavorites(userId!),
          getUserPlaylists(userId!),
        ]);

        if (!cancelled) {
          setFavorites(favoriteList);
          setPlaylists(playlistList);
          setErrorMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar sua biblioteca.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadLibrary();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  function isFavorite(songId: number) {
    return favorites.some((favorite) => favorite.songId === songId);
  }

  async function toggleFavorite(songId: number) {
    if (!userId) {
      return;
    }

    const existingFavorite = favorites.find(
      (favorite) => favorite.songId === songId,
    );

    if (existingFavorite) {
      await removeFavorite(userId, songId);

      setFavorites((current) =>
        current.filter((favorite) => favorite.songId !== songId),
      );

      return;
    }

    const favorite = await addFavorite(userId, songId);

    setFavorites((current) => [favorite, ...current]);
  }

  async function refreshPlaylists() {
    if (!userId) {
      return;
    }

    const playlistList = await getUserPlaylists(userId);

    setPlaylists(playlistList);
  }

  async function createNewPlaylist(data: CreatePlaylistData) {
    const playlist = await createPlaylist(data);

    setPlaylists((current) => [playlist, ...current]);
  }

  async function addSong(playlistId: number, songId: number) {
    await addSongToPlaylist(playlistId, songId);

    await refreshPlaylists();
  }

  async function removeSong(playlistId: number, songId: number) {
    await removeSongFromPlaylist(playlistId, songId);

    await refreshPlaylists();
  }

  async function removePlaylist(playlistId: number) {
    await deletePlaylist(playlistId);

    setPlaylists((current) =>
      current.filter((playlist) => playlist.id !== playlistId),
    );
  }

  return (
    <LibraryContext.Provider
      value={{
        favorites,
        playlists,
        isLoading,
        errorMessage,
        isFavorite,
        toggleFavorite,
        createNewPlaylist,
        addSong,
        removeSong,
        removePlaylist,
        refreshPlaylists,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}
