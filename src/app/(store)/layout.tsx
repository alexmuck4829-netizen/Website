import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ThemeStyle } from '@/components/layout/theme-style';
import { BackToTop, ScrollProgress } from '@/components/ui/motion';
import { SettingsService } from '@/lib/services/settings-service';

export const dynamic = 'force-dynamic';

/**
 * Chrome for the customer-facing store. Settings are fetched once here and
 * passed down, so the navbar, footer and palette all follow /admin/settings.
 */
export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const settings = await SettingsService.get();

  return (
    <>
      <ThemeStyle theme={settings.theme} />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <Navbar brand={settings.brand} discordUrl={settings.links.discordUrl} />
      <main id="main" className="pt-16 lg:pt-[72px]">
        {children}
      </main>
      <Footer settings={settings} />
      <BackToTop />
    </>
  );
}
