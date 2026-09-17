import { cookies } from 'next/headers';

const SESSION_COOKIE = 'session_token';

// Appelé uniquement depuis des Server Actions ou Route Handlers
export function setSessionCookie(token: string) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true, // inaccessible en JS côté client → protège contre le vol de token via XSS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 jours, aligné sur JWT_EXPIRES_IN du backend
  });
}

export function getSessionToken(): string | undefined {
  return cookies().get(SESSION_COOKIE)?.value;
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}
