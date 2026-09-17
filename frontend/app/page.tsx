import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { PropertyCard } from '@/components/annonces/PropertyCard';
import { HeroSearchForm } from '@/components/HeroSearchForm';
import { TrustStrip } from '@/components/TrustStrip';
import { ClosingCta } from '@/components/ClosingCta';
import { Blob } from '@/components/Blob';
import { SearchIcon, CheckCircleIcon, InboxIcon, MapPinIcon, HomeIcon } from '@/components/icons';

const STEPS = [
  { icon: SearchIcon, label: 'Rechercher', desc: 'Filtre par ville, budget, établissement' },
  { icon: CheckCircleIcon, label: 'Comparer', desc: 'Compare les annonces vérifiées' },
  { icon: InboxIcon, label: 'Contacter', desc: 'Écris directement au propriétaire' },
  { icon: MapPinIcon, label: 'Visiter', desc: 'Visite avant de t\u2019engager' },
  { icon: HomeIcon, label: 'Louer', desc: 'Emménage en toute confiance' },
];

export default async function HomePage() {
  let featured: any[] = [];
  try {
    const result = await apiFetch<{ items: any[] }>('/properties?sort=recent&pageSize=3');
    featured = result.items;
  } catch {
    featured = [];
  }

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden px-4 pb-24 pt-16">
        <Blob className="pointer-events-none absolute -left-24 -top-10 h-80 w-80 text-primary/15" />
        <Blob className="pointer-events-none absolute -right-20 top-20 h-64 w-64 text-secondary/25" />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-neutral-900 shadow-soft">
            🇸🇳 Fait pour les étudiants du Sénégal
          </span>
          <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.15] text-neutral-900 md:text-5xl">
            Ton logement étudiant,<br />
            sans la <span className="text-primary">prise de tête</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-neutral-500">
            Chambres, studios et colocations proches de ton établissement. Vérifiées, simples, sans arnaque.
          </p>

          <div className="mt-8">
            <HeroSearchForm />
          </div>

          <div className="mt-6 flex justify-center">
            <Link href="/inscription" className="text-sm font-medium text-neutral-500 hover:text-primary">
              Propriétaire ? Publie ton logement →
            </Link>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="font-heading text-2xl font-semibold text-neutral-900">Comment ça marche ?</h2>
          <div className="relative mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-5">
            <div className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden border-t-2 border-dashed border-primary/25 sm:block" />
            {STEPS.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} className="relative flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="font-mono text-[10px] font-bold text-primary">0{i + 1}</span>
                <p className="font-heading text-sm font-semibold text-neutral-900">{label}</p>
                <p className="text-xs text-neutral-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANNONCES RECOMMANDÉES */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl font-semibold text-neutral-900">Logements recommandés</h2>
            <Link href="/recherche" className="text-sm font-semibold text-primary hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((property, index) => (
              <PropertyCard key={property.slug} property={property} index={index} />
            ))}
          </div>
        </section>
      )}

      <ClosingCta />
    </main>
  );
}
