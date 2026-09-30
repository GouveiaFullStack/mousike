import { useEffect, useState, type FormEvent } from "react";

import { useNavigate } from "react-router";

import { getMyArtist, publishSong } from "../../services/publish.service";
import { search } from "../../services/search.service";

import type { CatalogArtist } from "../../types/catalog";
import type { SearchArtist } from "../../types/search";

function PublishPage() {
  const navigate = useNavigate();

  const [ownArtist, setOwnArtist] = useState<CatalogArtist | null>(null);

  const [isLoadingArtist, setIsLoadingArtist] = useState(true);

  const [title, setTitle] = useState("");

  const [artistName, setArtistName] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [collaboratorQuery, setCollaboratorQuery] = useState("");

  const [collaboratorResults, setCollaboratorResults] = useState<
    SearchArtist[]
  >([]);

  const [collaborators, setCollaborators] = useState<SearchArtist[]>([]);

  const [isSearchingCollaborators, setIsSearchingCollaborators] =
    useState(false);

  const [isPublishing, setIsPublishing] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadArtist() {
      try {
        const response = await getMyArtist();

        if (!cancelled) {
          setOwnArtist(response.artist);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível verificar seu perfil de artista.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingArtist(false);
        }
      }
    }

    loadArtist();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCollaboratorSearch() {
    const query = collaboratorQuery.trim();

    if (query.length < 2) {
      setErrorMessage("Digite pelo menos 2 caracteres para buscar um artista.");

      return;
    }

    setErrorMessage("");
    setIsSearchingCollaborators(true);

    try {
      const response = await search(query);

      const availableArtists = response.results.artists.filter((artist) => {
        if (ownArtist && artist.id === ownArtist.id) {
          return false;
        }

        const alreadyAdded = collaborators.some(
          (collaborator) => collaborator.id === artist.id,
        );

        return !alreadyAdded;
      });

      setCollaboratorResults(availableArtists);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível buscar artistas.",
      );
    } finally {
      setIsSearchingCollaborators(false);
    }
  }

  function addCollaborator(artist: SearchArtist) {
    setCollaborators((current) => {
      const alreadyAdded = current.some(
        (collaborator) => collaborator.id === artist.id,
      );

      if (alreadyAdded) {
        return current;
      }

      return [...current, artist];
    });

    setCollaboratorResults((current) =>
      current.filter((result) => result.id !== artist.id),
    );
  }

  function removeCollaborator(artistId: number) {
    setCollaborators((current) =>
      current.filter((artist) => artist.id !== artistId),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedTitle = title.trim();

    const normalizedArtistName = artistName.trim();

    if (!normalizedTitle) {
      setErrorMessage("Informe o título da música.");

      return;
    }

    if (!audioFile) {
      setErrorMessage("Selecione um arquivo MP3.");

      return;
    }

    if (!ownArtist && !normalizedArtistName) {
      setErrorMessage("Informe seu nome artístico.");

      return;
    }

    setIsPublishing(true);

    try {
      const artists = ownArtist
        ? [
            {
              artistId: ownArtist.id,

              role: "main",
            },

            ...collaborators.map((artist) => ({
              artistId: artist.id,

              role: "featured",
            })),
          ]
        : undefined;

      const result = await publishSong({
        title: normalizedTitle,

        audio: audioFile,

        cover: coverFile,

        artistName: ownArtist ? undefined : normalizedArtistName,

        artists,
      });

      navigate(`/app/songs/${result.song.id}`, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível publicar a música.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  if (isLoadingArtist) {
    return <p>Preparando publicação...</p>;
  }

  return (
    <section>
      <header>
        <p>Publicação</p>

        <h1>Publicar música</h1>

        {ownArtist ? (
          <p>
            Publicando como <strong>{ownArtist.name}</strong>
          </p>
        ) : (
          <p>
            Esta será sua primeira publicação. Ao publicar, seu perfil de
            artista será criado automaticamente.
          </p>
        )}
      </header>

      {errorMessage && (
        <p role="alert" aria-live="polite">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {!ownArtist && (
          <div>
            <label htmlFor="artistName">Nome artístico</label>

            <input
              id="artistName"
              name="artistName"
              type="text"
              value={artistName}
              onChange={(event) => {
                setArtistName(event.target.value);

                setErrorMessage("");
              }}
              disabled={isPublishing}
              required
            />

            <p>Este será o nome exibido no seu perfil de artista.</p>
          </div>
        )}

        <div>
          <label htmlFor="songTitle">Título da música</label>

          <input
            id="songTitle"
            name="songTitle"
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);

              setErrorMessage("");
            }}
            disabled={isPublishing}
            required
          />
        </div>

        <div>
          <label htmlFor="audio">Arquivo da música</label>

          <input
            id="audio"
            name="audio"
            type="file"
            accept=".mp3,audio/mpeg"
            onChange={(event) => {
              setAudioFile(event.target.files?.[0] ?? null);

              setErrorMessage("");
            }}
            disabled={isPublishing}
            required
          />

          {audioFile && <p>Arquivo selecionado: {audioFile.name}</p>}
        </div>

        <div>
          <label htmlFor="cover">Capa da música</label>

          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
            disabled={isPublishing}
          />

          {coverFile && <p>Imagem selecionada: {coverFile.name}</p>}
        </div>

        {ownArtist && (
          <section>
            <header>
              <h2>Artistas da música</h2>

              <p>
                {ownArtist.name} será automaticamente definido como artista
                principal.
              </p>
            </header>

            <div>
              <p>
                <strong>{ownArtist.name}</strong> — artista principal
              </p>
            </div>

            <section>
              <h3>Adicionar colaboradores</h3>

              <div>
                <label htmlFor="collaborator">Buscar artista</label>

                <input
                  id="collaborator"
                  type="search"
                  placeholder="Nome do artista"
                  value={collaboratorQuery}
                  onChange={(event) => {
                    setCollaboratorQuery(event.target.value);

                    setErrorMessage("");
                  }}
                  disabled={isSearchingCollaborators || isPublishing}
                />

                <button
                  type="button"
                  onClick={handleCollaboratorSearch}
                  disabled={
                    isSearchingCollaborators ||
                    isPublishing ||
                    collaboratorQuery.trim().length < 2
                  }
                >
                  {isSearchingCollaborators ? "Buscando..." : "Buscar artista"}
                </button>
              </div>

              {collaboratorResults.length > 0 && (
                <section>
                  <h3>Resultados da busca</h3>

                  <div>
                    {collaboratorResults.map((artist) => (
                      <article key={artist.id}>
                        <span>
                          {artist.name}
                          {artist.verified ? " ✓" : ""}
                        </span>

                        <button
                          type="button"
                          onClick={() => addCollaborator(artist)}
                          disabled={isPublishing}
                        >
                          Adicionar
                        </button>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {collaboratorQuery.trim().length >= 2 &&
                !isSearchingCollaborators &&
                collaboratorResults.length === 0 && (
                  <p>Nenhum resultado disponível no momento.</p>
                )}
            </section>

            {collaborators.length > 0 && (
              <section>
                <h3>Participações</h3>

                <div>
                  {collaborators.map((artist) => (
                    <article key={artist.id}>
                      <span>{artist.name} — participação</span>

                      <button
                        type="button"
                        onClick={() => removeCollaborator(artist.id)}
                        disabled={isPublishing}
                      >
                        Remover
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </section>
        )}

        {!ownArtist && (
          <section>
            <h2>Perfil de artista</h2>

            <p>
              Seu perfil Artist será criado juntamente com esta primeira música.
            </p>

            <p>
              Nas próximas publicações você também poderá adicionar outros
              artistas como colaboradores.
            </p>
          </section>
        )}

        <section>
          <h2>Resumo</h2>

          <p>
            Título: <strong>{title.trim() || "Não informado"}</strong>
          </p>

          <p>
            Artista principal:{" "}
            <strong>
              {ownArtist?.name || artistName.trim() || "Não informado"}
            </strong>
          </p>

          <p>Participações: {collaborators.length}</p>

          <p>Áudio: {audioFile ? audioFile.name : "Não selecionado"}</p>

          <p>Capa: {coverFile ? coverFile.name : "Sem capa própria"}</p>
        </section>

        <button
          type="submit"
          disabled={
            isPublishing ||
            !title.trim() ||
            !audioFile ||
            (!ownArtist && !artistName.trim())
          }
        >
          {isPublishing ? "Publicando..." : "Publicar música"}
        </button>
      </form>
    </section>
  );
}

export default PublishPage;
