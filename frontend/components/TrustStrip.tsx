import { CheckCircleIcon, ShieldIcon, InboxIcon, SparklesIcon } from '@/components/icons';

const ITEMS = [
  { icon: CheckCircleIcon, title: 'Annonces vérifiées', text: 'Chaque logement est validé avant publication', tint: 'bg-primary/10 text-primary' },
  { icon: ShieldIcon, title: 'Contact sécurisé', text: 'Conseils anti-arnaque à chaque étape', tint: 'bg-secondary/15 text-secondary' },
  { icon: InboxIcon, title: 'Réponse rapide', text: 'Contact direct par WhatsApp ou formulaire', tint: 'bg-primary/10 text-primary' },
  { icon: SparklesIcon, title: 'Gratuit pour toi', text: 'Aucun frais pour les étudiants', tint: 'bg-secondary/15 text-secondary' },
];

export function TrustStrip() {
  return (
    <section className="mx-auto -mt-10 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:gap-4">
      {ITEMS.map(({ icon: Icon, title, text, tint }) => (
        <div key={title} className="rounded-card bg-white p-4 shadow-soft">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tint}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 font-heading text-sm font-semibold text-neutral-900">{title}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{text}</p>
        </div>
      ))}
    </section>
  );
}
