import type { SongDetails } from "./catalog";

export type Favorite = {
  id: number;
  userId: number;
  songId: number;
  createdAt: string;
  song: SongDetails;
};

export type PlaylistSong = {
  playlistId: number;
  songId: number;
  position: number;
  addedAt: string;
  song: SongDetails;
};

export type Playlist = {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  coverUrl: string | null;
  isPublic: boolean;
  createdAt: string;

  user: {
    id: number;
    username: string;
    profileImageUrl: string | null;
  };

  songs: PlaylistSong[];
};

export type CreatePlaylistData = {
  name: string;
  description?: string;
  isPublic: boolean;
};
