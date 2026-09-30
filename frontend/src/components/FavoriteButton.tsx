import { useState } from "react";

import { useLibrary } from "../hooks/useLibrary";

type FavoriteButtonProps = {
  songId: number;
};

function FavoriteButton({ songId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useLibrary();

  const [isPending, setIsPending] = useState(false);

  const favorite = isFavorite(songId);

  async function handleClick() {
    setIsPending(true);

    try {
      await toggleFavorite(songId);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending}>
      {favorite ? "Remover dos favoritos" : "Favoritar"}
    </button>
  );
}

export default FavoriteButton;
