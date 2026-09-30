import { useState } from "react";

import { useLibrary } from "../hooks/useLibrary";

type AddToPlaylistProps = {
  songId: number;
};

function AddToPlaylist({ songId }: AddToPlaylistProps) {
  const { playlists, addSong } = useLibrary();

  const [playlistId, setPlaylistId] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleAdd() {
    const selectedPlaylistId = Number(playlistId);

    if (!selectedPlaylistId) {
      return;
    }

    setIsPending(true);

    try {
      await addSong(selectedPlaylistId, songId);
      setPlaylistId("");
    } finally {
      setIsPending(false);
    }
  }

  if (playlists.length === 0) {
    return <span>Nenhuma playlist criada.</span>;
  }

  return (
    <div>
      <select
        value={playlistId}
        onChange={(event) => setPlaylistId(event.target.value)}
        disabled={isPending}
      >
        <option value="">Adicionar à playlist...</option>

        {playlists.map((playlist) => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!playlistId || isPending}
      >
        Adicionar
      </button>
    </div>
  );
}

export default AddToPlaylist;
