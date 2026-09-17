import { hexToRgbTriplet } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

/**
 * Applies the palette chosen in /admin/settings by overriding the CSS
 * variables the whole design system reads from. Rendered server-side in the
 * layout, so there is no flash of the default colour.
 */
export function ThemeStyle({ theme }: { theme: SiteSettings['theme'] }) {
  const vars = [
    ['--c-brand', theme.brand],
    ['--c-electric', theme.accent],
    ['--c-violet', theme.violet],
  ]
    .map(([name, hex]) => {
      const triplet = hexToRgbTriplet(hex ?? '');
      return triplet ? `${name}: ${triplet};` : '';
    })
    .filter(Boolean)
    .join(' ');

  if (!vars) return null;

  // A hover shade derived from the brand keeps buttons consistent.
  return <style>{`:root { ${vars} --c-brand-hover: ${hexToRgbTriplet(theme.brand) ?? ''}; }`}</style>;
}
