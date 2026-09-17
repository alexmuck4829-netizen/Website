import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SettingsService } from '@/lib/services/settings-service';
import { absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Quelles données ce site collecte, pourquoi, combien de temps, et vos droits.',
  alternates: { canonical: absoluteUrlSafe('/privacy') },
};

/**
 * Politique de confidentialité — RGPD art. 13.
 *
 * L'identité du responsable de traitement vient de /admin/settings pour rester
 * cohérente avec les mentions légales : deux identités divergentes seraient
 * pires que pas d'identité du tout.
 */
export default async function PrivacyPage() {
  const { legal, links, brand } = await SettingsService.get();
  const controller = legal.editorName || brand.name;
  const contactEmail = legal.email || links.supportEmail;

  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Ce que nous collectons, pourquoi, combien de temps nous le gardons, et ce que vous pouvez exiger."
    >
      <LegalSection title="Responsable du traitement">
        {legal.editorName ? (
          <p>
            <strong>{controller}</strong>
            {legal.address && <>, {legal.address}</>}. Contact :{' '}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
          </p>
        ) : (
          <p>
            <strong className="text-gold">À compléter.</strong> L’identité et les coordonnées du
            responsable du traitement doivent figurer ici (RGPD art. 13.1.a). Renseignez-les dans
            l’administration du site ; elles apparaîtront automatiquement ici et sur la page{' '}
            <Link href="/mentions-legales">mentions légales</Link>.
          </p>
        )}
        {legal.dpoContact && <p>Délégué à la protection des données : {legal.dpoContact}.</p>}
      </LegalSection>

      <LegalSection title="Données collectées, finalités et bases légales">
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70 text-left">
                <th className="px-4 py-3 font-medium text-ink">Donnée</th>
                <th className="px-4 py-3 font-medium text-ink">Finalité</th>
                <th className="px-4 py-3 font-medium text-ink">Base légale</th>
                <th className="px-4 py-3 font-medium text-ink">Conservation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-ink-muted">
              <tr>
                <td className="px-4 py-3">Adresse e-mail</td>
                <td className="px-4 py-3">Livrer l’achat, donner accès à la bibliothèque</td>
                <td className="px-4 py-3">Exécution du contrat</td>
                <td className="px-4 py-3">Durée du compte, puis archivage comptable</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Nom (facultatif)</td>
                <td className="px-4 py-3">Personnaliser les échanges</td>
                <td className="px-4 py-3">Exécution du contrat</td>
                <td className="px-4 py-3">Identique à l’e-mail</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Historique de commandes</td>
                <td className="px-4 py-3">Bibliothèque, support, obligations comptables</td>
                <td className="px-4 py-3">Contrat + obligation légale</td>
                <td className="px-4 py-3">10 ans (obligation comptable)</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Journaux de téléchargement (produit, date, IP)</td>
                <td className="px-4 py-3">Détecter le partage de liens et les abus</td>
                <td className="px-4 py-3">Intérêt légitime</td>
                <td className="px-4 py-3">90 jours, puis suppression automatique</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Cookie de session</td>
                <td className="px-4 py-3">Vous reconnaître entre deux pages</td>
                <td className="px-4 py-3">Strictement nécessaire au service</td>
                <td className="px-4 py-3">7 jours</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Données de paiement</td>
                <td className="px-4 py-3">Encaisser la commande</td>
                <td className="px-4 py-3">Exécution du contrat</td>
                <td className="px-4 py-3">Conservées par Stripe, pas par nous</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Nous ne recevons jamais votre numéro de carte : le paiement est traité par Stripe sur sa
          propre page.
        </p>
      </LegalSection>

      <LegalSection title="Destinataires et sous-traitants">
        <LegalList
          items={[
            'Stripe — traitement des paiements.',
            'Notre hébergeur — exécution du site et stockage des fichiers.',
            'Personne d’autre. Aucune donnée n’est vendue ni utilisée à des fins publicitaires.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Transferts hors Union européenne">
        <p>
          Certains prestataires (hébergement, paiement) peuvent être établis hors de l’Union
          européenne ou y traiter des données. Ces transferts doivent être encadrés par des
          garanties appropriées — clauses contractuelles types de la Commission européenne ou
          décision d’adéquation.{' '}
          <strong className="text-gold">
            Vérifiez la localisation réelle de vos prestataires et les garanties applicables avant
            de publier cette page.
          </strong>
        </p>
      </LegalSection>

      <LegalSection title="Cookies et stockage local">
        <p>Ce site n’utilise ni mesure d’audience, ni publicité, ni traceur tiers.</p>
        <LegalList
          items={[
            'Cookie de session (omc_customer_session) — vous reconnaît pour afficher votre bibliothèque. Strictement nécessaire : aucun consentement requis.',
            'Cookie d’administration (omc_admin_session) — réservé à l’exploitant du site.',
            'Stockage local du navigateur — panier et favoris. Ces données restent sur votre appareil et ne nous sont jamais transmises.',
            'Lecteur vidéo YouTube — chargé uniquement si vous cliquez sur « Aperçu vidéo », dans sa version sans cookie. Tant que vous ne cliquez pas, aucune requête n’est envoyée à YouTube.',
          ]}
        />
        <p className="text-sm">
          Les polices sont servies depuis notre propre serveur : aucune requête n’est adressée à
          Google Fonts lors de votre visite.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, de
          portabilité, et d’opposition aux traitements fondés sur l’intérêt légitime. Écrivez à{' '}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a> ; nous répondons dans un délai d’un
          mois.
        </p>
        <p>
          Si notre réponse ne vous satisfait pas, vous pouvez introduire une réclamation auprès de
          la CNIL :{' '}
          <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
            cnil.fr/fr/plaintes
          </a>
          .
        </p>
        <p className="text-sm">
          Aucune décision automatisée produisant des effets juridiques n’est prise à partir de vos
          données. Aucun profilage n’est réalisé.
        </p>
      </LegalSection>

      <LegalSection title="Mineurs">
        <p>
          Ce site s’adresse à des créateurs. L’âge minimum requis pour acheter est fixé à{' '}
          <strong>{legal.minimumAge} ans</strong>. En France, le traitement des données d’un mineur
          de moins de 15 ans fondé sur le consentement requiert l’autorisation du titulaire de
          l’autorité parentale (RGPD art. 8, loi Informatique et Libertés art. 45).
        </p>
        <p className="text-sm">
          <strong className="text-gold">Point d’attention.</strong> Le public Roblox comprend
          beaucoup de mineurs. Si votre clientèle en compte, les règles applicables dépassent cette
          page : capacité à contracter, consentement parental, publicité ciblée. À faire valider par
          un professionnel du droit.
        </p>
      </LegalSection>

      <LegalSection title="Sécurité">
        <p>
          Les fichiers payants ne sont jamais accessibles par une URL publique. Chaque
          téléchargement passe par un lien signé, expirant après 5 minutes, délivré uniquement après
          vérification d’une commande payée. Les sessions utilisent des cookies HttpOnly signés.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
