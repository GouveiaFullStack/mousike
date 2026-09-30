import type { CatalogArtist } from "./catalog";
import type { PublicUser } from "./profile";

export type FollowedArtist = {
  userId: number;
  artistId: number;
  createdAt: string;
  artist: CatalogArtist;
};

export type FollowedUser = {
  followerId: number;
  followingId: number;
  createdAt: string;
  following: PublicUser;
};
