import { useAuth } from "../../hooks/useAuth";

function ProfilePage() {
  const { user } = useAuth();

  return (
    <section>
      <h1>{user?.username}</h1>

      <p>{user?.email}</p>

      <p>{user?.bio ?? "Nenhuma bio adicionada."}</p>
    </section>
  );
}

export default ProfilePage;
