import { Link, useParams } from "react-router";

import TrackItem from "../../components/TrackItem";
import { useResourceById } from "../../hooks/useResourceById";
import { getMediaUrl } from "../../services/api";
import { getAlbum } from "../../services/catalog.service";

function AlbumPage() {
  const { albumId: albumIdParam } = useParams();

  const albumId = Number(albumIdParam);

  const {
    data: album,
    isLoading,
    isValidId,
    errorMessage,
  } = useResourceById(albumId, getAlbum);

  if (!isValidId) {
    return <p>ID de álbum inválido.</p>;
  }

  if (isLoading) {
    return <p>Carregando álbum...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (!album) {
    return null;
  }

  const coverUrl = getMediaUrl(album.coverUrl);

  return (
    <section>
      <header>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Capa de ${album.title}`}
            width="240"
            height="240"
          />
        )}

        <div>
          <p>Álbum</p>

          <h1>{album.title}</h1>

          <p>
            {album.artists.map((albumArtist, index) => (
              <span key={albumArtist.artistId}>
                {index > 0 && ", "}

                <Link to={`/app/artists/${albumArtist.artist.id}`}>
                  {albumArtist.artist.name}
                </Link>
              </span>
            ))}
          </p>

          <p>{new Date(album.releaseDate).getFullYear()}</p>
        </div>
      </header>

      <section>
        <h2>Faixas</h2>

        {album.songs.length === 0 ? (
          <p>Este álbum ainda não possui músicas.</p>
        ) : (
          <div>
            {album.songs.map((song) => (
              <TrackItem
                key={song.id}
                id={song.id}
                title={song.title}
                duration={song.duration}
                audioUrl={song.audioUrl}
                coverUrl={song.coverUrl ?? album.coverUrl}
                artists={song.artists.map((songArtist) => ({
                  id: songArtist.artist.id,
                  name: songArtist.artist.name,
                }))}
                album={{
                  id: album.id,
                  title: album.title,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default AlbumPage;
