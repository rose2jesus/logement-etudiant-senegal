export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 font-heading text-lg font-semibold text-neutral-900">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

export function ToFill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded bg-secondary/20 px-1.5 py-0.5 font-mono text-xs font-medium text-neutral-900">
      [{children}]
    </span>
  );
}

export function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-1 font-heading text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mb-8 text-xs text-neutral-500">Dernière mise à jour : {updatedAt}</p>
      {children}
      <p className="mt-10 rounded-button bg-neutral-100 p-4 text-xs text-neutral-500">
        Ce document est un modèle rédigé pour couvrir les usages courants d&apos;une plateforme
        comme celle-ci. Il ne remplace pas une relecture par un juriste — en particulier avant un
        lancement commercial réel, vérifie sa conformité avec la loi n° 2008-12 sur la protection
        des données à caractère personnel et les exigences de la{' '}
        <a href="https://www.cdp.sn" target="_blank" rel="noreferrer" className="underline">
          Commission de protection des données personnelles (CDP)
        </a>{' '}
        du Sénégal.
      </p>
    </main>
  );
}
