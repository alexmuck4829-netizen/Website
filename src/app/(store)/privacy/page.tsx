import type { Metadata } from 'next';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SITE } from '@/lib/constants';
import { absoluteUrlSafe } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'What data One More Click Studio collects and why.',
  alternates: { canonical: absoluteUrlSafe('/privacy') },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="What we collect, why we collect it, and what you can ask us to do with it."
    >
      <LegalSection title="What we collect">
        <LegalList
          items={[
            'Email address — required to deliver your purchase and give you access to your library.',
            'Name — optional, used only to address you.',
            'Order history — which products you bought and when, so your library works.',
            'Download logs — product, time and IP address, kept to detect link sharing and abuse.',
            'Payment records — handled by Stripe. We receive a confirmation and a reference, never your card number.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Why we collect it">
        <p>
          To fulfil your order (contractual necessity), to protect paid files from unauthorised
          distribution (legitimate interest), and to meet accounting obligations (legal obligation).
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <LegalList
          items={[
            'Stripe — payment processing.',
            'Our hosting and storage providers — to run the site and deliver files.',
            'Nobody else. We do not sell personal data or share it for advertising.',
          ]}
        />
      </LegalSection>

      <LegalSection title="How long we keep it">
        <p>
          Order records are kept as long as required for accounting purposes. Download logs are
          retained for a limited period and then discarded. You can ask us to delete your account
          data, subject to those obligations.
        </p>
      </LegalSection>

      <LegalSection title="Your rights">
        <p>
          Depending on where you live you may have the right to access, correct, export or erase
          your data, and to object to certain processing. Email{' '}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> and we will respond within
          a reasonable period.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          We use a small number of functional cookies: a session cookie so your library recognises
          you, and local storage for your cart and favourites. No advertising or cross-site tracking
          cookies are set.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
