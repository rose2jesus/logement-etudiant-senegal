interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-lift">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-mono text-2xl font-bold leading-tight text-neutral-900">{value}</p>
        <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-500">{label}</p>
      </div>
    </div>
  );
}
