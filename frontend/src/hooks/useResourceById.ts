import { useEffect, useState } from "react";

type ResourceState<T> = {
  id: number;
  data: T;
};

type ErrorState = {
  id: number;
  message: string;
};

export function useResourceById<T>(
  id: number,
  loader: (id: number) => Promise<T>,
) {
  const [resource, setResource] = useState<ResourceState<T> | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

  const isValidId = Number.isInteger(id) && id > 0;

  useEffect(() => {
    if (!isValidId) {
      return;
    }

    let cancelled = false;

    async function loadResource() {
      try {
        const data = await loader(id);

        if (!cancelled) {
          setResource({
            id,
            data,
          });

          setError(null);
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        setError({
          id,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível carregar este conteúdo.",
        });
      }
    }

    loadResource();

    return () => {
      cancelled = true;
    };
  }, [id, isValidId, loader]);

  const data = resource?.id === id ? resource.data : null;

  const errorMessage = error?.id === id ? error.message : "";

  const isLoading = isValidId && data === null && !errorMessage;

  return {
    data,
    isLoading,
    isValidId,
    errorMessage,
  };
}
