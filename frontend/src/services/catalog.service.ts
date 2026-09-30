import { apiUrl } from "./api";

import type {
  AlbumDetails,
  ArtistDetails,
  SongDetails,
} from "../types/catalog";

async function requestCatalogResource<T>(
  path: string,
  fallbackMessage: string,
): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`);

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string;
    };

    throw new Error(error.message ?? fallbackMessage);
  }

  return response.json() as Promise<T>;
}

export function getSong(songId: number) {
  return requestCatalogResource<SongDetails>(
    `/songs/${songId}`,
    "Não foi possível carregar a música.",
  );
}

export function getArtist(artistId: number) {
  return requestCatalogResource<ArtistDetails>(
    `/artists/${artistId}`,
    "Não foi possível carregar o artista.",
  );
}

export function getAlbum(albumId: number) {
  return requestCatalogResource<AlbumDetails>(
    `/albums/${albumId}`,
    "Não foi possível carregar o álbum.",
  );
}
