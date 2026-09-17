import type { Metadata } from 'next';
import { Check, X } from 'lucide-react';
import { LegalList, LegalPage, LegalSection } from '@/components/legal/legal-page';
import { absoluteUrlSafe } from '@/lib/seo';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'License',
  description:
    'How you may use products bought from One More Click Studio: permitted uses, commercial rights and redistribution restrictions.',
  alternates: { canonical: absoluteUrlSafe('/license') },
};

const MATRIX = [
  { right: 'Use in your own Roblox experiences', standard: true, commercial: true },
  { right: 'Modify, recolour and extend the files', standard: true, commercial: true },
  { right: 'Use in a monetised / commercial game', standard: true, commercial: true },
  { right: 'Use across unlimited projects you own', standard: false, commercial: true },
  { right: 'Use in client work you are paid for', standard: false, commercial: true },
  { right: 'Redistribute the source files', standard: false, commercial: false },
  { right: 'Resell the product, modified or not', standard: false, commercial: false },
  { right: 'Share files publicly or in a group', standard: false, commercial: false },
  { right: 'Include files in another asset pack', standard: false, commercial: false },
];

export default function LicensePage() {
  return (
    <LegalPage
      title="Digital Product License"
      intro="What you can and cannot do with the files you buy. Each product page shows which licence applies before you purchase."
    >
      <LegalSection title="The short version">
        <p>
          You are buying a licence to <strong>use</strong> the files, not ownership of them. Build
          whatever you like with them in your own games. Do not pass the files themselves on to
          anyone else, in any form, paid or free.
        </p>
      </LegalSection>

      <LegalSection title="Licence comparison">
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface/70">
                <th className="px-4 py-3 text-left font-medium text-ink">Right</th>
                <th className="px-4 py-3 text-center font-medium text-ink">Standard</th>
                <th className="px-4 py-3 text-center font-medium text-ink">Commercial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {MATRIX.map((row) => (
                <tr key={row.right}>
                  <td className="px-4 py-3 text-ink-muted">{row.right}</td>
                  <td className="px-4 py-3 text-center">
                    <Mark allowed={row.standard} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Mark allowed={row.commercial} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          Some products carry a <strong>Custom License</strong> with terms specific to that product.
          Where a custom licence exists, it is shown on the product page and takes precedence over
          this page.
        </p>
      </LegalSection>

      <LegalSection title="You may">
        <LegalList
          items={[
            'Use the product in Roblox experiences you own and operate, including monetised ones.',
            'Modify, recolour, rescale, rebuild and combine the assets with your own work.',
            'Publish a game containing the product, where the product is a component of the game rather than the thing being distributed.',
            'Keep using the product indefinitely, including after your access to the store ends.',
            'Download every version released under the licence you bought.',
          ]}
        />
      </LegalSection>

      <LegalSection title="You may not">
        <LegalList
          items={[
            'Redistribute, share, upload or publish the source files — including in a Discord server, a group, a public repository or a file host.',
            'Resell the product, whether unmodified, modified, renamed or rebundled.',
            'Include the files in another asset pack, template or product intended for distribution.',
            'Sub-licence, rent or transfer your licence to another person or studio without written permission.',
            'Use the product to train a generative model, or to create a competing asset library.',
            'Claim authorship of the original assets.',
          ]}
        />
      </LegalSection>

      <LegalSection title="Team and studio use">
        <p>
          A Standard licence covers one developer working on their own projects. If several people
          need the source files, or the work is for a client, a Commercial licence is required.
          Publishing a finished game that includes the product is not redistribution — sending a
          teammate the .rbxm is.
        </p>
      </LegalSection>

      <LegalSection title="Attribution">
        <p>
          Attribution is not required unless a product page says otherwise. It is always welcome —
          a credit in your game description helps other creators find us.
        </p>
      </LegalSection>

      <LegalSection title="Enforcement">
        <p>
          Download links are personal and tied to your purchase. Sharing them, or the files behind
          them, may result in your licence being revoked without refund and access to the store
          being withdrawn.
        </p>
      </LegalSection>

      <LegalSection title="Not affiliated with Roblox Corporation">
        <p>
          {SITE.name} is an independent creator studio. It is not affiliated with, endorsed by or
          sponsored by Roblox Corporation. Products sold here are made for use inside Roblox Studio
          and remain subject to the Roblox Terms of Use and Community Standards, which take
          precedence over anything on this page.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function Mark({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Check className="mx-auto size-4 text-success" strokeWidth={3} />
  ) : (
    <X className="mx-auto size-4 text-danger" strokeWidth={3} />
  );
}
