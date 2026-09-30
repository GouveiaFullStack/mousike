const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL não foi configurada");
}

const normalizedApiUrl = apiUrl.replace(/\/$/, "");

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
