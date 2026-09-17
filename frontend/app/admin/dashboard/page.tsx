import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/current-user';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';
import { approvePropertyAction, rejectPropertyAction } from './actions';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { UsersIcon, HomeIcon, ClockIcon, FlagIcon, CheckCircleIcon, XCircleIcon } from '@/components/icons';

interface Stats {
  totalUsers: number;
  totalStudents: number;
  totalOwners: number;
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  openReports: number;
}

interface PendingProperty {
  id: string;
  title: string;
  price: number;
  pricePeriod: string;
  images: { url: string }[];
  city: { name: string };
  owner: { user: { firstName: string; lastName: string; phone: string } };
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role !== 'admin') redirect('/');

  const token = getSessionToken();
  const [stats, pending] = await Promise.all([
    apiFetch<Stats>('/admin/stats', { token }).catch(() => null),
    apiFetch<PendingProperty[]>('/properties/pending', { token }).catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <DashboardHeader firstName={user.firstName} subtitle="Vue d'ensemble et modération de la plateforme" />

        {stats && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon={<UsersIcon className="h-5 w-5" />} label="Utilisateurs" value={stats.totalUsers} />
            <StatCard icon={<HomeIcon className="h-5 w-5" />} label="Annonces" value={stats.totalProperties} />
            <StatCard icon={<ClockIcon className="h-5 w-5" />} label="En attente" value={stats.pendingProperties} />
            <Link href="/admin/signalements">
              <StatCard icon={<FlagIcon className="h-5 w-5" />} label="Signalements ouverts" value={stats.openReports} />
            </Link>
          </div>
        )}

        <h2 className="mb-3 mt-8 font-heading text-lg font-extrabold text-neutral-900">Annonces en attente</h2>

        {pending.length === 0 ? (
          <EmptyState
            icon={<CheckCircleIcon className="h-6 w-6" />}
            title="Aucune annonce en attente"
            description="Tout est à jour ! Les nouvelles annonces publiées apparaîtront ici pour modération."
          />
        ) : (
          <ul className="flex flex-col gap-4">
            {pending.map((p) => (
              <li key={p.id} className="overflow-hidden rounded-card border border-neutral-200 bg-white shadow-soft">
                <div className="flex gap-4 p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-button border border-neutral-200 bg-gray-100">
                    {p.images[0] && <Image src={p.images[0].url} alt={p.title} fill className="object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-warning">
                      <ClockIcon className="h-3.5 w-3.5" /> En attente
                    </span>
                    <p className="mt-1 truncate font-heading font-bold text-neutral-900">{p.title}</p>
                    <p className="text-sm text-neutral-500">
                      {p.price.toLocaleString('fr-FR')} FCFA / {p.pricePeriod} · {p.city.name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Par {p.owner.user.firstName} {p.owner.user.lastName} · {p.owner.user.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-neutral-200 bg-neutral-50 px-4 py-3">
                  <form action={approvePropertyAction.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-button border border-neutral-200 bg-success px-4 py-2 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <CheckCircleIcon className="h-4 w-4" /> Approuver
                    </button>
                  </form>
                  <form action={rejectPropertyAction.bind(null, p.id)} className="flex items-center gap-2">
                    <input
                      name="rejectionReason"
                      placeholder="Motif de rejet"
                      className="rounded-button border border-neutral-200 px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 rounded-button border border-neutral-200 bg-danger px-4 py-2 text-xs font-semibold text-white shadow-soft hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <XCircleIcon className="h-4 w-4" /> Rejeter
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-xs text-neutral-500">
          Gestion des utilisateurs (désactiver un compte, changer un rôle) pas encore implémentée
          dans cette interface — accessible pour l&apos;instant uniquement via la base de données.
        </p>
      </main>
    </div>
  );
}
