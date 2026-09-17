import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

/** Chrome for the customer-facing store. The admin dashboard has its own shell. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="pt-16 lg:pt-[72px]">
        {children}
      </main>
      <Footer />
    </>
  );
}
