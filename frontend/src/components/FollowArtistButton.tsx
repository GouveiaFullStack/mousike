import { useState } from "react";

import { useAuth } from "../hooks/useAuth";
import { useSocial } from "../hooks/useSocial";

type FollowArtistButtonProps = {
  artistId: number;
  ownerUserId: number;
};

function FollowArtistButton({
  artistId,
  ownerUserId,
}: FollowArtistButtonProps) {
  const { user } = useAuth();

  const { isFollowingArtist, toggleArtistFollow } = useSocial();

  const [isPending, setIsPending] = useState(false);

  if (!user || user.id === ownerUserId) {
    return null;
  }

  const following = isFollowingArtist(artistId);

  async function handleClick() {
    setIsPending(true);

    try {
      await toggleArtistFollow(artistId);
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
          : "Seguir artista"}
    </button>
  );
}

export default FollowArtistButton;
