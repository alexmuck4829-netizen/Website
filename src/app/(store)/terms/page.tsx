import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Conditions générales',
  description: 'Les conditions applicables à tout achat chez One More Click Studio.',
  alternates: { canonical: absoluteUrlSafe('/terms') },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Conditions générales"
      intro="L’accord entre vous et One More Click Studio lorsque vous utilisez cette boutique."
    >
      <LegalSection title="1. Qui nous sommes">
        <p>
          {SITE.name} vend des ressources de développement numériques destinées à Roblox Studio.
          Contact :{' '}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. Ce que vous achetez">
        <p>
          Chaque produit est un fichier numérique ou un ensemble de fichiers, livré par
          téléchargement. Vous recevez une licence d’utilisation selon les conditions de notre{' '}
          <Link href="/license">page Licence</Link>. Aucun bien physique n’est expédié et aucune
          propriété sur les assets sous-jacents ne vous est transférée.
        </p>
      </LegalSection>

      <LegalSection title="3. Votre compte et vos achats">
        <LegalList
          items={[
            'Vous êtes responsable de l’exactitude de l’adresse e-mail fournie au paiement — c’est par elle que vos fichiers vous parviennent.',
            'Les liens de téléchargement vous sont personnels et limités dans le temps pour des raisons de sécurité.',
            'Vous ne devez pas tenter d’accéder aux fichiers de produits que vous n’avez pas achetés.',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Paiement">
        <p>
          Les prix sont affichés en euros et incluent les taxes applicables le cas échéant. Le
          paiement est traité par Stripe ; nous ne recevons ni ne stockons jamais vos données de
          carte.
        </p>
      </LegalSection>

      <LegalSection title="5. Livraison">
        <p>
          L’accès est accordé immédiatement après confirmation du paiement. Si un téléchargement
          échoue, contactez le support et nous réémettrons votre lien.
        </p>
      </LegalSection>

      <LegalSection title="6. Mises à jour">
        <p>
          Lorsqu’un produit reçoit des mises à jour, les acheteurs peuvent télécharger la dernière
          version depuis leur bibliothèque sans surcoût, sauf mention contraire sur la fiche produit.
          Nous ne garantissons pas qu’un produit donné sera mis à jour indéfiniment.
        </p>
      </LegalSection>

      <LegalSection title="7. Usage acceptable">
        <LegalList
          items={[
            'Ne tentez pas de contourner les protections de téléchargement, les limitations de débit ou les contrôles d’accès.',
            'N’utilisez pas la boutique pour diffuser des logiciels malveillants ou du contenu contrefaisant.',
            'Ne collectez, ne revendez et ne dupliquez pas le catalogue.',
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Responsabilité">
        <p>
          Les produits sont fournis tels que décrits sur leur fiche. Dans la limite permise par la
          loi, nous ne sommes pas responsables des pertes indirectes ou consécutives résultant de
          l’utilisation d’un produit, y compris une perte de revenus liée à un jeu. Rien ici ne
          limite une responsabilité qui ne peut l’être légalement, ni vos droits de consommateur.
        </p>
      </LegalSection>

      <LegalSection title="9. Modifications">
        <p>
          Nous pouvons modifier ces conditions. Les changements importants seront annoncés sur notre
          Discord et reflétés dans la date de mise à jour ci-dessus. Chaque achat est régi par les
          conditions en vigueur au moment de l’achat.
        </p>
      </LegalSection>

      <LegalSection title="10. Roblox">
        <p>
          {SITE.name} n’est ni affilié à Roblox Corporation, ni approuvé ou sponsorisé par elle.
          Votre utilisation de Roblox et de Roblox Studio est régie par leurs propres conditions.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
