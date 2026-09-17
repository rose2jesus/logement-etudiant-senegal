import Image from 'next/image';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { getSessionToken } from '@/lib/session';
import { getCurrentUser } from '@/lib/current-user';
import { ContactForm } from '@/components/annonces/ContactForm';
import { PropertyActions } from '@/components/annonces/PropertyActions';
import { PropertyLocationMapLoader } from '@/components/annonces/PropertyLocationMapLoader';

const TYPE_LABELS: Record<string, string> = {
  chambre_individuelle: 'Chambre individuelle',
  chambre_partagee: 'Chambre partagée',
  studio: 'Studio',
  appartement: 'Appartement',
  colocation: 'Colocation',
  residence: 'Résidence',
};

export default async function PropertyDetailPage({ params }: { params: { slug: string } }) {
  let property: any;
  try {
    property = await apiFetch(`/properties/${params.slug}`, { token: getSessionToken() });
  } catch {
    notFound();
  }
  const user = await getCurrentUser();

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par votre annonce "${property.title}" sur la plateforme.`,
  );
  // NOTE: le numéro du propriétaire n'est volontairement pas exposé publiquement dans property
  // (section 8 du cahier des charges). Le lien WhatsApp nécessite que le backend expose un
  // champ dédié "contactPhone" une fois la vérification de confidentialité ajoutée — pour le MVP,
  // le bouton renvoie donc vers le formulaire de contact interne.

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {property.status !== 'approved' && (
        <div className="mb-4 rounded-button bg-warning/10 p-3 text-sm text-warning">
          Cette annonce n'est pas encore visible publiquement (statut : {property.status}).
        </div>
      )}

      {/* Galerie simple en grille (carousel possible en amélioration future) */}
      <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-card sm:grid-cols-4">
        {property.images.map((img: any, i: number) => (
          <div key={img.id} className={`relative aspect-square ${i === 0 ? 'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2' : ''}`}>
            <Image src={img.url} alt={property.title} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <p className="text-sm font-medium text-neutral-500">{TYPE_LABELS[property.type]}</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">{property.title}</h1>
          <p className="mt-2 text-2xl font-bold text-primary">
            {property.price.toLocaleString('fr-FR')} FCFA / {property.pricePeriod}
          </p>
          <p className="mt-1 text-neutral-500">
            {property.neighborhood?.name}, {property.city.name}
            {property.institution && property.distanceKm != null &&
              ` · À ~${property.distanceKm} km de ${property.institution.name}`}
          </p>

          <section className="mt-6">
            <h2 className="mb-2 font-bold text-neutral-900">Description</h2>
            <p className="whitespace-pre-line text-neutral-900">{property.description}</p>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-bold text-neutral-900">Équipements</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {property.features.map((f: any) => (
                <li key={f.id}>✓ {f.featureKey}</li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 font-bold text-neutral-900">Conditions</h2>
            <ul className="text-sm text-neutral-900">
              {property.deposit && <li>Caution : {property.deposit.toLocaleString('fr-FR')} FCFA</li>}
              {property.minDurationMonths && <li>Durée minimale : {property.minDurationMonths} mois</li>}
              {property.availableFrom && (
                <li>Disponible dès : {new Date(property.availableFrom).toLocaleDateString('fr-FR')}</li>
              )}
              <li>Meublé : {property.furnished ? 'Oui' : 'Non'}</li>
            </ul>
          </section>

          {property.institution?.latitude && property.institution?.longitude && property.distanceKm != null && (
            <section className="mt-6">
              <h2 className="mb-2 font-bold text-neutral-900">Localisation</h2>
              <PropertyLocationMapLoader
                institutionName={property.institution.name}
                institutionLat={Number(property.institution.latitude)}
                institutionLng={Number(property.institution.longitude)}
                distanceKm={Number(property.distanceKm)}
              />
            </section>
          )}

          <p className="mt-6 rounded-button bg-neutral-100 p-3 text-sm text-neutral-900">
            ⚠ Ne verse jamais d'argent avant d'avoir visité le logement et vérifié l'identité du propriétaire.
            Consulte nos <a href="/conseils-securite" className="underline">conseils sécurité</a>.
          </p>
        </div>

        <aside className="h-fit rounded-card border border-neutral-200 p-4 shadow-soft">
          <p className="mb-1 text-sm text-neutral-500">Publié par</p>
          <p className="mb-4 font-medium text-neutral-900">{property.owner.user.firstName}</p>
          <div className="mb-4">
            <PropertyActions propertyId={property.id} isLoggedIn={!!user} />
          </div>
          <ContactForm propertyId={property.id} />
        </aside>
      </div>
    </main>
  );
}
