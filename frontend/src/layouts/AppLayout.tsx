import { Outlet } from "react-router";

import AppHeader from "../components/AppHeader";
import AppPlayer from "../components/AppPlayer";
import AppSidebar from "../components/AppSidebar";
import { PlayerProvider } from "../contexts/PlayerProvider";

function AppLayout() {
  return (
    <PlayerProvider>
      <div>
        <AppHeader />

        <div>
          <AppSidebar />

          <main>
            <Outlet />
          </main>
        </div>

        <AppPlayer />
      </div>
    </PlayerProvider>
  );
}

export default AppLayout;
