import type { Metadata } from 'next';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'When a refund is possible on digital products from One More Click Studio.',
  alternates: { canonical: absoluteUrlSafe('/refunds') },
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      intro="Digital products are delivered instantly, which limits when a refund is possible — but we would rather fix a problem than keep money from an unhappy customer."
    >
      <LegalSection title="The principle">
        <p>
          Because files are downloadable immediately, a purchase generally cannot be undone. That
          said, if a product is broken, materially different from its description, or will not open
          in Roblox Studio, contact us — we will fix it, replace it, or refund it.
        </p>
      </LegalSection>

      <LegalSection title="We will refund when">
        <LegalList
          items={[
            'The files are corrupted or will not open, and we cannot resolve it.',
            'The product is materially different from what its page described.',
            'You were charged more than once for the same product.',
            'You have not downloaded the files and request a refund within 14 days.',
          ]}
        />
      </LegalSection>

      <LegalSection title="We generally cannot refund when">
        <LegalList
          items={[
            'You have downloaded the files and simply changed your mind.',
            'The product works as described but does not suit your project.',
            'You bought the wrong product but have already downloaded it — contact us anyway, we may offer credit.',
            'Your own modifications broke the product.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Statutory rights">
        <p>
          Consumer law in your country may give you rights beyond this policy — in the EU and UK,
          for example, the right to withdraw from a digital purchase can apply unless you agreed to
          immediate delivery and acknowledged losing that right at checkout. Nothing in this policy
          removes rights you have by law.
        </p>
      </LegalSection>

      <LegalSection title="How to request one">
        <p>
          Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> with your order
          reference and what went wrong. Refunds are returned to the original payment method,
          usually within 5–10 working days of approval.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
