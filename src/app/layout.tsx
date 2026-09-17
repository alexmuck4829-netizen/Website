import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Providers } from '@/components/layout/providers';
import { SITE } from '@/lib/constants';
import { metadataBase } from '@/lib/seo';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: `${SITE.name} — Assets, maps et GUI premium pour Roblox Studio`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'assets Roblox Studio', 'maps Roblox', 'GUI Roblox', 'scripts Roblox',
    'véhicules Roblox', 'développement Roblox', 'assets de jeu', 'Luau',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Ressources premium pour Roblox Studio`,
    description: SITE.description,
    images: [{ url: '/previews/modern-city-map-thumb.svg', width: 1280, height: 720, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Ressources premium pour Roblox Studio`,
    description: SITE.description,
    images: ['/previews/modern-city-map-thumb.svg'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08080c',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
