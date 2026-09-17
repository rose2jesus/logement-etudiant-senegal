import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/current-user';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';
import { deletePropertyAction } from './actions';
import { PromotionForm } from './PromotionForm';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { HomeIcon, ClockIcon, InboxIcon, PlusCircleIcon } from '@/components/icons';

interface OwnerProperty {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'expired';
  price: number;
  pricePeriod: string;
  rejectionReason?: string | null;
  images: { url: string }[];
  city: { name: string };
  _count: { contactRequests: number };
  promotedUntil?: string | null;
}

export default async function ProprietaireDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role !== 'owner') redirect('/');

  const properties = await apiFetch<OwnerProperty[]>('/properties/mine', {
    token: getSessionToken(),
  }).catch(() => []);

  const counts = {
    active: properties.filter((p) => p.status === 'approved').length,
    pending: properties.filter((p) => p.status === 'pending').length,
    demandes: properties.reduce((sum, p) => sum + (p._count?.contactRequests ?? 0), 0),
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-4xl px-4 py-8">
      <DashboardHeader
        firstName={user.firstName}
        subtitle="Gère tes annonces et suis tes demandes reçues"
        action={
          <Link
            href="/proprietaire/annonces/nouvelle"
            className="flex items-center gap-2 rounded-button bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
          >
            <PlusCircleIcon className="h-4 w-4" />
            Nouvelle annonce
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={<HomeIcon className="h-5 w-5" />} label="Annonces actives" value={counts.active} />
        <StatCard icon={<ClockIcon className="h-5 w-5" />} label="En attente" value={counts.pending} />
        <StatCard icon={<InboxIcon className="h-5 w-5" />} label="Demandes reçues" value={counts.demandes} />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-bold text-neutral-900">Mes annonces</h2>

      {properties.length === 0 ? (
        <EmptyState
          icon={<HomeIcon className="h-6 w-6" />}
          title="Aucune annonce publiée"
          description="Publie ton premier logement pour commencer à recevoir des demandes d'étudiants."
          ctaLabel="Publier une annonce"
          ctaHref="/proprietaire/annonces/nouvelle"
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {properties.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-card border border-neutral-200 bg-white shadow-soft">
              <div className="flex gap-3 p-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-button bg-gray-100">
                  {p.images[0] && (
                    <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <StatusBadge status={p.status} />
                  <p className="mt-1 truncate font-medium text-neutral-900">{p.title}</p>
                  <p className="text-sm text-neutral-500">
                    {p.price.toLocaleString('fr-FR')} FCFA / {p.pricePeriod} · {p.city.name}
                  </p>
                  {p.status === 'rejected' && p.rejectionReason && (
                    <p className="mt-1 text-xs text-danger">Motif : {p.rejectionReason}</p>
                  )}
                </div>
                <form action={deletePropertyAction.bind(null, p.id)} className="shrink-0">
                  <button type="submit" className="text-sm text-danger hover:underline">
                    Supprimer
                  </button>
                </form>
              </div>
              {p.status === 'approved' && (
                <div className="border-t border-neutral-900/10 bg-secondary/5 px-4 py-3">
                  <PromotionForm propertyId={p.id} promotedUntil={p.promotedUntil} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 text-xs text-neutral-400">
        La modification d&apos;une annonce existante n&apos;est pas encore implémentée — supprime et
        recrée l&apos;annonce en attendant.
      </p>
      </main>
    </div>
  );
}
