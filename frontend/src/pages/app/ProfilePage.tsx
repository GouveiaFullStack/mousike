import { useState, type ChangeEvent, type FormEvent } from "react";

import { useAuth } from "../../hooks/useAuth";
import { useLibrary } from "../../hooks/useLibrary";
import { useSocial } from "../../hooks/useSocial";

import { getMediaUrl } from "../../services/api";

import {
  removeProfileImage,
  updateProfile,
  uploadProfileImage,
} from "../../services/profile.service";

function ProfilePage() {
  const { user, updateUser } = useAuth();

  const { favorites, playlists } = useLibrary();

  const { followedArtists, followedUsers } = useSocial();

  const [username, setUsername] = useState(user?.username ?? "");

  const [bio, setBio] = useState(user?.bio ?? "");

  const [isSaving, setIsSaving] = useState(false);

  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  if (!user) {
    return null;
  }

  const currentUser = user;

  const imageUrl = getMediaUrl(currentUser.profileImageUrl);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setIsSaving(true);

    try {
      const updatedUser = await updateProfile(currentUser.id, {
        username: username.trim(),

        bio: bio.trim() || null,
      });

      updateUser(updatedUser);

      setSuccessMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o perfil.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsUpdatingImage(true);

    try {
      const updatedUser = await uploadProfileImage(file);

      updateUser(updatedUser);

      setSuccessMessage("Foto de perfil atualizada.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a foto.",
      );
    } finally {
      setIsUpdatingImage(false);

      event.target.value = "";
    }
  }

  async function handleRemoveImage() {
    setErrorMessage("");
    setSuccessMessage("");
    setIsUpdatingImage(true);

    try {
      await removeProfileImage();

      updateUser({
        ...currentUser,
        profileImageUrl: null,
      });

      setSuccessMessage("Foto de perfil removida.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Não foi possível remover a foto.",
      );
    } finally {
      setIsUpdatingImage(false);
    }
  }

  return (
    <section>
      <header>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={currentUser.username}
            width="240"
            height="240"
          />
        )}

        <div>
          <h1>{currentUser.username}</h1>

          <p>{currentUser.email}</p>
        </div>
      </header>

      <section>
        <h2>Foto de perfil</h2>

        <label>
          Selecionar imagem
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            disabled={isUpdatingImage}
          />
        </label>

        {currentUser.profileImageUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isUpdatingImage}
          >
            Remover foto
          </button>
        )}
      </section>

      <section>
        <h2>Editar perfil</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nome de usuário</label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              disabled={isSaving}
              required
            />
          </div>

          <div>
            <label htmlFor="bio">Bio</label>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              disabled={isSaving}
            />
          </div>

          <button type="submit" disabled={isSaving || !username.trim()}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </section>

      {errorMessage && <p role="alert">{errorMessage}</p>}

      {successMessage && <p role="status">{successMessage}</p>}

      <section>
        <h2>Sua atividade</h2>

        <p>{favorites.length} músicas favoritas</p>

        <p>{playlists.length} playlists</p>

        <p>{followedArtists.length} artistas seguidos</p>

        <p>{followedUsers.length} usuários seguidos</p>
      </section>
    </section>
  );
}

export default ProfilePage;
