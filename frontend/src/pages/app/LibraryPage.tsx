import { useState, type FormEvent } from "react";

import { Link } from "react-router";

import TrackItem from "../../components/TrackItem";
import { useLibrary } from "../../hooks/useLibrary";

function LibraryPage() {
  const { favorites, playlists, isLoading, errorMessage, createNewPlaylist } =
    useLibrary();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreatePlaylist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsCreating(true);

    try {
      await createNewPlaylist({
        name: name.trim(),
        description: description.trim(),
        isPublic,
      });

      setName("");
      setDescription("");
      setIsPublic(false);
    } finally {
      setIsCreating(false);
    }
  }

  if (isLoading) {
    return <p>Carregando biblioteca...</p>;
  }

  return (
    <section>
      <h1>Sua biblioteca</h1>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      <section>
        <h2>Criar playlist</h2>

        <form onSubmit={handleCreatePlaylist}>
          <input
            type="text"
            placeholder="Nome da playlist"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.target.checked)}
            />
            Playlist pública
          </label>

          <button type="submit" disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar playlist"}
          </button>
        </form>
      </section>

      <section>
        <h2>Playlists</h2>

        {playlists.length === 0 ? (
          <p>Você ainda não possui playlists.</p>
        ) : (
          <div>
            {playlists.map((playlist) => (
              <article key={playlist.id}>
                <Link to={`/app/playlists/${playlist.id}`}>
                  <h3>{playlist.name}</h3>
                </Link>

                <p>{playlist.songs.length} músicas</p>

                <p>{playlist.isPublic ? "Pública" : "Privada"}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Músicas favoritas</h2>

        {favorites.length === 0 ? (
          <p>Você ainda não favoritou nenhuma música.</p>
        ) : (
          <div>
            {favorites.map((favorite) => {
              const song = favorite.song;

              return (
                <TrackItem
                  key={favorite.id}
                  id={song.id}
                  title={song.title}
                  duration={song.duration}
                  audioUrl={song.audioUrl}
                  coverUrl={song.coverUrl ?? song.album?.coverUrl ?? null}
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
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

export default LibraryPage;
