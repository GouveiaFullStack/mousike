import { useRef, type SyntheticEvent } from "react";

import { useAuth } from "../hooks/useAuth";
import { usePlayer } from "../hooks/usePlayer";

import { getMediaUrl } from "../services/api";
import { recordHistory } from "../services/history.service";

function AppPlayer() {
  const { user } = useAuth();

  const { currentSong, playbackId, clearSong } = usePlayer();

  const recordedPlaybackId = useRef<number | null>(null);

  if (!currentSong) {
    return (
      <footer>
        <p>Nenhuma música selecionada.</p>
      </footer>
    );
  }

  const song = currentSong;

  const audioUrl = getMediaUrl(song.audioUrl);

  const coverUrl = getMediaUrl(song.coverUrl);

  async function handleTimeUpdate(event: SyntheticEvent<HTMLAudioElement>) {
    if (!user) {
      return;
    }

    if (recordedPlaybackId.current === playbackId) {
      return;
    }

    const audio = event.currentTarget;

    const secondsListen = Math.floor(audio.currentTime);

    const minimumSeconds = Math.ceil(song.duration * 0.25);

    if (secondsListen < minimumSeconds) {
      return;
    }

    const normalizedSeconds = Math.min(secondsListen, song.duration);

    recordedPlaybackId.current = playbackId;

    try {
      await recordHistory(user.id, song.id, normalizedSeconds);
    } catch (error) {
      recordedPlaybackId.current = null;

      console.error("Erro ao registrar histórico:", error);
    }
  }

  return (
    <footer>
      <div>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Capa de ${song.title}`}
            width="64"
            height="64"
          />
        )}

        <div>
          <strong>{song.title}</strong>

          <p>{song.artistNames.join(", ")}</p>
        </div>
      </div>

      {audioUrl && (
        <audio
          key={`${song.id}-${playbackId}`}
          src={audioUrl}
          controls
          autoPlay
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
        />
      )}

      <button type="button" onClick={clearSong}>
        Fechar player
      </button>
    </footer>
  );
}

export default AppPlayer;
