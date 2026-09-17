import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply when you buy from One More Click Studio.',
  alternates: { canonical: absoluteUrlSafe('/terms') },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="The agreement between you and One More Click Studio when you use this store."
    >
      <LegalSection title="1. Who we are">
        <p>
          {SITE.name} sells digital development resources for use in Roblox Studio. Contact:{' '}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
        </p>
      </LegalSection>

      <LegalSection title="2. What you are buying">
        <p>
          Every product is a digital file or set of files, delivered by download. You receive a
          licence to use them under the terms set out on our{' '}
          <Link href="/license">License page</Link>. No physical goods are shipped and no ownership
          of the underlying assets transfers to you.
        </p>
      </LegalSection>

      <LegalSection title="3. Your account and purchases">
        <LegalList
          items={[
            'You are responsible for the accuracy of the email address you provide at checkout — it is how your files reach you.',
            'Download links are personal to you and time-limited for security.',
            'You must not attempt to access files for products you have not purchased.',
          ]}
        />
      </LegalSection>

      <LegalSection title="4. Payment">
        <p>
          Prices are shown in euros and include any applicable taxes where required. Payment is
          processed by Stripe; we never receive or store your card details.
        </p>
      </LegalSection>

      <LegalSection title="5. Delivery">
        <p>
          Access is granted immediately after payment is confirmed. If a download fails, contact
          support and we will re-issue your link.
        </p>
      </LegalSection>

      <LegalSection title="6. Updates">
        <p>
          Where a product receives updates, buyers can download the latest version from their
          library at no extra cost, unless the product page states otherwise. We do not guarantee
          that any given product will be updated indefinitely.
        </p>
      </LegalSection>

      <LegalSection title="7. Acceptable use">
        <LegalList
          items={[
            'Do not attempt to circumvent download protection, rate limits or access controls.',
            'Do not use the store to distribute malware or infringing content.',
            'Do not scrape, resell or mirror the catalogue.',
          ]}
        />
      </LegalSection>

      <LegalSection title="8. Liability">
        <p>
          Products are provided as described on their product pages. To the extent permitted by law,
          we are not liable for indirect or consequential losses arising from the use of a product,
          including lost revenue from a game. Nothing here limits liability that cannot be limited
          by law, including your statutory consumer rights.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes">
        <p>
          We may update these terms. Material changes will be announced in our Discord and reflected
          in the &ldquo;last updated&rdquo; date above. Purchases are governed by the terms in force
          at the time of purchase.
        </p>
      </LegalSection>

      <LegalSection title="10. Roblox">
        <p>
          {SITE.name} is not affiliated with, endorsed by or sponsored by Roblox Corporation. Your
          use of Roblox and Roblox Studio is governed by their own terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
