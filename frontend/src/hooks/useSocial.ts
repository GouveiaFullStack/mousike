import { useContext } from "react";

import { SocialContext } from "../contexts/social-context";

export function useSocial() {
  const context = useContext(SocialContext);

  if (!context) {
    throw new Error("useSocial deve ser usado dentro de SocialProvider");
  }

  return context;
}
