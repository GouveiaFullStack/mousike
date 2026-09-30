import { useParams } from "react-router";

function UserPage() {
  const { userId } = useParams();

  return (
    <section>
      <h1>Perfil de usuário</h1>

      <p>ID do usuário: {userId}</p>
    </section>
  );
}

export default UserPage;
