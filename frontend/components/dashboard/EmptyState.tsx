import Link from 'next/link';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function EmptyState({ icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-neutral-200 bg-white px-6 py-12 text-center shadow-soft">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="font-heading text-lg font-bold text-neutral-900">{title}</p>
      {description && <p className="max-w-sm text-sm text-neutral-500">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-1 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
