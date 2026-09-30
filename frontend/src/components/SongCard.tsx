import { Link } from "react-router";

import AddToPlaylist from "./AddToPlaylist";
import FavoriteButton from "./FavoriteButton";

import { usePlayer } from "../hooks/usePlayer";
import { getMediaUrl } from "../services/api";
import type { SearchSong } from "../types/search";
import { formatDuration } from "../utils/formatDuration";

type SongCardProps = {
  song: SearchSong;
};

function SongCard({ song }: SongCardProps) {
  const { playSong } = usePlayer();

  const coverUrl = getMediaUrl(song.coverUrl ?? song.album?.coverUrl ?? null);

  const artists = song.artists.map((songArtist) => songArtist.artist);

  const artistNames = artists.map((artist) => artist.name);

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

      <div>
        <Link to={`/app/songs/${song.id}`}>
          <h3>{song.title}</h3>
        </Link>

        <p>
          {artists.map((artist, index) => (
            <span key={artist.id}>
              {index > 0 && ", "}

              <Link to={`/app/artists/${artist.id}`}>{artist.name}</Link>
            </span>
          ))}
        </p>

        {song.album && (
          <p>
            <Link to={`/app/albums/${song.album.id}`}>{song.album.title}</Link>
          </p>
        )}

        <p>{formatDuration(song.duration)}</p>
      </div>

      <div>
        <FavoriteButton songId={song.id} />

        <AddToPlaylist songId={song.id} />

        <button type="button" onClick={handlePlay}>
          Tocar
        </button>
      </div>
    </article>
  );
}

export default SongCard;
