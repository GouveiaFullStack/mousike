import { Outlet } from "react-router";

import AppHeader from "../components/AppHeader";
import AppPlayer from "../components/AppPlayer";
import AppSidebar from "../components/AppSidebar";

import { LibraryProvider } from "../contexts/LibraryProvider";
import { PlayerProvider } from "../contexts/PlayerProvider";
import { SocialProvider } from "../contexts/SocialProvider";

function AppLayout() {
  return (
    <LibraryProvider>
      <SocialProvider>
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
      </SocialProvider>
    </LibraryProvider>
  );
}

export default AppLayout;
