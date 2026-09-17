import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/current-user';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { HeartIcon, SearchIcon, InboxIcon } from '@/components/icons';

export default async function EtudiantDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role !== 'student') redirect('/');

  const favorites = await apiFetch<any[]>('/favorites', { token: getSessionToken() }).catch(() => []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <DashboardHeader firstName={user.firstName} subtitle={user.email} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard icon={<HeartIcon className="h-5 w-5" />} label="Favoris enregistrés" value={favorites.length} />
          <StatCard icon={<InboxIcon className="h-5 w-5" />} label="Demandes envoyées" value="—" />
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/recherche"
            className="flex flex-1 items-center gap-4 rounded-card border border-neutral-200 bg-white p-5 shadow-soft transition-all duration-150 hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-primary/10 text-primary">
              <SearchIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-heading font-bold text-neutral-900">Rechercher un logement</p>
              <p className="text-sm text-neutral-500">Par ville, établissement et budget</p>
            </div>
          </Link>

          <Link
            href="/etudiant/favoris"
            className="flex flex-1 items-center gap-4 rounded-card border border-neutral-200 bg-white p-5 shadow-soft transition-all duration-150 hover:-translate-y-1 hover:shadow-soft"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-900 text-white">
              <HeartIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-heading font-bold text-neutral-900">Mes favoris</p>
              <p className="text-sm text-neutral-500">Retrouve les logements enregistrés</p>
            </div>
          </Link>
        </div>

        <p className="mt-8 text-xs text-neutral-500">
          Fonctionnalités à venir : historique des annonces consultées récemment, suivi détaillé des
          demandes de contact envoyées (non encore implémenté).
        </p>
      </main>
    </div>
  );
}
