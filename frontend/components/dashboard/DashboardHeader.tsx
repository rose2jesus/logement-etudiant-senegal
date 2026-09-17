interface DashboardHeaderProps {
  firstName: string;
  subtitle: string;
  action?: React.ReactNode;
}

export function DashboardHeader({ firstName, subtitle, action }: DashboardHeaderProps) {
  const initial = firstName.charAt(0).toUpperCase();
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-card bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lift">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 font-heading text-xl font-bold backdrop-blur">
          {initial}
        </div>
        <div>
          <h1 className="font-heading text-xl font-bold">Salut, {firstName} 👋</h1>
          <p className="text-sm text-white/80">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}
