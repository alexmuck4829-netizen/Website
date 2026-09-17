/**
 * Generates the demo preview art shipped with the starter catalogue.
 * These are placeholders: drop your real Roblox Studio screenshots into
 * /public/previews using the same filenames and every page updates.
 *
 *   node scripts/generate-previews.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'previews');
mkdirSync(OUT, { recursive: true });

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const rng = (seed) => {
  let s = hash(seed) || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
};

/** Isometric-ish blocked skyline: reads as a Studio scene at thumbnail size. */
function scene(seed, palette, label, kind) {
  const r = rng(seed);
  const W = 1280, H = 720;
  const [c1, c2] = palette;
  const parts = [];

  // horizon glow
  parts.push(`<ellipse cx="${W * (0.3 + r() * 0.4)}" cy="${H * 0.62}" rx="${W * 0.55}" ry="${H * 0.3}" fill="url(#glow)" opacity="0.55"/>`);

  if (kind === 'gui') {
    // stacked UI panels
    for (let i = 0; i < 3; i += 1) {
      const w = 300 + r() * 220, h = 150 + r() * 200;
      const x = 150 + i * 240 + r() * 60, y = 180 + r() * 140;
      parts.push(`<g opacity="${0.55 + i * 0.15}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="#12121b" stroke="${i === 1 ? c1 : '#2a2a38'}" stroke-width="2"/>`);
      parts.push(`<rect x="${x + 18}" y="${y + 18}" width="${w * 0.45}" height="12" rx="6" fill="${c1}" opacity="0.8"/>`);
      for (let k = 0; k < 4; k += 1) {
        parts.push(`<rect x="${x + 18}" y="${y + 48 + k * 26}" width="${w - 36 - r() * 80}" height="10" rx="5" fill="#ffffff" opacity="${0.1 + r() * 0.12}"/>`);
      }
      parts.push(`<rect x="${x + 18}" y="${y + h - 46}" width="110" height="30" rx="10" fill="url(#accent)"/></g>`);
    }
  } else if (kind === 'code') {
    for (let i = 0; i < 16; i += 1) {
      const w = 120 + r() * 620;
      parts.push(`<rect x="${210 + (i % 3) * 22}" y="${150 + i * 26}" width="${w}" height="11" rx="5" fill="${i % 5 === 0 ? c1 : '#ffffff'}" opacity="${i % 5 === 0 ? 0.75 : 0.11 + r() * 0.1}"/>`);
    }
    parts.push(`<rect x="150" y="128" width="8" height="448" rx="4" fill="${c2}" opacity="0.5"/>`);
  } else if (kind === 'vehicle') {
    const bx = 300, by = 340;
    parts.push(`<path d="M${bx} ${by + 120} L${bx + 90} ${by} L${bx + 420} ${by} L${bx + 560} ${by + 70} L${bx + 660} ${by + 120} L${bx + 660} ${by + 190} L${bx} ${by + 190} Z" fill="url(#accent)" opacity="0.85"/>`);
    parts.push(`<path d="M${bx + 120} ${by + 20} L${bx + 400} ${by + 20} L${bx + 490} ${by + 78} L${bx + 120} ${by + 78} Z" fill="#0b0b12" opacity="0.7"/>`);
    for (const cx of [bx + 150, bx + 520]) {
      parts.push(`<circle cx="${cx}" cy="${by + 190}" r="62" fill="#0b0b12" stroke="${c1}" stroke-width="6"/><circle cx="${cx}" cy="${by + 190}" r="24" fill="${c2}" opacity="0.6"/>`);
    }
  } else {
    // blocky skyline / build
    const count = kind === 'props' ? 14 : 9;
    for (let i = 0; i < count; i += 1) {
      const w = 70 + r() * 150;
      const h = (kind === 'props' ? 60 : 150) + r() * (kind === 'props' ? 90 : 300);
      const x = 60 + i * (W - 160) / count + r() * 30;
      const y = H - 120 - h;
      const top = 26 + r() * 16;
      parts.push(`<g>
        <path d="M${x} ${y + top} L${x + w / 2} ${y} L${x + w} ${y + top} L${x + w} ${y + h} L${x} ${y + h} Z" fill="#171724" stroke="#2b2b3d" stroke-width="2"/>
        <path d="M${x} ${y + top} L${x + w / 2} ${y} L${x + w / 2} ${y + h} L${x} ${y + h} Z" fill="${i % 3 === 0 ? c1 : '#1d1d2c'}" opacity="${i % 3 === 0 ? 0.45 : 1}"/>`);
      for (let f = 0; f < Math.floor(h / 55); f += 1) {
        if (r() > 0.45) {
          parts.push(`<rect x="${x + 12 + r() * (w / 2 - 34)}" y="${y + top + 20 + f * 55}" width="16" height="22" rx="3" fill="${c2}" opacity="${0.35 + r() * 0.5}"/>`);
        }
      }
      parts.push('</g>');
    }
    parts.push(`<path d="M0 ${H - 120} L${W} ${H - 120} L${W} ${H} L0 ${H} Z" fill="#0d0d15"/>`);
    for (let i = 0; i < 9; i += 1) {
      parts.push(`<rect x="${i * 150 + 30}" y="${H - 66}" width="86" height="5" rx="2" fill="${c1}" opacity="0.3"/>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a10"/><stop offset="55%" stop-color="#101019"/><stop offset="100%" stop-color="#08080d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow"><stop offset="0%" stop-color="${c1}" stop-opacity="0.5"/><stop offset="100%" stop-color="${c1}" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  ${parts.join('\n  ')}
  <rect width="${W}" height="${H}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2"/>
</svg>`;
}

const PALETTES = {
  violet: ['#7C5CFF', '#3D8BFF'], blue: ['#3D8BFF', '#22D3EE'], pink: ['#A855F7', '#EC4899'],
  green: ['#34D399', '#3D8BFF'], amber: ['#F5A524', '#F45B69'], cyan: ['#22D3EE', '#34D399'],
  slate: ['#94A3B8', '#3D8BFF'], gold: ['#FBBF24', '#7C5CFF'],
};

const ITEMS = JSON.parse(process.argv[2] ?? '[]');
let n = 0;
for (const { slug, palette, kind, shots } of ITEMS) {
  const p = PALETTES[palette] ?? PALETTES.violet;
  writeFileSync(join(OUT, `${slug}-thumb.svg`), scene(`${slug}-t`, p, slug, kind));
  n += 1;
  for (let i = 1; i <= (shots ?? 4); i += 1) {
    writeFileSync(join(OUT, `${slug}-${i}.svg`), scene(`${slug}-${i}`, p, slug, kind));
    n += 1;
  }
}
// Generic fallback used by newly created products until a thumbnail is uploaded.
writeFileSync(join(OUT, 'placeholder.svg'), scene('placeholder', PALETTES.violet, 'Product preview', 'build'));
console.log(`generated ${n + 1} preview files`);
