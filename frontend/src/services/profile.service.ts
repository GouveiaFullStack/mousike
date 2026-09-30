import { apiUrl, getAccessToken, getAuthHeaders } from "./api";

import type { AuthUser } from "../types/auth";
import type { PublicUser, UpdateProfileData } from "../types/profile";

async function getErrorMessage(response: Response, fallback: string) {
  const error = (await response.json()) as {
    message?: string;
  };

  return error.message ?? fallback;
}

export async function getUser(userId: number): Promise<PublicUser> {
  const response = await fetch(`${apiUrl}/users/${userId}`);

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível carregar o usuário."),
    );
  }

  return response.json() as Promise<PublicUser>;
}

export async function updateProfile(
  userId: number,
  data: UpdateProfileData,
): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/users/${userId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível atualizar o perfil."),
    );
  }

  return response.json() as Promise<AuthUser>;
}

export async function uploadProfileImage(file: File): Promise<AuthUser> {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Sua sessão não está disponível.");
  }

  const formData = new FormData();

  formData.append("image", file);

  const response = await fetch(`${apiUrl}/users/me/profile-image`, {
    method: "PATCH",

    headers: {
      Authorization: `Bearer ${token}`,
    },

    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível atualizar a foto de perfil.",
      ),
    );
  }

  return response.json() as Promise<AuthUser>;
}

export async function removeProfileImage() {
  const response = await fetch(`${apiUrl}/users/me/profile-image`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível remover a foto de perfil.",
      ),
    );
  }
}
