const MESSAGES = [
  '🔥 Nouvelles annonces chaque semaine',
  '🎓 Fait par et pour les étudiants',
  '📍 Dakar · Thiès · Kaolack',
  '✅ Annonces vérifiées avant publication',
  '💬 Contact direct avec le propriétaire',
];

export function MarqueeTicker() {
  const track = [...MESSAGES, ...MESSAGES];

  return (
    <div className="overflow-hidden bg-neutral-900 py-2.5">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {track.map((msg, i) => (
          <span key={i} className="font-mono text-xs font-medium tracking-wide text-white/80">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
