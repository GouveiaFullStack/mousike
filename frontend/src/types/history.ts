import type { SongDetails } from "./catalog";

export type ListeningHistoryEntry = {
  id: number;
  userId: number;
  songId: number;
  secondsListen: number;
  playedAt: string;
  song: SongDetails;
};

export type RecordHistoryResponse =
  | {
      recorded: false;
      message: string;
      secondsListen: number;
      minimumSeconds: number;
      songDuration: number;
    }
  | {
      recorded: true;
      history: ListeningHistoryEntry;
    };
