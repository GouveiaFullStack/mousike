import { Link, useParams } from "react-router";

import { usePlayer } from "../../hooks/usePlayer";
import { useResourceById } from "../../hooks/useResourceById";
import { getMediaUrl } from "../../services/api";
import { getSong } from "../../services/catalog.service";
import { formatDuration } from "../../utils/formatDuration";
import AddToPlaylist from "../../components/AddToPlaylist";
import FavoriteButton from "../../components/FavoriteButton";

function SongPage() {
  const { songId: songIdParam } = useParams();

  const songId = Number(songIdParam);

  const {
    data: song,
    isLoading,
    isValidId,
    errorMessage,
  } = useResourceById(songId, getSong);

  const { playSong } = usePlayer();

  if (!isValidId) {
    return <p>ID de música inválido.</p>;
  }

  if (isLoading) {
    return <p>Carregando música...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (!song) {
    return null;
  }

  const currentSong = song;

  const coverUrl = getMediaUrl(song.coverUrl ?? song.album?.coverUrl ?? null);

  const artists = song.artists.map((songArtist) => songArtist.artist);

  function handlePlay() {
    playSong({
      id: currentSong.id,
      title: currentSong.title,
      audioUrl: currentSong.audioUrl,
      coverUrl: currentSong.coverUrl ?? currentSong.album?.coverUrl ?? null,
      artistNames: artists.map((artist) => artist.name),
    });
  }

  return (
    <section>
      <header>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Capa de ${song.title}`}
            width="240"
            height="240"
          />
        )}

        <div>
          <p>Música</p>

          <h1>{song.title}</h1>

          <p>
            {artists.map((artist, index) => (
              <span key={artist.id}>
                {index > 0 && ", "}

                <Link to={`/app/artists/${artist.id}`}>{artist.name}</Link>
              </span>
            ))}
          </p>

          <p>{formatDuration(song.duration)}</p>

          <FavoriteButton songId={song.id} />

          <AddToPlaylist songId={song.id} />

          <button type="button" onClick={handlePlay}>
            Tocar
          </button>
        </div>
      </header>

      {song.album && (
        <section>
          <h2>Álbum</h2>

          <Link to={`/app/albums/${song.album.id}`}>{song.album.title}</Link>
        </section>
      )}

      {song.genres.length > 0 && (
        <section>
          <h2>Gêneros</h2>

          <p>
            {song.genres.map((songGenre) => songGenre.genre.name).join(", ")}
          </p>
        </section>
      )}
    </section>
  );
}

export default SongPage;
