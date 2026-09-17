import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { LegalPage, LegalSection } from '@/components/legal/legal-page';
import { SettingsService } from '@/lib/services/settings-service';
import { absoluteUrlSafe } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description:
    'Identification de l’éditeur du site, de l’hébergeur et des coordonnées de contact.',
  alternates: { canonical: absoluteUrlSafe('/mentions-legales') },
};

/**
 * Mentions légales — LCEN (loi 2004-575) art. 6 III.
 *
 * Les valeurs viennent de /admin/settings → Mentions légales. Tant qu'un champ
 * obligatoire est vide, la page l'affiche explicitement comme manquant plutôt
 * que de laisser un trou silencieux : mieux vaut voir le problème que le cacher.
 */
export default async function MentionsLegalesPage() {
  const { legal, brand, links } = await SettingsService.get();
  const isCompany = legal.editorType === 'company';

  const required: { label: string; value: string }[] = [
    { label: isCompany ? 'Dénomination sociale' : 'Nom et prénom', value: legal.editorName },
    { label: 'Adresse', value: legal.address },
    { label: 'E-mail', value: legal.email || links.supportEmail },
    { label: 'Téléphone', value: legal.phone },
    ...(isCompany
      ? [
          { label: 'Forme juridique', value: legal.legalForm },
          { label: 'Capital social', value: legal.shareCapital },
          { label: 'RCS', value: legal.rcs },
        ]
      : []),
    { label: 'SIREN / SIRET', value: legal.registrationNumber },
    { label: 'Directeur de la publication', value: legal.publicationDirector },
  ];

  const missing = required.filter((f) => !f.value.trim());

  return (
    <LegalPage
      title="Mentions légales"
      intro="Informations relatives à l’éditeur et à l’hébergeur de ce site."
      showTemplateNotice={false}
    >
      {missing.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-danger/10 p-5">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
          <div className="space-y-1.5">
            <p className="font-medium text-danger">
              {missing.length} information{missing.length > 1 ? 's' : ''} obligatoire
              {missing.length > 1 ? 's' : ''} manquante{missing.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">
              Un site professionnel doit publier ces informations (LCEN, article 6 III).
              Renseignez-les dans <strong className="text-ink">/admin/settings → Mentions
              légales</strong> : {missing.map((f) => f.label).join(', ')}.
            </p>
          </div>
        </div>
      )}

      <LegalSection title="Éditeur du site">
        <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {required.map((field) => (
            <Row key={field.label} label={field.label} value={field.value} />
          ))}
          {legal.vatRegistered && (
            <Row label="TVA intracommunautaire" value={legal.vatNumber} />
          )}
        </dl>
        <p className="text-sm">
          Site : <strong>{brand.name}</strong>
        </p>
      </LegalSection>

      <LegalSection title="Hébergeur">
        <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
          <Row label="Hébergeur" value={legal.hostName} />
          <Row label="Adresse" value={legal.hostAddress} />
          <Row label="Contact" value={legal.hostPhone} />
        </dl>
        <p className="text-sm">
          Si vous déployez ailleurs que sur l’hébergeur indiqué, corrigez ces informations dans
          l’administration.
        </p>
      </LegalSection>

      <LegalSection title="Médiation de la consommation">
        {legal.mediatorName ? (
          <p>
            Conformément à l’article L.612-1 du Code de la consommation, vous pouvez recourir
            gratuitement au médiateur suivant :{' '}
            <strong>{legal.mediatorName}</strong>
            {legal.mediatorUrl && (
              <>
                {' '}—{' '}
                <a href={legal.mediatorUrl} target="_blank" rel="noopener noreferrer">
                  {legal.mediatorUrl}
                </a>
              </>
            )}
            .
          </p>
        ) : (
          <p>
            <strong className="text-gold">À compléter.</strong> Un professionnel qui vend à des
            consommateurs en France doit adhérer à un dispositif de médiation de la consommation et
            en communiquer les coordonnées (article L.612-1 du Code de la consommation). Renseignez
            le médiateur dans l’administration.
          </p>
        )}
        <p className="text-sm">
          Plateforme européenne de règlement en ligne des litiges :{' '}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
            ec.europa.eu/consumers/odr
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Propriété intellectuelle">
        <p>
          Les contenus de ce site (textes, visuels, produits numériques) sont protégés. Les
          conditions d’utilisation des produits vendus sont décrites sur la page{' '}
          <Link href="/license">Licence</Link>.
        </p>
        <p>
          {brand.name} est un studio indépendant, sans affiliation avec Roblox Corporation.
          « Roblox » et « Roblox Studio » sont des marques de Roblox Corporation, citées à des fins
          de description de compatibilité.
        </p>
      </LegalSection>

      <LegalSection title="Données personnelles">
        <p>
          Le traitement de vos données est décrit dans notre{' '}
          <Link href="/privacy">politique de confidentialité</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3">
      <dt className="text-sm text-ink-subtle">{label}</dt>
      <dd className={value ? 'text-sm font-medium text-ink' : 'text-sm font-medium text-danger'}>
        {value || 'à renseigner'}
      </dd>
    </div>
  );
}
