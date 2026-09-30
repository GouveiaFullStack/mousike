import { Link, useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";

function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header>
      <Link to="/app">Mousiké</Link>

      <nav>
        <Link to="/app/publish">Publicar música</Link>
        <Link to="/app/profile">{user?.username}</Link>

        <button type="button" onClick={handleLogout}>
          Sair
        </button>
      </nav>
    </header>
  );
}

export default AppHeader;
