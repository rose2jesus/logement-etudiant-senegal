import { LegalLayout, LegalSection, ToFill } from '@/components/legal/LegalLayout';

export default function MentionsLegalesPage() {
  return (
    <LegalLayout title="Mentions légales" updatedAt="22 septembre 2026">
      <LegalSection title="1. Éditeur du site">
        <p>Le présent site est édité par :</p>
        <ul className="list-disc pl-5">
          <li>
            Nom / raison sociale : <ToFill>Nom de l&apos;entreprise ou de l&apos;auto-entrepreneur</ToFill>
          </li>
          <li>
            Forme juridique : <ToFill>ex. Entreprise individuelle, SARL, SUARL...</ToFill>
          </li>
          <li>
            Numéro RCCM : <ToFill>Numéro au Registre du Commerce et du Crédit Mobilier</ToFill>
          </li>
          <li>
            Numéro NINEA : <ToFill>Numéro d&apos;Identification Nationale des Entreprises</ToFill>
          </li>
          <li>
            Siège social : <ToFill>Adresse complète au Sénégal</ToFill>
          </li>
          <li>
            Email de contact : <ToFill>contact@ton-domaine.sn</ToFill>
          </li>
          <li>
            Téléphone : <ToFill>+221 XX XXX XX XX</ToFill>
          </li>
          <li>
            Directeur de publication : <ToFill>Nom du responsable</ToFill>
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Hébergement">
        <p>Le site est hébergé par :</p>
        <ul className="list-disc pl-5">
          <li>Frontend (interface utilisateur) : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</li>
          <li>Backend (serveur applicatif) : Render Services, Inc., San Francisco, CA, États-Unis</li>
          <li>Base de données : Supabase Inc. (infrastructure PostgreSQL)</li>
          <li>Stockage des photos : Cloudinary Ltd.</li>
        </ul>
        <p>
          Les données étant hébergées sur des serveurs pouvant être situés hors du Sénégal, voir la{' '}
          <a href="/confidentialite" className="underline">
            politique de confidentialité
          </a>{' '}
          pour le détail des transferts de données.
        </p>
      </LegalSection>

      <LegalSection title="3. Propriété intellectuelle">
        <p>
          L&apos;ensemble des éléments du site (structure, design, textes, logo) est la propriété de
          l&apos;éditeur, sauf mention contraire. Les photos et descriptions des annonces restent la
          propriété de leurs auteurs respectifs (les propriétaires qui les publient).
        </p>
        <p>
          Toute reproduction, représentation ou exploitation, totale ou partielle, du site sans
          autorisation préalable est interdite.
        </p>
      </LegalSection>

      <LegalSection title="4. Signaler un contenu">
        <p>
          Pour signaler un contenu illicite, une annonce frauduleuse ou tout autre problème, utilise le
          bouton &laquo; Signaler &raquo; présent sur chaque annonce, ou écris à{' '}
          <ToFill>contact@ton-domaine.sn</ToFill>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
