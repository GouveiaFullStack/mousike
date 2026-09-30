import { apiUrl, getAccessToken, getAuthHeaders } from "./api";

import type {
  MyArtistResponse,
  PublishSongData,
  PublishSongResponse,
} from "../types/publish";

async function getErrorMessage(response: Response, fallback: string) {
  const error = (await response.json()) as {
    message?: string;
  };

  return error.message ?? fallback;
}

export async function getMyArtist(): Promise<MyArtistResponse> {
  const response = await fetch(`${apiUrl}/artists/me`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível verificar seu perfil de artista.",
      ),
    );
  }

  return response.json() as Promise<MyArtistResponse>;
}

export async function publishSong(
  data: PublishSongData,
): Promise<PublishSongResponse> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Sua sessão não está disponível.");
  }

  const formData = new FormData();

  formData.append("title", data.title);

  formData.append("audio", data.audio);

  if (data.cover) {
    formData.append("cover", data.cover);
  }

  if (data.artistName) {
    formData.append("artistName", data.artistName);
  }

  if (data.artists) {
    formData.append("artists", JSON.stringify(data.artists));
  }

  const response = await fetch(`${apiUrl}/songs/publish`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível publicar a música."),
    );
  }

  return response.json() as Promise<PublishSongResponse>;
}
