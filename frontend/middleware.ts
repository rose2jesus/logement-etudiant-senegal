import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/etudiant', '/proprietaire', '/admin'];

// Vérifie uniquement la présence du cookie ici (léger, exécuté sur chaque requête).
// Le contrôle fin du rôle (student/owner/admin) est fait côté page via getCurrentUser(),
// car décoder le JWT proprement nécessiterait une dépendance supplémentaire dans le middleware Edge.
export function middleware(request: NextRequest) {
  const isProtected = PROTECTED_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('session_token');
  if (!token) {
    const loginUrl = new URL('/connexion', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/etudiant/:path*', '/proprietaire/:path*', '/admin/:path*'],
};
