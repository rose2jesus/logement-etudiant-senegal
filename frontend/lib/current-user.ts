import { getSessionToken } from './session';
import { apiFetch } from './api';

export interface CurrentUser {
  id: string;
  role: 'student' | 'owner' | 'admin';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// À utiliser dans les Server Components pour savoir qui est connecté (ou null).
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = getSessionToken();
  if (!token) return null;
  try {
    return await apiFetch<CurrentUser>('/auth/me', { token });
  } catch {
    return null;
  }
}
