import { createContext } from "react";

import type { FollowedArtist, FollowedUser } from "../types/social";

export type SocialContextValue = {
  followedArtists: FollowedArtist[];
  followedUsers: FollowedUser[];
  isLoading: boolean;
  errorMessage: string;

  isFollowingArtist: (artistId: number) => boolean;

  isFollowingUser: (userId: number) => boolean;

  toggleArtistFollow: (artistId: number) => Promise<void>;

  toggleUserFollow: (userId: number) => Promise<void>;
};

export const SocialContext = createContext<SocialContextValue | undefined>(
  undefined,
);
