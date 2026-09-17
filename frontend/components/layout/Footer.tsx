import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-8 text-sm text-neutral-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} LogementÉtudiant Sénégal</p>
        <div className="flex gap-4">
          <Link href="/comment-ca-marche">Comment ça marche</Link>
          <Link href="/conseils-securite">Conseils sécurité</Link>
        </div>
      </div>
    </footer>
  );
}
