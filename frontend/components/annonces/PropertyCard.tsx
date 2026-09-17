import Link from 'next/link';
import Image from 'next/image';
import { WifiIcon, DropletIcon, BoltIcon, SnowflakeIcon, UtensilsIcon, CarIcon, ShieldIcon, BathIcon, MapPinIcon } from '@/components/icons';

const TYPE_LABELS: Record<string, string> = {
  chambre_individuelle: 'Chambre individuelle',
  chambre_partagee: 'Chambre partagée',
  studio: 'Studio',
  appartement: 'Appartement',
  colocation: 'Colocation',
  residence: 'Résidence',
};

const FEATURE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: WifiIcon,
  eau: DropletIcon,
  electricite: BoltIcon,
  climatisation: SnowflakeIcon,
  cuisine: UtensilsIcon,
  parking: CarIcon,
  securite: ShieldIcon,
  salle_de_bain_privee: BathIcon,
};

interface PropertyCardProps {
  property: {
    slug: string;
    title: string;
    price: number;
    pricePeriod: string;
    type: string;
    distanceKm?: number | null;
    images: { url: string }[];
    city: { name: string };
    neighborhood?: { name: string } | null;
    institution?: { name: string } | null;
    features: { featureKey: string }[];
    createdAt?: string;
    isPromoted?: boolean;
  };
  index?: number;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const topFeatures = property.features.slice(0, 4);
  const isNew =
    property.createdAt && Date.now() - new Date(property.createdAt).getTime() < 1000 * 60 * 60 * 24 * 10;

  return (
    <Link
      href={`/logement/${property.slug}`}
      className={`group relative block overflow-hidden rounded-card bg-white shadow-soft transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lift ${property.isPromoted ? 'ring-2 ring-secondary/60' : ''}`}
    >
      {property.isPromoted && (
        <span className="absolute -left-2 -top-2 z-10 -rotate-6 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">
          ⭐ Sponsorisé
        </span>
      )}
      {isNew && (
        <span className="absolute -right-2 -top-2 z-10 rotate-6 rounded-full bg-gradient-to-br from-primary to-primary-dark px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-white shadow-soft">
          ✨ Nouveau
        </span>
      )}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {property.images[0] && (
          <Image
            src={property.images[0].url}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-neutral-900 shadow-soft backdrop-blur">
          {TYPE_LABELS[property.type] ?? property.type}
        </span>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-primary shadow-soft backdrop-blur">
          ♥
        </span>
        {property.institution && property.distanceKm != null && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-neutral-900/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            <MapPinIcon className="h-3 w-3" />
            {property.distanceKm} km
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="font-mono text-lg font-bold text-primary">
          {property.price.toLocaleString('fr-FR')}
          <span className="text-xs font-normal text-neutral-500"> FCFA / {property.pricePeriod}</span>
        </p>
        <p className="mt-1 truncate font-heading text-sm font-bold text-neutral-900">
          {property.neighborhood?.name ?? ''} {property.neighborhood ? '·' : ''} {property.city.name}
        </p>
        {property.institution && (
          <p className="truncate text-xs text-neutral-500">Proche de {property.institution.name}</p>
        )}

        {topFeatures.length > 0 && (
          <div className="mt-3 flex items-center gap-2.5 border-t border-neutral-200 pt-3">
            {topFeatures.map((f) => {
              const Icon = FEATURE_ICONS[f.featureKey];
              return Icon ? (
                <span key={f.featureKey} className="text-neutral-400" title={f.featureKey}>
                  <Icon className="h-4 w-4" />
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
