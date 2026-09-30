import { useParams } from "react-router";

import TrackItem from "../../components/TrackItem";
import { useResourceById } from "../../hooks/useResourceById";
import { getMediaUrl } from "../../services/api";
import { getArtist } from "../../services/catalog.service";

function ArtistPage() {
  const { artistId: artistIdParam } = useParams();

  const artistId = Number(artistIdParam);

  const {
    data: artist,
    isLoading,
    isValidId,
    errorMessage,
  } = useResourceById(artistId, getArtist);

  if (!isValidId) {
    return <p>ID de artista inválido.</p>;
  }

  if (isLoading) {
    return <p>Carregando artista...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (!artist) {
    return null;
  }

  const imageUrl = getMediaUrl(artist.imageUrl);

  return (
    <section>
      <header>
        {imageUrl && (
          <img src={imageUrl} alt={artist.name} width="240" height="240" />
        )}

        <div>
          <p>Artista</p>

          <h1>
            {artist.name}
            {artist.verified ? " ✓" : ""}
          </h1>

          {artist.bio && <p>{artist.bio}</p>}
        </div>
      </header>

      <section>
        <h2>Músicas</h2>

        {artist.songs.length === 0 ? (
          <p>Nenhuma música encontrada.</p>
        ) : (
          <div>
            {artist.songs.map((relation) => (
              <TrackItem
                key={relation.songId}
                id={relation.song.id}
                title={relation.song.title}
                duration={relation.song.duration}
                audioUrl={relation.song.audioUrl}
                coverUrl={
                  relation.song.coverUrl ??
                  relation.song.album?.coverUrl ??
                  null
                }
                artists={[
                  {
                    id: artist.id,
                    name: artist.name,
                  },
                ]}
                album={
                  relation.song.album
                    ? {
                        id: relation.song.album.id,
                        title: relation.song.album.title,
                      }
                    : null
                }
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default ArtistPage;
