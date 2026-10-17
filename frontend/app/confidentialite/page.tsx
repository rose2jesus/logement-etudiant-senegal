import { LegalLayout, LegalSection, ToFill } from '@/components/legal/LegalLayout';

export default function ConfidentialitePage() {
  return (
    <LegalLayout title="Politique de confidentialité" updatedAt="22 septembre 2026">
      <LegalSection title="1. Responsable du traitement">
        <p>
          Le responsable du traitement des données collectées sur ce Site est{' '}
          <ToFill>Nom de l&apos;entreprise</ToFill>, joignable à{' '}
          <ToFill>contact@ton-domaine.sn</ToFill>.
        </p>
      </LegalSection>

      <LegalSection title="2. Données collectées">
        <p>Selon ton usage du Site, nous collectons :</p>
        <ul className="list-disc pl-5">
          <li>À l&apos;inscription : prénom, nom, email, téléphone, mot de passe (stocké de façon chiffrée, jamais en clair) ;</li>
          <li>Pour un étudiant : établissement et ville de résidence ;</li>
          <li>Pour un propriétaire : type de compte (particulier/gestionnaire) ;</li>
          <li>Lors de la publication d&apos;une annonce : localisation approximative, prix, photos, équipements ;</li>
          <li>Lors d&apos;une demande de contact : nom, téléphone, message envoyé au propriétaire ;</li>
          <li>Lors d&apos;un signalement : motif et description fournis ;</li>
          <li>Lors d&apos;un paiement de mise en avant : les informations de paiement transitent directement par PayDunya — nous ne recevons ni ne stockons aucune donnée bancaire ou de mobile money.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Finalités du traitement">
        <p>Ces données sont utilisées pour :</p>
        <ul className="list-disc pl-5">
          <li>créer et gérer ton compte ;</li>
          <li>permettre la recherche et la mise en relation entre étudiants et propriétaires ;</li>
          <li>modérer les annonces et traiter les signalements ;</li>
          <li>traiter les paiements de mise en avant (via PayDunya) ;</li>
          <li>assurer la sécurité du Site (prévention de la fraude, limitation des tentatives de connexion).</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Base légale">
        <p>
          Le traitement repose sur l&apos;exécution du contrat qui te lie au Site (fourniture du
          service que tu as demandé en créant un compte), ainsi que sur notre intérêt légitime à
          assurer la sécurité et le bon fonctionnement de la plateforme.
        </p>
      </LegalSection>

      <LegalSection title="5. Destinataires des données">
        <p>Tes données peuvent être transmises aux prestataires techniques suivants, strictement pour le fonctionnement du Site :</p>
        <ul className="list-disc pl-5">
          <li>Supabase (hébergement de la base de données) ;</li>
          <li>Cloudinary (hébergement des photos d&apos;annonces) ;</li>
          <li>Render et Vercel (hébergement du serveur et du site) ;</li>
          <li>PayDunya (traitement des paiements de mise en avant) ;</li>
          <li>l&apos;administrateur du Site, pour la modération des annonces et signalements.</li>
        </ul>
        <p>Ces données ne sont jamais vendues à des tiers à des fins commerciales.</p>
      </LegalSection>

      <LegalSection title="6. Durée de conservation">
        <p>
          Les données de ton compte sont conservées tant que ton compte est actif. En cas de
          suppression de compte, les données sont supprimées ou anonymisées dans un délai raisonnable,
          sauf obligation légale de conservation plus longue (ex. données comptables liées à un
          paiement).
        </p>
      </LegalSection>

      <LegalSection title="7. Tes droits">
        <p>
          Conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 relative à la protection
          des données à caractère personnel, tu disposes d&apos;un droit d&apos;accès, de
          rectification, d&apos;opposition et d&apos;effacement de tes données. Tu peux exercer ces
          droits en écrivant à <ToFill>contact@ton-domaine.sn</ToFill>.
        </p>
        <p>
          Tu peux également adresser une réclamation à la{' '}
          <a href="https://www.cdp.sn" target="_blank" rel="noreferrer" className="underline">
            Commission de protection des données personnelles (CDP)
          </a>{' '}
          du Sénégal.
        </p>
      </LegalSection>

      <LegalSection title="8. Cookies">
        <p>
          Le Site utilise uniquement un cookie technique indispensable à la connexion (stockage
          sécurisé de ta session, en httpOnly — inaccessible en JavaScript). Aucun cookie publicitaire
          ou de traçage n&apos;est utilisé.
        </p>
      </LegalSection>

      <LegalSection title="9. Sécurité">
        <p>
          Les mots de passe sont chiffrés (hachage bcrypt), les connexions sont sécurisées en HTTPS, et
          l&apos;accès aux données est limité aux personnes qui en ont réellement besoin pour faire
          fonctionner le Site.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
