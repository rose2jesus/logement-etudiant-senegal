const TIPS = [
  ['Visite avant de payer', 'Ne verse jamais d\'argent avant d\'avoir visité le logement en personne ou via un proche de confiance.'],
  ['Vérifie l\'identité du propriétaire', 'Demande une pièce d\'identité et confirme que la personne correspond bien au profil affiché sur la plateforme.'],
  ['Demande un reçu', 'Tout versement (caution, premier loyer) doit être accompagné d\'un reçu écrit et signé.'],
  ['Vérifie les conditions', 'Relis attentivement la durée minimale, le montant de la caution et les modalités avant de t\'engager.'],
  ['Méfie-toi des prix trop bas', 'Un prix largement inférieur au marché est souvent le signe d\'une arnaque.'],
  ['N\'envoie jamais d\'argent à un inconnu sans vérification', 'Aucun propriétaire sérieux n\'exige un paiement à distance avant toute visite.'],
];

export default function ConseilsSecuritePage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold text-neutral-900">Conseils sécurité</h1>
      <p className="mb-8 text-neutral-500">
        Quelques réflexes simples pour éviter les arnaques immobilières.
      </p>

      <ul className="flex flex-col gap-4">
        {TIPS.map(([title, text]) => (
          <li key={title} className="rounded-card border border-neutral-200 bg-white p-4 shadow-soft">
            <p className="font-medium text-neutral-900">⚠ {title}</p>
            <p className="mt-1 text-sm text-neutral-500">{text}</p>
          </li>
        ))}
      </ul>

      <p className="mt-8 rounded-button bg-neutral-100 p-4 text-sm text-neutral-900">
        La plateforme met en relation étudiants et propriétaires mais ne gère aucune transaction
        financière : elle ne peut donc pas garantir la sécurité d&apos;un paiement effectué en
        dehors du site. En cas de doute, utilise le bouton <strong>Signaler</strong> sur l&apos;annonce
        concernée.
      </p>
    </main>
  );
}
