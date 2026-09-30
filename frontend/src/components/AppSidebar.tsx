import { NavLink } from "react-router";

function AppSidebar() {
  return (
    <aside>
      <nav>
        <NavLink to="/app" end>
          Início
        </NavLink>

        <NavLink to="/app/search">Buscar</NavLink>

        <NavLink to="/app/library">Biblioteca</NavLink>

        <NavLink to="/app/history">Histórico</NavLink>

        <NavLink to="/app/profile">Perfil</NavLink>
      </nav>
    </aside>
  );
}

export default AppSidebar;
