import { apiFetch } from '@/lib/api';
import { PropertyCard } from '@/components/annonces/PropertyCard';
import { FilterBar } from '@/components/annonces/FilterBar';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { SearchIcon } from '@/components/icons';
import Link from 'next/link';

interface SearchResult {
  items: any[];
  total: number;
  page: number;
  pageSize: number;
}

// Server Component : lit directement les searchParams de l'URL, pas besoin de state client
export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  let result: SearchResult = { items: [], total: 0, page: 1, pageSize: 12 };
  let error: string | null = null;
  try {
    result = await apiFetch<SearchResult>(`/properties?${params.toString()}`);
  } catch {
    error = "Impossible de charger les annonces pour le moment.";
  }

  const totalPages = Math.ceil(result.total / result.pageSize) || 1;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">Rechercher un logement</h1>
      <p className="mb-6 text-sm text-neutral-500">
        {result.total} logement{result.total > 1 ? 's' : ''} trouvé{result.total > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
        <aside>
          <FilterBar />
        </aside>

        <section>
          {error ? (
            <p className="text-danger">{error}</p>
          ) : result.items.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-6 w-6" />}
              title="Aucune annonce ne correspond à ta recherche"
              description="Essaie d'élargir tes critères (budget, ville, type de logement)."
              ctaLabel="Réinitialiser la recherche"
              ctaHref="/recherche"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {result.items.map((property, index) => (
                  <PropertyCard key={property.slug} property={property} index={index} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/recherche?${new URLSearchParams({ ...searchParams, page: String(p) } as any).toString()}`}
                      className={`rounded-button px-3.5 py-2 text-sm font-medium transition-colors ${
                        p === result.page
                          ? 'bg-primary text-white'
                          : 'border border-gray-200 text-neutral-500 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
