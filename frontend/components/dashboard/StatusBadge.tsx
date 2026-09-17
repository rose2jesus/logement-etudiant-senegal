import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@/components/icons';

const CONFIG: Record<string, { label: string; tone: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', tone: 'bg-warning/10 text-warning', icon: <ClockIcon className="h-3.5 w-3.5" /> },
  approved: { label: 'Active', tone: 'bg-success/10 text-success', icon: <CheckCircleIcon className="h-3.5 w-3.5" /> },
  rejected: { label: 'Rejetée', tone: 'bg-danger/10 text-danger', icon: <XCircleIcon className="h-3.5 w-3.5" /> },
  suspended: { label: 'Suspendue', tone: 'bg-neutral-200 text-neutral-500', icon: <XCircleIcon className="h-3.5 w-3.5" /> },
  expired: { label: 'Expirée', tone: 'bg-neutral-200 text-neutral-500', icon: <ClockIcon className="h-3.5 w-3.5" /> },
};

export function StatusBadge({ status }: { status: string }) {
  const config = CONFIG[status] ?? CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${config.tone}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
