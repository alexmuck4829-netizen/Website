import type { Metadata } from 'next';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Politique de remboursement',
  description: 'Dans quels cas un remboursement est possible sur les produits numériques One More Click Studio.',
  alternates: { canonical: absoluteUrlSafe('/refunds') },
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Politique de remboursement"
      intro="Les produits numériques sont livrés instantanément, ce qui limite les cas de remboursement — mais nous préférons résoudre un problème que garder l’argent d’un client mécontent."
    >
      <LegalSection title="Le principe">
        <p>
          Comme les fichiers sont téléchargeables immédiatement, un achat ne peut généralement pas
          être annulé. Cela dit, si un produit est défectueux, sensiblement différent de sa
          description, ou ne s’ouvre pas dans Roblox Studio, contactez-nous : nous le corrigeons, le
          remplaçons ou le remboursons.
        </p>
      </LegalSection>

      <LegalSection title="Nous remboursons lorsque">
        <LegalList
          items={[
            'Les fichiers sont corrompus ou ne s’ouvrent pas, et nous ne parvenons pas à résoudre le problème.',
            'Le produit diffère sensiblement de ce que décrivait sa fiche.',
            'Vous avez été débité plusieurs fois pour le même produit.',
            'Vous n’avez pas téléchargé les fichiers et demandez un remboursement sous 14 jours.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Nous ne pouvons généralement pas rembourser lorsque">
        <LegalList
          items={[
            'Vous avez téléchargé les fichiers et avez simplement changé d’avis.',
            'Le produit fonctionne comme décrit mais ne convient pas à votre projet.',
            'Vous vous êtes trompé de produit mais l’avez déjà téléchargé — contactez-nous quand même, un avoir est possible.',
            'Vos propres modifications ont cassé le produit.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Droits légaux">
        <p>
          Le droit de la consommation de votre pays peut vous accorder des droits allant au-delà de
          cette politique — dans l’Union européenne, par exemple, le droit de rétractation sur un
          achat numérique peut s’appliquer sauf si vous avez accepté la livraison immédiate et
          reconnu renoncer à ce droit au moment du paiement. Rien dans cette politique ne supprime
          les droits que la loi vous accorde.
        </p>
      </LegalSection>

      <LegalSection title="Comment en demander un">
        <p>
          Écrivez à <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> en indiquant
          votre référence de commande et ce qui s’est passé. Les remboursements sont effectués sur le
          moyen de paiement d’origine, généralement sous 5 à 10 jours ouvrés après validation.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
