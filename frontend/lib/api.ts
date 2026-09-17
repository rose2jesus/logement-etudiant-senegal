const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

// Wrapper fetch générique : centralise la gestion d'erreur pour toute l'app.
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Le backend renvoie { message, statusCode } en cas d'erreur NestJS
    const message = data?.message || 'Une erreur est survenue';
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, res.status);
  }

  return data as T;
}
