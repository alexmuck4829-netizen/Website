import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Providers } from '@/components/layout/providers';
import { SITE } from '@/lib/constants';
import { metadataBase } from '@/lib/seo';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: `${SITE.name} — Premium Roblox Studio Assets, Maps & GUI`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'Roblox Studio assets', 'Roblox maps', 'Roblox GUI', 'Roblox scripts',
    'Roblox vehicles', 'Roblox development', 'game assets', 'Luau',
  ],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Premium Roblox Studio Resources`,
    description: SITE.description,
    images: [{ url: '/previews/modern-city-map-thumb.svg', width: 1280, height: 720, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Premium Roblox Studio Resources`,
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
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
