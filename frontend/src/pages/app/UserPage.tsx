import { useParams } from "react-router";

import FollowUserButton from "../../components/FollowUserButton";

import { useResourceById } from "../../hooks/useResourceById";

import { getMediaUrl } from "../../services/api";
import { getUser } from "../../services/profile.service";

function UserPage() {
  const { userId: userIdParam } = useParams();

  const userId = Number(userIdParam);

  const {
    data: profile,
    isLoading,
    isValidId,
    errorMessage,
  } = useResourceById(userId, getUser);

  if (!isValidId) {
    return <p>ID de usuário inválido.</p>;
  }

  if (isLoading) {
    return <p>Carregando usuário...</p>;
  }

  if (errorMessage) {
    return <p role="alert">{errorMessage}</p>;
  }

  if (!profile) {
    return null;
  }

  const imageUrl = getMediaUrl(profile.profileImageUrl);

  return (
    <section>
      <header>
        {imageUrl && (
          <img src={imageUrl} alt={profile.username} width="240" height="240" />
        )}

        <div>
          <p>Usuário</p>

          <h1>{profile.username}</h1>

          {profile.bio && <p>{profile.bio}</p>}

          <FollowUserButton userId={profile.id} />
        </div>
      </header>
    </section>
  );
}

export default UserPage;
