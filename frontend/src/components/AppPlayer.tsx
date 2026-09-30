import { getMediaUrl } from "../services/api";
import { usePlayer } from "../hooks/usePlayer";

function AppPlayer() {
  const { currentSong, clearSong } = usePlayer();

  if (!currentSong) {
    return (
      <footer>
        <p>Nenhuma música selecionada.</p>
      </footer>
    );
  }

  const audioUrl = getMediaUrl(currentSong.audioUrl);
  const coverUrl = getMediaUrl(currentSong.coverUrl);

  return (
    <footer>
      <div>
        {coverUrl && (
          <img
            src={coverUrl}
            alt={`Capa de ${currentSong.title}`}
            width="64"
            height="64"
          />
        )}

        <div>
          <strong>{currentSong.title}</strong>

          <p>{currentSong.artistNames.join(", ")}</p>
        </div>
      </div>

      {audioUrl && (
        <audio
          key={currentSong.id}
          src={audioUrl}
          controls
          autoPlay
          preload="metadata"
        />
      )}

      <button type="button" onClick={clearSong}>
        Fechar player
      </button>
    </footer>
  );
}

export default AppPlayer;
