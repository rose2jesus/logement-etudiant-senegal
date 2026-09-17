'use client';

import { useEffect, useState, useTransition } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUploader } from '@/components/annonces/ImageUploader';
import { createPropertyAction } from './actions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const TYPES = [
  ['chambre_individuelle', 'Chambre individuelle'],
  ['chambre_partagee', 'Chambre partagée'],
  ['studio', 'Studio'],
  ['appartement', 'Appartement'],
  ['colocation', 'Colocation'],
  ['residence', 'Résidence universitaire'],
];

const FEATURES = [
  ['wifi', 'Wi-Fi'],
  ['eau', 'Eau'],
  ['electricite', 'Électricité'],
  ['climatisation', 'Climatisation'],
  ['cuisine', 'Cuisine'],
  ['parking', 'Parking'],
  ['securite', 'Sécurité'],
  ['salle_de_bain_privee', 'Salle de bain privée'],
];

interface City { id: string; name: string; }
interface Institution { id: string; name: string; }

export default function NouvelleAnnoncePage() {
  const [cities, setCities] = useState<City[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [cityId, setCityId] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    fetch(`${API_URL}/cities`).then((r) => r.json()).then(setCities).catch(() => setCities([]));
  }, []);

  useEffect(() => {
    if (!cityId) { setInstitutions([]); return; }
    fetch(`${API_URL}/institutions?cityId=${cityId}`)
      .then((r) => r.json())
      .then(setInstitutions)
      .catch(() => setInstitutions([]));
  }, [cityId]);

  function toggleFeature(key: string) {
    setFeatures((prev) => (prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]));
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    const payload = {
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      type: String(formData.get('type')),
      cityId,
      neighborhoodId: undefined, // à activer une fois le module quartiers relié au formulaire
      institutionId: String(formData.get('institutionId') || '') || undefined,
      price: Number(formData.get('price')),
      pricePeriod: String(formData.get('pricePeriod')),
      deposit: formData.get('deposit') ? Number(formData.get('deposit')) : undefined,
      furnished: formData.get('furnished') === 'on',
      capacity: Number(formData.get('capacity') || 1),
      minDurationMonths: formData.get('minDurationMonths')
        ? Number(formData.get('minDurationMonths'))
        : undefined,
      availableFrom: String(formData.get('availableFrom') || '') || undefined,
      features,
      images,
    };

    startTransition(async () => {
      const result = await createPropertyAction(payload);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900">Publier une annonce</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Ton annonce sera vérifiée par un administrateur avant d&apos;être visible publiquement.
      </p>

      <form action={handleSubmit} className="flex flex-col gap-5">
        <Input label="Titre" name="title" required minLength={5} placeholder="Chambre meublée proche UCAD" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-900">Description</label>
          <textarea
            name="description"
            required
            minLength={20}
            rows={4}
            className="rounded-button border border-gray-300 px-4 py-2.5 text-base focus:border-primary focus:outline-none"
            placeholder="Décris le logement, son environnement, ses conditions..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-900">Type de logement</label>
          <select name="type" required className="rounded-button border border-gray-300 px-4 py-2.5">
            {TYPES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Ville</label>
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              required
              className="rounded-button border border-gray-300 px-4 py-2.5"
            >
              <option value="">Choisir...</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Établissement proche</label>
            <select
              name="institutionId"
              disabled={!cityId}
              className="rounded-button border border-gray-300 px-4 py-2.5 disabled:bg-gray-50"
            >
              <option value="">Aucun / non précisé</option>
              {institutions.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Prix (FCFA)" name="price" type="number" required min={1000} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-900">Périodicité</label>
            <select name="pricePeriod" required className="rounded-button border border-gray-300 px-4 py-2.5">
              <option value="mois">Par mois</option>
              <option value="trimestre">Par trimestre</option>
              <option value="annee">Par année</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Caution (FCFA, optionnel)" name="deposit" type="number" min={0} />
          <Input label="Capacité (personnes)" name="capacity" type="number" min={1} defaultValue={1} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Durée min. (mois, optionnel)" name="minDurationMonths" type="number" min={1} />
          <Input label="Disponible à partir du" name="availableFrom" type="date" />
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-900">
          <input type="checkbox" name="furnished" className="h-4 w-4" />
          Logement meublé
        </label>

        <div>
          <label className="text-sm font-medium text-neutral-900">Équipements</label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FEATURES.map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm text-neutral-900">
                <input
                  type="checkbox"
                  checked={features.includes(key)}
                  onChange={() => toggleFeature(key)}
                  className="h-4 w-4"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <ImageUploader images={images} onChange={setImages} />

        {error && <p role="alert" className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={pending}>
          {pending ? 'Publication en cours...' : "Soumettre l'annonce"}
        </Button>
      </form>
    </main>
  );
}
