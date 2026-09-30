import type { CatalogArtist, SongDetails } from "./catalog";

export type MyArtistResponse = {
  artist: CatalogArtist | null;
};

export type PublishSongArtist = {
  artistId: number;
  role: string;
};

export type PublishSongData = {
  title: string;
  audio: File;
  cover: File | null;

  artistName?: string;

  artists?: PublishSongArtist[];
};

export type PublishSongResponse = {
  artistCreated: boolean;
  artist: CatalogArtist;
  song: SongDetails;
};
