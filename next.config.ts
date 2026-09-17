import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Demo visuals are generated locally (SVG placeholders served by /api/media).
    // Add your own CDN / Supabase Storage host here when you swap in real screenshots.
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    formats: ['image/webp'],
    // Demo preview art ships as SVG. Next refuses to optimise SVG unless this is
    // set; the CSP below sandboxes them so they cannot execute scripts.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
