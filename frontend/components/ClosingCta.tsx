import Link from 'next/link';
import { Blob } from '@/components/Blob';
import { HomeIcon } from '@/components/icons';

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary to-primary-dark px-8 py-10 text-white shadow-lift">
        <Blob className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 text-white/10" />
        <Blob className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 text-white/10" />
        <div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <HomeIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-bold">Prêt·e à trouver ton logement ?</h2>
              <p className="text-sm text-white/80">Rejoins les étudiants qui ont déjà trouvé leur chambre.</p>
            </div>
          </div>
          <Link
            href="/recherche"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            Commencer →
          </Link>
        </div>
      </div>
    </section>
  );
}
