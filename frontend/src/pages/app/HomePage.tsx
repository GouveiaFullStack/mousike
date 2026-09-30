import { useAuth } from "../../hooks/useAuth";

function HomePage() {
  const { user } = useAuth();

  return (
    <section>
      <h1>Início</h1>

      <p>Bem-vindo, {user?.username}!</p>

      <p>Esta será a Home personalizada da Mousiké.</p>
    </section>
  );
}

export default HomePage;
