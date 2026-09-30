import { apiUrl, getAuthHeaders } from "./api";

import type {
  ListeningHistoryEntry,
  RecordHistoryResponse,
} from "../types/history";

async function getErrorMessage(response: Response, fallback: string) {
  const error = (await response.json()) as {
    message?: string;
  };

  return error.message ?? fallback;
}

export async function getHistory(
  userId: number,
): Promise<ListeningHistoryEntry[]> {
  const response = await fetch(`${apiUrl}/users/${userId}/history`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, "Não foi possível carregar o histórico."),
    );
  }

  return response.json() as Promise<ListeningHistoryEntry[]>;
}

export async function recordHistory(
  userId: number,
  songId: number,
  secondsListen: number,
): Promise<RecordHistoryResponse> {
  const response = await fetch(`${apiUrl}/users/${userId}/history`, {
    method: "POST",

    headers: getAuthHeaders(),

    body: JSON.stringify({
      songId,
      secondsListen,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(
        response,
        "Não foi possível registrar a reprodução.",
      ),
    );
  }

  return response.json() as Promise<RecordHistoryResponse>;
}
