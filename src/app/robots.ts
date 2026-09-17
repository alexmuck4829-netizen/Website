import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/', '/checkout', '/purchase/', '/library', '/cart'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
