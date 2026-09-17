import type { Metadata } from 'next';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Quelles données One More Click Studio collecte, et pourquoi.',
  alternates: { canonical: absoluteUrlSafe('/privacy') },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Politique de confidentialité"
      intro="Ce que nous collectons, pourquoi, et ce que vous pouvez nous demander d’en faire."
    >
      <LegalSection title="Ce que nous collectons">
        <LegalList
          items={[
            'Adresse e-mail — nécessaire pour livrer votre achat et vous donner accès à votre bibliothèque.',
            'Nom — facultatif, utilisé uniquement pour vous adresser la parole.',
            'Historique de commandes — quels produits vous avez achetés et quand, pour que votre bibliothèque fonctionne.',
            'Journaux de téléchargement — produit, horodatage et adresse IP, conservés pour détecter le partage de liens et les abus.',
            'Données de paiement — gérées par Stripe. Nous recevons une confirmation et une référence, jamais votre numéro de carte.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Pourquoi nous les collectons">
        <p>
          Pour exécuter votre commande (nécessité contractuelle), protéger les fichiers payants
          d’une diffusion non autorisée (intérêt légitime) et respecter nos obligations comptables
          (obligation légale).
        </p>
      </LegalSection>

      <LegalSection title="Avec qui nous les partageons">
        <LegalList
          items={[
            'Stripe — traitement des paiements.',
            'Nos hébergeurs et prestataires de stockage — pour faire tourner le site et livrer les fichiers.',
            'Personne d’autre. Nous ne vendons pas de données personnelles et ne les partageons pas à des fins publicitaires.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Durée de conservation">
        <p>
          Les enregistrements de commandes sont conservés aussi longtemps que l’exige la
          comptabilité. Les journaux de téléchargement sont conservés une durée limitée puis
          supprimés. Vous pouvez demander la suppression de vos données, sous réserve de ces
          obligations.
        </p>
      </LegalSection>

      <LegalSection title="Vos droits">
        <p>
          Selon votre pays de résidence, vous pouvez avoir le droit d’accéder à vos données, de les
          corriger, de les exporter ou de les effacer, et de vous opposer à certains traitements.
          Écrivez à{' '}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> et nous répondrons dans un délai raisonnable.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Nous utilisons un petit nombre de cookies fonctionnels : un cookie de session pour que
          votre bibliothèque vous reconnaisse, et le stockage local pour votre panier et vos favoris.
          Aucun cookie publicitaire ni de suivi inter-sites n’est déposé.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
