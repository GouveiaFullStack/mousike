import { apiUrl } from "./api";
import type { SearchResponse } from "../types/search";

export async function search(query: string): Promise<SearchResponse> {
  const normalizedQuery = query.trim();

  const response = await fetch(
    `${apiUrl}/search?q=${encodeURIComponent(normalizedQuery)}`,
  );

  if (!response.ok) {
    const error = (await response.json()) as {
      message?: string;
    };

    throw new Error(error.message ?? "Não foi possível realizar a busca.");
  }

  return response.json() as Promise<SearchResponse>;
}
