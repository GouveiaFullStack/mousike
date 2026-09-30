import { Link } from "react-router";

import { getMediaUrl } from "../services/api";
import { usePlayer } from "../hooks/usePlayer";
import type { SearchSong } from "../types/search";
import { formatDuration } from "../utils/formatDuration";

type SongCardProps = {
  song: SearchSong;
};

function SongCard({ song }: SongCardProps) {
  const { playSong } = usePlayer();

  const coverUrl = getMediaUrl(song.coverUrl ?? song.album?.coverUrl ?? null);

  const artistNames = song.artists.map((songArtist) => songArtist.artist.name);

  function handlePlay() {
    playSong({
      id: song.id,
      title: song.title,
      audioUrl: song.audioUrl,
      coverUrl: song.coverUrl ?? song.album?.coverUrl ?? null,
      artistNames,
    });
  }

  return (
    <article>
      {coverUrl && (
        <Link to={`/app/songs/${song.id}`}>
          <img
            src={coverUrl}
            alt={`Capa de ${song.title}`}
            width="160"
            height="160"
          />
        </Link>
      )}

      <Link to={`/app/songs/${song.id}`}>
        <h3>{song.title}</h3>
      </Link>

      <p>
        {song.artists.map((songArtist, index) => (
          <span key={songArtist.artistId}>
            {index > 0 && ", "}

            <Link to={`/app/artists/${songArtist.artist.id}`}>
              {songArtist.artist.name}
            </Link>
          </span>
        ))}
      </p>

      {song.album && (
        <p>
          <Link to={`/app/albums/${song.album.id}`}>{song.album.title}</Link>
        </p>
      )}

      <p>{formatDuration(song.duration)}</p>

      <button type="button" onClick={handlePlay}>
        Tocar
      </button>
    </article>
  );
}

export default SongCard;
