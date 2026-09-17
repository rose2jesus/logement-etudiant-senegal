import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/current-user';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';
import { removeFavoriteAction } from './actions';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { HeartIcon } from '@/components/icons';

interface FavoriteItem {
  propertyId: string;
  property: {
    slug: string;
    title: string;
    price: number;
    pricePeriod: string;
    images: { url: string }[];
    city: { name: string };
  };
}

export default async function FavorisPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role !== 'student') redirect('/');

  const favorites = await apiFetch<FavoriteItem[]>('/favorites', { token: getSessionToken() }).catch(
    () => [],
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-neutral-900">
        <HeartIcon className="h-6 w-6 text-danger" /> Mes favoris
      </h1>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<HeartIcon className="h-6 w-6" />}
          title="Aucun favori pour l'instant"
          description="Ajoute des annonces à tes favoris pendant ta recherche pour les retrouver ici facilement."
          ctaLabel="Chercher un logement"
          ctaHref="/recherche"
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {favorites.map((fav) => (
            <li
              key={fav.propertyId}
              className="flex items-center gap-4 rounded-card border border-neutral-200 bg-white p-4 shadow-soft"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-button bg-gray-100">
                {fav.property.images[0] && (
                  <Image src={fav.property.images[0].url} alt={fav.property.title} fill className="object-cover" />
                )}
              </div>
              <Link href={`/logement/${fav.property.slug}`} className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900">{fav.property.title}</p>
                <p className="text-sm text-neutral-500">
                  {fav.property.price.toLocaleString('fr-FR')} FCFA / {fav.property.pricePeriod} ·{' '}
                  {fav.property.city.name}
                </p>
              </Link>
              <form action={removeFavoriteAction.bind(null, fav.propertyId)}>
                <button type="submit" className="text-sm text-danger hover:underline" aria-label="Retirer des favoris">
                  Retirer
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
