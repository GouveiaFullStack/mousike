import { Route, Routes } from "react-router";

import AppLayout from "../layouts/AppLayout";
import LandingLayout from "../layouts/LandingLayout";

import AlbumPage from "../pages/app/AlbumPage";
import ArtistPage from "../pages/app/ArtistPage";
import HomePage from "../pages/app/HomePage";
import LibraryPage from "../pages/app/LibraryPage";
import PlaylistPage from "../pages/app/PlaylistPage";
import ProfilePage from "../pages/app/ProfilePage";
import PublishPage from "../pages/app/PublishPage";
import SearchPage from "../pages/app/SearchPage";
import UserPage from "../pages/app/UserPage";
import SongPage from "../pages/app/SongPage";
import HistoryPage from "../pages/app/HistoryPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import LandingPage from "../pages/landing/LandingPage";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingLayout>
            <LandingPage />
          </LandingLayout>
        }
      />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />

        <Route path="search" element={<SearchPage />} />

        <Route path="history" element={<HistoryPage />} />

        <Route path="library" element={<LibraryPage />} />

        <Route path="profile" element={<ProfilePage />} />

        <Route path="publish" element={<PublishPage />} />

        <Route path="artists/:artistId" element={<ArtistPage />} />

        <Route path="albums/:albumId" element={<AlbumPage />} />

        <Route path="playlists/:playlistId" element={<PlaylistPage />} />

        <Route path="users/:userId" element={<UserPage />} />

        <Route path="songs/:songId" element={<SongPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
