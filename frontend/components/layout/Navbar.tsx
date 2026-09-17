import Link from 'next/link';
import { getCurrentUser } from '@/lib/current-user';
import { LogoutButton } from './LogoutButton';

export async function Navbar() {
  const user = await getCurrentUser();

  const dashboardHref =
    user?.role === 'owner' ? '/proprietaire/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/etudiant/dashboard';

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="font-heading text-xl font-extrabold text-neutral-900">
          Logement<span className="text-primary">Étudiant</span>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link href="/recherche" className="hidden font-medium text-neutral-900 sm:inline">Rechercher</Link>
          <Link href="/comment-ca-marche" className="hidden font-medium text-neutral-900 sm:inline">Comment ça marche</Link>

          {user ? (
            <>
              <Link href={dashboardHref} className="font-semibold text-primary">Mon espace</Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/connexion" className="font-medium text-neutral-900">Connexion</Link>
              <Link
                href="/inscription"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
