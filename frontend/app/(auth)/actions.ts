'use server';

import { redirect } from 'next/navigation';
import { apiFetch, ApiError } from '@/lib/api';
import { setSessionCookie } from '@/lib/session';

export type FormState = { error?: string } | undefined;

interface AuthResponse {
  accessToken: string;
  user: { id: string; role: 'student' | 'owner' | 'admin'; firstName: string; email: string };
}

export async function registerAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const role = formData.get('role') as string;

  const payload: Record<string, unknown> = {
    role,
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    password: formData.get('password'),
  };

  if (role === 'student') {
    payload.institutionId = formData.get('institutionId');
    payload.cityId = formData.get('cityId');
  }

  try {
    const data = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSessionCookie(data.accessToken);
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: "Erreur d'inscription, réessaie plus tard" };
  }

  redirect(role === 'owner' ? '/proprietaire/dashboard' : '/etudiant/dashboard');
}

export async function loginAction(_prevState: FormState, formData: FormData): Promise<FormState> {
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  let user: AuthResponse['user'];
  try {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setSessionCookie(data.accessToken);
    user = data.user;
  } catch (err) {
    if (err instanceof ApiError) return { error: err.message };
    return { error: 'Erreur de connexion, réessaie plus tard' };
  }

  const requestedRedirect = formData.get('redirect');
  const redirectPath =
    typeof requestedRedirect === 'string' && requestedRedirect.startsWith('/') && !requestedRedirect.startsWith('//')
      ? requestedRedirect
      : user.role === 'admin'
        ? '/admin/dashboard'
        : user.role === 'owner'
          ? '/proprietaire/dashboard'
          : '/etudiant/dashboard';

  redirect(redirectPath);
}
