import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} LogementÉtudiant Sénégal</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          <Link href="/comment-ca-marche">Comment ça marche</Link>
          <Link href="/conseils-securite">Conseils sécurité</Link>
          <Link href="/cgu">CGU</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/mentions-legales">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}
