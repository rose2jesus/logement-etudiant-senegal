'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const TYPES = [
  { value: '', label: 'Tous types' },
  { value: 'chambre_individuelle', label: 'Chambre individuelle' },
  { value: 'chambre_partagee', label: 'Chambre partagée' },
  { value: 'studio', label: 'Studio' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'colocation', label: 'Colocation' },
  { value: 'residence', label: 'Résidence' },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get('type') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [furnished, setFurnished] = useState(searchParams.get('furnished') === 'true');
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'recent');

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value: string) =>
      value ? params.set(key, value) : params.delete(key);

    setOrDelete('type', type);
    setOrDelete('minPrice', minPrice);
    setOrDelete('maxPrice', maxPrice);
    setOrDelete('furnished', furnished ? 'true' : '');
    setOrDelete('sort', sort);
    params.set('page', '1');

    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-card border border-neutral-200 bg-white p-4 shadow-soft">
      <div>
        <label className="text-sm font-medium text-neutral-900">Type de logement</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 w-full rounded-button border border-gray-300 p-2.5"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-neutral-900">Prix min</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="mt-1 w-full rounded-button border border-gray-300 p-2.5"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-neutral-900">Prix max</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="mt-1 w-full rounded-button border border-gray-300 p-2.5"
            placeholder="200000"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-neutral-900">
        <input type="checkbox" checked={furnished} onChange={(e) => setFurnished(e.target.checked)} />
        Meublé uniquement
      </label>

      <div>
        <label className="text-sm font-medium text-neutral-900">Trier par</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mt-1 w-full rounded-button border border-gray-300 p-2.5"
        >
          <option value="recent">Plus récent</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>

      <Button onClick={applyFilters}>Appliquer les filtres</Button>
    </div>
  );
}
