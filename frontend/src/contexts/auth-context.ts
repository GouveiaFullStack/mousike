import { createContext } from "react";

import type { AuthUser, LoginResponse } from "../types/auth";

export type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;

  setSession: (session: LoginResponse) => void;

  updateUser: (user: AuthUser) => void;

  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
