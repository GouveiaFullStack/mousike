import { Link } from "react-router";

import { getMediaUrl } from "../services/api";
import type { SearchAlbum } from "../types/search";

type AlbumCardProps = {
  album: SearchAlbum;
};

function AlbumCard({ album }: AlbumCardProps) {
  const coverUrl = getMediaUrl(album.coverUrl);

  return (
    <article>
      <Link to={`/app/albums/${album.id}`}>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Capa de ${album.title}`}
            width="160"
            height="160"
          />
        )}

        <h3>{album.title}</h3>
      </Link>

      <p>
        {album.artists.map((albumArtist) => albumArtist.artist.name).join(", ")}
      </p>
    </article>
  );
}

export default AlbumCard;
