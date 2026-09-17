'use client';

import dynamic from 'next/dynamic';

// ssr: false est nécessaire car Leaflet accède à `window` au chargement du module —
// ce composant intermédiaire est un Client Component pour que ce soit autorisé
// (impossible de faire ssr:false directement depuis un Server Component en App Router).
const PropertyLocationMap = dynamic(
  () => import('./PropertyLocationMap').then((m) => m.PropertyLocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[260px] items-center justify-center rounded-card bg-neutral-100 text-sm text-neutral-500">
        Chargement de la carte...
      </div>
    ),
  },
);

interface PropertyLocationMapLoaderProps {
  institutionName: string;
  institutionLat: number;
  institutionLng: number;
  distanceKm: number;
}

export function PropertyLocationMapLoader(props: PropertyLocationMapLoaderProps) {
  return <PropertyLocationMap {...props} />;
}
