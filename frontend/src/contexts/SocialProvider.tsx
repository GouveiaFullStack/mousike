import { useEffect, useState, type ReactNode } from "react";

import { SocialContext } from "./social-context";

import { useAuth } from "../hooks/useAuth";

import {
  followArtist,
  followUser,
  getFollowedArtists,
  getFollowedUsers,
  unfollowArtist,
  unfollowUser,
} from "../services/social.service";

import type { FollowedArtist, FollowedUser } from "../types/social";

type SocialProviderProps = {
  children: ReactNode;
};

export function SocialProvider({ children }: SocialProviderProps) {
  const { user } = useAuth();

  const [followedArtists, setFollowedArtists] = useState<FollowedArtist[]>([]);

  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      return;
    }

    const authenticatedUserId = userId;

    let cancelled = false;

    async function loadSocialData() {
      try {
        const [artists, users] = await Promise.all([
          getFollowedArtists(authenticatedUserId),

          getFollowedUsers(authenticatedUserId),
        ]);

        if (!cancelled) {
          setFollowedArtists(artists);
          setFollowedUsers(users);
          setErrorMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar seus dados sociais.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSocialData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  function isFollowingArtist(artistId: number) {
    return followedArtists.some((follow) => follow.artistId === artistId);
  }

  function isFollowingUser(followedUserId: number) {
    return followedUsers.some(
      (follow) => follow.followingId === followedUserId,
    );
  }

  async function toggleArtistFollow(artistId: number) {
    if (!userId) {
      return;
    }

    if (isFollowingArtist(artistId)) {
      await unfollowArtist(userId, artistId);

      setFollowedArtists((current) =>
        current.filter((follow) => follow.artistId !== artistId),
      );

      return;
    }

    const follow = await followArtist(userId, artistId);

    setFollowedArtists((current) => [follow, ...current]);
  }

  async function toggleUserFollow(followedUserId: number) {
    if (!userId) {
      return;
    }

    if (isFollowingUser(followedUserId)) {
      await unfollowUser(userId, followedUserId);

      setFollowedUsers((current) =>
        current.filter((follow) => follow.followingId !== followedUserId),
      );

      return;
    }

    const follow = await followUser(userId, followedUserId);

    setFollowedUsers((current) => [follow, ...current]);
  }

  return (
    <SocialContext.Provider
      value={{
        followedArtists,
        followedUsers,
        isLoading,
        errorMessage,
        isFollowingArtist,
        isFollowingUser,
        toggleArtistFollow,
        toggleUserFollow,
      }}
    >
      {children}
    </SocialContext.Provider>
  );
}
