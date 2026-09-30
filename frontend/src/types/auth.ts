export type AuthUser = {
  id: number;
  username: string;
  email: string;
  bio: string | null;
  profileImageUrl: string | null;
  createdAt: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
};
