import { Link } from "react-router";

import { getMediaUrl } from "../services/api";
import type { SearchArtist } from "../types/search";

type ArtistCardProps = {
  artist: SearchArtist;
};

function ArtistCard({ artist }: ArtistCardProps) {
  const imageUrl = getMediaUrl(artist.imageUrl);

  return (
    <article>
      <Link to={`/app/artists/${artist.id}`}>
        {imageUrl && (
          <img src={imageUrl} alt={artist.name} width="160" height="160" />
        )}

        <h3>
          {artist.name}
          {artist.verified ? " ✓" : ""}
        </h3>
      </Link>
    </article>
  );
}

export default ArtistCard;
