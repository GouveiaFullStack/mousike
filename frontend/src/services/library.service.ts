import { apiUrl, getAuthHeaders, getOptionalAuthHeaders } from "./api";

import type { CreatePlaylistData, Favorite, Playlist } from "../types/library";

async function getErrorMessage(response: Response, fallback: string) {
  const error = (await response.json()) as {
    message?: string;
  };

  return error.message ?? fallback;
}

export async function getFavorites(userId: number): Promise<Favorite[]> {
  const response = await fetch(`${apiUrl}/users/${userId}/favorites`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar os favoritos.",
      ),
    );
  }

  return response.json() as Promise<Favorite[]>;
}

export async function addFavorite(
  userId: number,
  songId: number,
): Promise<Favorite> {
  const response = await fetch(`${apiUrl}/users/${userId}/favorites`, {
    method: "POST",
    headers: getAuthHeaders(),

    body: JSON.stringify({
      songId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível favoritar a música."),
    );
  }

  return response.json() as Promise<Favorite>;
}

export async function removeFavorite(userId: number, songId: number) {
  const response = await fetch(
    `${apiUrl}/users/${userId}/favorites/${songId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível remover o favorito."),
    );
  }
}

export async function getUserPlaylists(userId: number): Promise<Playlist[]> {
  const response = await fetch(`${apiUrl}/users/${userId}/playlists`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar suas playlists.",
      ),
    );
  }

  return response.json() as Promise<Playlist[]>;
}

export async function getPlaylist(playlistId: number): Promise<Playlist> {
  const response = await fetch(`${apiUrl}/playlists/${playlistId}`, {
    headers: getOptionalAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível carregar a playlist."),
    );
  }

  return response.json() as Promise<Playlist>;
}

export async function createPlaylist(
  data: CreatePlaylistData,
): Promise<Playlist> {
  const response = await fetch(`${apiUrl}/playlists`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível criar a playlist."),
    );
  }

  return response.json() as Promise<Playlist>;
}

export async function addSongToPlaylist(playlistId: number, songId: number) {
  const response = await fetch(`${apiUrl}/playlists/${playlistId}/songs`, {
    method: "POST",
    headers: getAuthHeaders(),

    body: JSON.stringify({
      songId,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível adicionar a música à playlist.",
      ),
    );
  }
}

export async function removeSongFromPlaylist(
  playlistId: number,
  songId: number,
) {
  const response = await fetch(
    `${apiUrl}/playlists/${playlistId}/songs/${songId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível remover a música da playlist.",
      ),
    );
  }
}

export async function deletePlaylist(playlistId: number) {
  const response = await fetch(`${apiUrl}/playlists/${playlistId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível excluir a playlist."),
    );
  }
}
