import { useState, type FormEvent } from "react";

import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";
import SongCard from "../../components/SongCard";

import { search } from "../../services/search.service";
import type { SearchResponse } from "../../types/search";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      setErrorMessage("Digite pelo menos 2 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await search(normalizedQuery);

      setResults(response);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível realizar a busca.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section>
      <header>
        <h1>Buscar</h1>

        <p>Encontre músicas, artistas e álbuns.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <label htmlFor="search">O que você quer ouvir?</label>

        <input
          id="search"
          name="search"
          type="search"
          placeholder="Música, artista ou álbum"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setErrorMessage("");
          }}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      {results && (
        <div>
          <p>
            Resultados para: <strong>{results.query}</strong>
          </p>

          <section>
            <h2>Músicas ({results.counts.songs})</h2>

            {results.results.songs.length === 0 ? (
              <p>Nenhuma música encontrada.</p>
            ) : (
              <div>
                {results.results.songs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2>Artistas ({results.counts.artists})</h2>

            {results.results.artists.length === 0 ? (
              <p>Nenhum artista encontrado.</p>
            ) : (
              <div>
                {results.results.artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2>Álbuns ({results.counts.albums})</h2>

            {results.results.albums.length === 0 ? (
              <p>Nenhum álbum encontrado.</p>
            ) : (
              <div>
                {results.results.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

export default SearchPage;
