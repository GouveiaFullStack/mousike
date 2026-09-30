const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL não foi configurada");
}

const normalizedApiUrl = apiUrl.replace(/\/$/, "");

const tokenKey = "mousike_access_token";

export function getAccessToken() {
  return sessionStorage.getItem(tokenKey);
}

export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Sua sessão não está disponível.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export function getOptionalAuthHeaders(): HeadersInit {
  const token = getAccessToken();

  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getMediaUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedApiUrl}${normalizedPath}`;
}

export { normalizedApiUrl as apiUrl };
