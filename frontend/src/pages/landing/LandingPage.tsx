import { useState, type FormEvent } from "react";
import { Link } from "react-router";

import { login } from "../../services/auth.service";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const result = await login({
        email,
        password,
      });

      sessionStorage.setItem("mousike_access_token", result.token);

      setSuccessMessage(`Bem-vindo, ${result.user.username}!`);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Não foi possível entrar na sua conta.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <section>
        <h1>Entrar na Mousiké</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {errorMessage && <p>{errorMessage}</p>}

          {successMessage && <p>{successMessage}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p>
          Ainda não tem uma conta? <Link to="/register">Criar conta</Link>
        </p>

        <Link to="/">Voltar para a página inicial</Link>
      </section>
    </main>
  );
}

export default LoginPage;
