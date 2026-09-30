import { apiUrl, getAuthHeaders } from "./api";

import type { HomeData } from "../types/home";

export async function getHome(): Promise<HomeData> {
  const response = await fetch(`${apiUrl}/home`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string;
    };

    throw new Error(error.message ?? "Não foi possível carregar a Home.");
  }

  return response.json() as Promise<HomeData>;
}
