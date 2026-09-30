import { Link } from "react-router";

import { usePlayer } from "../hooks/usePlayer";
import { getMediaUrl } from "../services/api";
import { formatDuration } from "../utils/formatDuration";
import AddToPlaylist from "./AddToPlaylist";
import FavoriteButton from "./FavoriteButton";

type TrackArtist = {
  id: number;
  name: string;
};

type TrackAlbum = {
  id: number;
  title: string;
};

type TrackItemProps = {
  id: number;
  title: string;
  duration: number;
  audioUrl: string;
  coverUrl: string | null;
  artists: TrackArtist[];
  album?: TrackAlbum | null;
};

function TrackItem({
  id,
  title,
  duration,
  audioUrl,
  coverUrl,
  artists,
  album,
}: TrackItemProps) {
  const { playSong } = usePlayer();

  const imageUrl = getMediaUrl(coverUrl);

  function handlePlay() {
    playSong({
      id,
      title,
      audioUrl,
      coverUrl,
      artistNames: artists.map((artist) => artist.name),
    });
  }

  return (
    <article>
      {imageUrl && (
        <img src={imageUrl} alt={`Capa de ${title}`} width="64" height="64" />
      )}

      <div>
        <Link to={`/app/songs/${id}`}>
          <strong>{title}</strong>
        </Link>

        <p>
          {artists.map((artist, index) => (
            <span key={artist.id}>
              {index > 0 && ", "}

              <Link to={`/app/artists/${artist.id}`}>{artist.name}</Link>
            </span>
          ))}
        </p>

        {album && <Link to={`/app/albums/${album.id}`}>{album.title}</Link>}
      </div>

      <span>{formatDuration(duration)}</span>

      <FavoriteButton songId={id} />

      <AddToPlaylist songId={id} />

      <button type="button" onClick={handlePlay}>
        Tocar
      </button>
    </article>
  );
}

export default TrackItem;
