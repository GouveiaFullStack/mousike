import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import TrackItem from "../../components/TrackItem";

import { useAuth } from "../../hooks/useAuth";
import { useLibrary } from "../../hooks/useLibrary";
import { useResourceById } from "../../hooks/useResourceById";

import { getMediaUrl } from "../../services/api";
import { getPlaylist } from "../../services/library.service";

function PlaylistPage() {
  const { playlistId: playlistIdParam } = useParams();

  const playlistId = Number(playlistIdParam);

  const navigate = useNavigate();

  const { user } = useAuth();

  const { removeSong, removePlaylist } = useLibrary();

  const {
    data: playlist,
    isLoading,
    isValidId,
    errorMessage,
  } = useResourceById(playlistId, getPlaylist);

  const [isDeleting, setIsDeleting] = useState(false);
  const [removingSongId, setRemovingSongId] = useState<number | null>(null);

  const [removedSongIds, setRemovedSongIds] = useState<number[]>([]);
  const [actionError, setActionError] = useState("");

  if (!isValidId) {
    return <p>ID de playlist inválido.</p>;
  }

  if (isLoading) {
    return <p>Carregando playlist...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (!playlist) {
    return null;
  }

  const currentPlaylist = playlist;

  const isOwner = user?.id === currentPlaylist.userId;

  const coverUrl = getMediaUrl(currentPlaylist.coverUrl);

  const visibleSongs = currentPlaylist.songs.filter(
    (relation) => !removedSongIds.includes(relation.songId),
  );

  async function handleDeletePlaylist() {
    setActionError("");
    setIsDeleting(true);

    try {
      await removePlaylist(currentPlaylist.id);

      navigate("/app/library", {
        replace: true,
      });
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a playlist.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleRemoveSong(songId: number) {
    setActionError("");
    setRemovingSongId(songId);

    try {
      await removeSong(currentPlaylist.id, songId);

      setRemovedSongIds((current) => [...current, songId]);
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Não foi possível remover a música.",
      );
    } finally {
      setRemovingSongId(null);
    }
  }

  return (
    <section>
      <header>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Capa de ${currentPlaylist.name}`}
            width="240"
            height="240"
          />
        )}

        <div>
          <p>Playlist</p>

          <h1>{currentPlaylist.name}</h1>

          {currentPlaylist.description && <p>{currentPlaylist.description}</p>}

          <p>Criada por {currentPlaylist.user.username}</p>

          <p>{currentPlaylist.isPublic ? "Pública" : "Privada"}</p>

          <p>
            {visibleSongs.length}{" "}
            {visibleSongs.length === 1 ? "música" : "músicas"}
          </p>

          {isOwner && (
            <button
              type="button"
              onClick={handleDeletePlaylist}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir playlist"}
            </button>
          )}
        </div>
      </header>

      {actionError && <p role="alert">{actionError}</p>}

      <section>
        <h2>Faixas</h2>

        {visibleSongs.length === 0 ? (
          <p>Esta playlist ainda não possui músicas.</p>
        ) : (
          <div>
            {visibleSongs.map((relation) => {
              const song = relation.song;

              return (
                <div key={song.id}>
                  <TrackItem
                    id={song.id}
                    title={song.title}
                    duration={song.duration}
                    audioUrl={song.audioUrl}
                    coverUrl={
                      song.coverUrl ??
                      song.album?.coverUrl ??
                      currentPlaylist.coverUrl
                    }
                    artists={song.artists.map((songArtist) => ({
                      id: songArtist.artist.id,
                      name: songArtist.artist.name,
                    }))}
                    album={
                      song.album
                        ? {
                            id: song.album.id,
                            title: song.album.title,
                          }
                        : null
                    }
                  />

                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSong(song.id)}
                      disabled={removingSongId === song.id}
                    >
                      {removingSongId === song.id
                        ? "Removendo..."
                        : "Remover da playlist"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default PlaylistPage;
