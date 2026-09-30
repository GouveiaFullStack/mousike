import type {
  AuthUser,
  LoginData,
  LoginResponse,
  RegisterData,
} from "../types/auth";

import { apiUrl } from "./api";

export async function login(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string;
    };

    throw new Error(error.message ?? "Não foi possível entrar na sua conta.");
  }

  return response.json() as Promise<LoginResponse>;
}

export async function register(data: RegisterData): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string;
    };

    throw new Error(error.message ?? "Não foi possível criar sua conta.");
  }

  return response.json() as Promise<AuthUser>;
}

export async function getAuthenticatedUser(token: string): Promise<AuthUser> {
  const response = await fetch(`${apiUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string;
    };

    throw new Error(
      error.message ?? "Não foi possível carregar o usuário autenticado.",
    );
  }

  return response.json() as Promise<AuthUser>;
}
