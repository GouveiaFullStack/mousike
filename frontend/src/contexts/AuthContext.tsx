import { useEffect, useState, type ReactNode } from "react";

import { AuthContext } from "./auth-context";
import { getAuthenticatedUser } from "../services/auth.service";
import type { AuthUser, LoginResponse } from "../types/auth";

type AuthProviderProps = {
  children: ReactNode;
};

const tokenKey = "mousike_access_token";

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] = useState(() => {
    return sessionStorage.getItem(tokenKey) !== null;
  });

  useEffect(() => {
    const token = sessionStorage.getItem(tokenKey);

    if (!token) {
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadAuthenticatedUser() {
      try {
        const authenticatedUser = await getAuthenticatedUser(accessToken);

        if (!cancelled) {
          setUser(authenticatedUser);
        }
      } catch {
        sessionStorage.removeItem(tokenKey);

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAuthenticatedUser();

    return () => {
      cancelled = true;
    };
  }, []);

  function setSession(session: LoginResponse) {
    sessionStorage.setItem(tokenKey, session.token);
    setUser(session.user);
  }

  function logout() {
    sessionStorage.removeItem(tokenKey);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
