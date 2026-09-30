import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../hooks/useAuth";
import { login } from "../../services/auth.service";

function LoginPage() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setErrorMessage("Preencha o email e a senha.");
      return;
    }

    setIsLoading(true);

    try {
      const session = await login({
        email: normalizedEmail,
        password,
      });

      setSession(session);

      navigate("/app", { replace: true });
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
        <header>
          <Link to="/">Mousiké</Link>

          <h1>Entrar na sua conta</h1>

          <p>
            Entre para continuar ouvindo, descobrindo e compartilhando música.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrorMessage("");
              }}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrorMessage("");
              }}
              disabled={isLoading}
              required
            />
          </div>

          {errorMessage && (
            <p role="alert" aria-live="polite">
              {errorMessage}
            </p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <footer>
          <p>
            Ainda não tem uma conta? <Link to="/register">Criar conta</Link>
          </p>

          <Link to="/">Voltar para a página inicial</Link>
        </footer>
      </section>
    </main>
  );
}

export default LoginPage;
