import { apiUrl, getAuthHeaders } from "./api";

import type { FollowedArtist, FollowedUser } from "../types/social";

async function getErrorMessage(response: Response, fallback: string) {
  const error = (await response.json()) as {
    message?: string;
  };

  return error.message ?? fallback;
}

export async function getFollowedArtists(
  userId: number,
): Promise<FollowedArtist[]> {
  const response = await fetch(`${apiUrl}/users/${userId}/following/artists`);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar os artistas seguidos.",
      ),
    );
  }

  return response.json() as Promise<FollowedArtist[]>;
}

export async function followArtist(
  userId: number,
  artistId: number,
): Promise<FollowedArtist> {
  const response = await fetch(
    `${apiUrl}/users/${userId}/following/artists/${artistId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível seguir o artista."),
    );
  }

  return response.json() as Promise<FollowedArtist>;
}

export async function unfollowArtist(userId: number, artistId: number) {
  const response = await fetch(
    `${apiUrl}/users/${userId}/following/artists/${artistId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível deixar de seguir o artista.",
      ),
    );
  }
}

export async function getFollowedUsers(
  userId: number,
): Promise<FollowedUser[]> {
  const response = await fetch(`${apiUrl}/users/${userId}/following/users`);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível carregar os usuários seguidos.",
      ),
    );
  }

  return response.json() as Promise<FollowedUser[]>;
}

export async function followUser(
  followerId: number,
  followingId: number,
): Promise<FollowedUser> {
  const response = await fetch(
    `${apiUrl}/users/${followerId}/following/users/${followingId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível seguir o usuário."),
    );
  }

  return response.json() as Promise<FollowedUser>;
}

export async function unfollowUser(followerId: number, followingId: number) {
  const response = await fetch(
    `${apiUrl}/users/${followerId}/following/users/${followingId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível deixar de seguir o usuário.",
      ),
    );
  }
}
