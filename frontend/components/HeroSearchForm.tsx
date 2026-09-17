'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SearchIcon, MapPinIcon, HomeIcon } from '@/components/icons';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface City { id: string; name: string; }

export function HeroSearchForm() {
  const router = useRouter();
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/cities`).then((r) => r.json()).then(setCities).catch(() => setCities([]));
  }, []);

  function handleSubmit(formData: FormData) {
    const params = new URLSearchParams();
    const cityId = formData.get('cityId');
    const type = formData.get('type');
    const maxPrice = formData.get('maxPrice');
    if (cityId) params.set('cityId', String(cityId));
    if (type) params.set('type', String(type));
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    router.push(`/recherche?${params.toString()}`);
  }

  return (
    <form
      action={handleSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-1.5 rounded-[2rem] bg-white p-2 shadow-lift sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
        <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
        <select
          name="cityId"
          className="w-full min-w-0 border-0 bg-transparent text-sm font-medium text-neutral-900 focus:outline-none"
          defaultValue=""
        >
          <option value="">Toutes les villes</option>
          {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="hidden h-6 w-px bg-neutral-200 sm:block" />

      <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
        <HomeIcon className="h-4 w-4 shrink-0 text-primary" />
        <select
          name="type"
          className="w-full min-w-0 border-0 bg-transparent text-sm font-medium text-neutral-900 focus:outline-none"
          defaultValue=""
        >
          <option value="">Tous types</option>
          <option value="chambre_individuelle">Chambre individuelle</option>
          <option value="chambre_partagee">Chambre partagée</option>
          <option value="studio">Studio</option>
          <option value="appartement">Appartement</option>
          <option value="colocation">Colocation</option>
          <option value="residence">Résidence</option>
        </select>
      </div>

      <div className="hidden h-6 w-px bg-neutral-200 sm:block" />

      <input
        name="maxPrice"
        type="number"
        placeholder="Budget max (FCFA)"
        className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-4 py-2.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
      />

      <button
        type="submit"
        className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
      >
        <SearchIcon className="h-4 w-4" />
        Chercher
      </button>
    </form>
  );
}
