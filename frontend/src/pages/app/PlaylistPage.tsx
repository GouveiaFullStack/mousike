import { useParams } from "react-router";

function PlaylistPage() {
  const { playlistId } = useParams();

  return (
    <section>
      <h1>Playlist</h1>

      <p>ID da playlist: {playlistId}</p>
    </section>
  );
}

export default PlaylistPage;
