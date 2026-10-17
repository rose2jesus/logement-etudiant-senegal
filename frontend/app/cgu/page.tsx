import { LegalLayout, LegalSection, ToFill } from '@/components/legal/LegalLayout';

export default function CguPage() {
  return (
    <LegalLayout title="Conditions générales d'utilisation" updatedAt="22 septembre 2026">
      <LegalSection title="1. Objet">
        <p>
          Les présentes conditions générales d&apos;utilisation (« CGU ») régissent l&apos;accès et
          l&apos;utilisation de la plateforme <ToFill>Nom de la plateforme</ToFill> (le « Site »),
          qui met en relation des étudiants à la recherche d&apos;un logement et des propriétaires
          proposant des logements à la location au Sénégal. En créant un compte ou en utilisant le
          Site, tu acceptes sans réserve les présentes CGU.
        </p>
      </LegalSection>

      <LegalSection title="2. Rôle de la plateforme — un intermédiaire, pas une partie au contrat">
        <p>
          Le Site est un service de mise en relation. Il ne participe à aucun titre au contrat de
          location conclu entre l&apos;étudiant et le propriétaire, et n&apos;est ni agence
          immobilière, ni garant, ni partie à la transaction.
        </p>
        <p>
          Le Site ne vérifie pas systématiquement l&apos;identité des propriétaires ni
          l&apos;exactitude de toutes les informations publiées, au-delà de la modération décrite à
          l&apos;article 5. Chaque utilisateur reste seul responsable de vérifier les informations
          avant de s&apos;engager (visite du logement, vérification d&apos;identité, conditions du
          bail) — voir nos{' '}
          <a href="/conseils-securite" className="underline">
            conseils sécurité
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="3. Inscription et comptes">
        <p>
          L&apos;inscription est gratuite pour les étudiants et les propriétaires. Tu t&apos;engages à
          fournir des informations exactes et à jour, et à ne pas créer de compte au nom
          d&apos;un tiers sans autorisation. Un compte est personnel et ne doit pas être partagé.
        </p>
        <p>
          Le Site se réserve le droit de suspendre ou supprimer tout compte en cas de non-respect des
          présentes CGU, de fraude avérée ou d&apos;usage frauduleux constaté.
        </p>
      </LegalSection>

      <LegalSection title="4. Publication d'annonces (propriétaires)">
        <p>Un propriétaire qui publie une annonce s&apos;engage à :</p>
        <ul className="list-disc pl-5">
          <li>publier des informations exactes (prix, photos, disponibilité, équipements) ;</li>
          <li>être le propriétaire du logement ou disposer d&apos;un mandat pour le proposer à la location ;</li>
          <li>retirer ou mettre à jour l&apos;annonce dès que le logement n&apos;est plus disponible ;</li>
          <li>ne publier aucune information mensongère, discriminatoire ou illicite.</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Modération">
        <p>
          Chaque annonce est examinée par un administrateur avant publication et peut être rejetée,
          suspendue ou supprimée si elle enfreint ces CGU ou paraît frauduleuse. Les utilisateurs
          peuvent signaler une annonce via le bouton dédié ; chaque signalement est examiné par
          l&apos;équipe de modération.
        </p>
      </LegalSection>

      <LegalSection title="6. Mise en avant payante">
        <p>
          Un propriétaire peut payer pour mettre une annonce en avant dans les résultats de
          recherche, via notre prestataire de paiement PayDunya (Wave, Orange Money, Free Money,
          carte bancaire). Ce paiement concerne uniquement la visibilité de l&apos;annonce sur le
          Site — il ne constitue en aucun cas une garantie de location, de qualité du bien, ni un
          quelconque engagement entre le Site et un tiers.
        </p>
        <p>
          Les tarifs de mise en avant sont affichés avant tout paiement. Sauf erreur technique
          imputable au Site, les sommes versées pour une période de mise en avant déjà entamée ne
          sont pas remboursables.
        </p>
      </LegalSection>

      <LegalSection title="7. Comportements interdits">
        <p>Il est interdit d&apos;utiliser le Site pour :</p>
        <ul className="list-disc pl-5">
          <li>publier des annonces fictives, trompeuses ou destinées à arnaquer un utilisateur ;</li>
          <li>collecter les données personnelles d&apos;autres utilisateurs à des fins non autorisées ;</li>
          <li>publier un contenu discriminatoire, injurieux ou illicite ;</li>
          <li>tenter de contourner les mesures de sécurité ou de modération du Site.</li>
        </ul>
      </LegalSection>

      <LegalSection title="8. Responsabilité">
        <p>
          Le Site met tout en œuvre pour assurer la disponibilité et la fiabilité du service, sans
          garantie de résultat. Il ne saurait être tenu responsable des litiges entre étudiants et
          propriétaires, des dommages liés à une location, ni des interruptions de service
          indépendantes de sa volonté.
        </p>
      </LegalSection>

      <LegalSection title="9. Droit applicable et litiges">
        <p>
          Les présentes CGU sont soumises au droit sénégalais. En cas de litige, une solution amiable
          sera recherchée en priorité ; à défaut, les tribunaux compétents du Sénégal seront seuls
          compétents.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Pour toute question relative aux présentes CGU : <ToFill>contact@ton-domaine.sn</ToFill>
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
