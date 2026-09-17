const STUDENT_STEPS = ['Rechercher', 'Comparer', 'Contacter', 'Visiter', 'Louer'];
const OWNER_STEPS = ['Créer un compte', 'Publier', 'Attendre la validation', 'Recevoir des demandes', 'Louer'];

export default function CommentCaMarchePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">Comment ça marche ?</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-primary">Pour un étudiant</h2>
        <ol className="flex flex-col gap-3">
          {STUDENT_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-neutral-900">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-neutral-900">Pour un propriétaire</h2>
        <ol className="flex flex-col gap-3">
          {OWNER_STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-neutral-900">{step}</span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
