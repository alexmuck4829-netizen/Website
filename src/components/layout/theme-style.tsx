import { hexToRgbTriplet } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

/** Éclaircit un triplet « r g b » en le mélangeant avec du blanc. */
function tint(triplet: string, amount: number): string {
  return triplet
    .split(' ')
    .map((channel) => Math.round(Number(channel) + (255 - Number(channel)) * amount))
    .join(' ');
}

/**
 * Applies the palette chosen in /admin/settings by overriding the CSS
 * variables the whole design system reads from. Rendered server-side in the
 * layout, so there is no flash of the default colour.
 */
export function ThemeStyle({ theme }: { theme: SiteSettings['theme'] }) {
  const brand = hexToRgbTriplet(theme.brand ?? '');
  const accent = hexToRgbTriplet(theme.accent ?? '');
  const violet = hexToRgbTriplet(theme.violet ?? '');

  const vars = [
    brand && `--c-brand: ${brand};`,
    accent && `--c-electric: ${accent};`,
    violet && `--c-violet: ${violet};`,
    // Sur fond clair, le survol s'éclaircit et le fond doux est une teinte
    // très diluée de la marque : les deux se déduisent, l'admin n'a que
    // trois couleurs à choisir.
    brand && `--c-brand-hover: ${tint(brand, 0.28)};`,
    brand && `--c-brand-soft: ${tint(brand, 0.9)};`,
    brand && `--c-lavender: ${tint(brand, 0.62)};`,
    brand && `--c-line-strong: ${tint(brand, 0.78)};`,
  ]
    .filter(Boolean)
    .join(' ');

  if (!vars) return null;

  return <style>{`:root { ${vars} }`}</style>;
}
