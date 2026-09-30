import { useEffect, useState } from "react";

import TrackItem from "../../components/TrackItem";

import { useAuth } from "../../hooks/useAuth";

import { getHistory } from "../../services/history.service";

import type { ListeningHistoryEntry } from "../../types/history";

function HistoryPage() {
  const { user } = useAuth();

  const [history, setHistory] = useState<ListeningHistoryEntry[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      return;
    }

    const userId = user.id;

    let cancelled = false;

    async function loadHistory() {
      try {
        const data = await getHistory(userId);

        if (!cancelled) {
          setHistory(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o histórico.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (isLoading) {
    return <p>Carregando histórico...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  return (
    <section>
      <header>
        <h1>Histórico</h1>

        <p>Músicas que você ouviu recentemente.</p>
      </header>

      {history.length === 0 ? (
        <p>Seu histórico ainda está vazio.</p>
      ) : (
        <div>
          {history.map((entry) => {
            const song = entry.song;

            return (
              <article key={entry.id}>
                <TrackItem
                  id={song.id}
                  title={song.title}
                  duration={song.duration}
                  audioUrl={song.audioUrl}
                  coverUrl={song.coverUrl ?? song.album?.coverUrl ?? null}
                  artists={song.artists.map((songArtist) => ({
                    id: songArtist.artist.id,

                    name: songArtist.artist.name,
                  }))}
                  album={
                    song.album
                      ? {
                          id: song.album.id,

                          title: song.album.title,
                        }
                      : null
                  }
                />

                <p>
                  Ouvida em {new Date(entry.playedAt).toLocaleString("pt-BR")}
                </p>

                <p>{entry.secondsListen} segundos ouvidos</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HistoryPage;
