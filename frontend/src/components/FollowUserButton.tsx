import { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { useSocial } from "../hooks/useSocial";

type FollowUserButtonProps = {
  userId: number;
};

function FollowUserButton({ userId }: FollowUserButtonProps) {
  const { user } = useAuth();

  const { isFollowingUser, toggleUserFollow } = useSocial();

  const [isPending, setIsPending] = useState(false);

  if (!user || user.id === userId) {
    return null;
  }

  const following = isFollowingUser(userId);

  async function handleClick() {
    setIsPending(true);

    try {
      await toggleUserFollow(userId);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending}>
      {isPending
        ? "Aguarde..."
        : following
          ? "Deixar de seguir"
          : "Seguir usuário"}
    </button>
  );
}

export default FollowUserButton;
