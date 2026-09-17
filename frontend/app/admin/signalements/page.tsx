import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/current-user';
import { getSessionToken } from '@/lib/session';
import { apiFetch } from '@/lib/api';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { FlagIcon, CheckCircleIcon } from '@/components/icons';
import { updateReportStatusAction, suspendReportedPropertyAction } from './actions';

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: 'open' | 'reviewed' | 'dismissed' | 'action_taken';
  createdAt: string;
  property: { id: string; title: string; slug: string } | null;
  reporter: { email: string } | null;
}

const REASON_LABELS: Record<string, string> = {
  fausse_annonce: 'Fausse annonce',
  prix_trompeur: 'Prix trompeur',
  photos_trompeuses: 'Photos trompeuses',
  logement_inexistant: 'Logement inexistant',
  contenu_inapproprie: 'Contenu inapproprié',
  arnaque: "Tentative d'arnaque",
  autre: 'Autre',
};

const STATUS_CONFIG: Record<string, { label: string; tone: string }> = {
  open: { label: 'À traiter', tone: 'bg-danger/10 text-danger' },
  reviewed: { label: 'Examiné', tone: 'bg-primary/10 text-primary' },
  dismissed: { label: 'Ignoré', tone: 'bg-neutral-200 text-neutral-500' },
  action_taken: { label: 'Action prise', tone: 'bg-success/10 text-success' },
};

export default async function AdminReportsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/connexion');
  if (user.role !== 'admin') redirect('/');

  const token = getSessionToken();
  const reports = await apiFetch<Report[]>('/reports', { token }).catch(() => []);

  const openReports = reports.filter((r) => r.status === 'open');
  const handledReports = reports.filter((r) => r.status !== 'open');

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-neutral-900">Signalements</h1>
          <p className="text-sm text-neutral-500">{openReports.length} à traiter sur {reports.length} au total</p>
        </div>
        <Link href="/admin/dashboard" className="text-sm font-semibold text-primary hover:underline">
          ← Retour au dashboard
        </Link>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={<CheckCircleIcon className="h-6 w-6" />}
          title="Aucun signalement"
          description="Les annonces signalées par les étudiants apparaîtront ici."
        />
      ) : (
        <div className="flex flex-col gap-8">
          {openReports.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-danger">
                À traiter
              </h2>
              <ul className="flex flex-col gap-3">
                {openReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </ul>
            </section>
          )}

          {handledReports.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Déjà traités
              </h2>
              <ul className="flex flex-col gap-3">
                {handledReports.map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}

function ReportCard({ report }: { report: Report }) {
  const status = STATUS_CONFIG[report.status];
  const isOpen = report.status === 'open';

  return (
    <li className="rounded-card bg-white p-4 shadow-soft">
      <div>
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.tone}`}>
          <FlagIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
        <p className="mt-2 font-heading font-semibold text-neutral-900">
          {REASON_LABELS[report.reason] ?? report.reason}
        </p>
        {report.property ? (
          <Link
            href={`/logement/${report.property.slug}`}
            target="_blank"
            className="text-sm font-medium text-primary hover:underline"
          >
            {report.property.title} ↗
          </Link>
        ) : (
          <p className="text-sm text-neutral-500">Annonce supprimée</p>
        )}
        {report.description && <p className="mt-1 text-sm text-neutral-500">« {report.description} »</p>}
        <p className="mt-1 text-xs text-neutral-400">
          Signalé {report.reporter ? `par ${report.reporter.email}` : 'anonymement'} le{' '}
          {new Date(report.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </div>

      {isOpen && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-200 pt-3">
          {report.property && (
            <form action={suspendReportedPropertyAction.bind(null, report.id, report.property.id)}>
              <button
                type="submit"
                className="rounded-full bg-danger/10 px-4 py-2 text-xs font-semibold text-danger hover:bg-danger/20"
              >
                Suspendre l&apos;annonce
              </button>
            </form>
          )}
          <form action={updateReportStatusAction.bind(null, report.id, 'reviewed')}>
            <button
              type="submit"
              className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              Marquer examiné
            </button>
          </form>
          <form action={updateReportStatusAction.bind(null, report.id, 'dismissed')}>
            <button
              type="submit"
              className="rounded-full bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-500 hover:bg-neutral-200"
            >
              Ignorer
            </button>
          </form>
        </div>
      )}
    </li>
  );
}
