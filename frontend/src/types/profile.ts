import type { AuthUser } from "./auth";

export type PublicUser = {
  id: number;
  username: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
};

export type UpdateProfileData = {
  username?: string;
  bio?: string | null;
};

export type UpdatedProfile = AuthUser;
