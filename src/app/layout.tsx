import type { Metadata } from "next";
import { Archivo, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import { site } from "@/lib/site";
import Header from "@/components/site/Header";
import { getWorkshops } from "@/lib/content";
import Footer from "@/components/site/Footer";
import RevealProvider from "@/components/site/RevealProvider";
import "./globals.css";

/**
 * Archivo carries headings -- a grotesque with enough width and weight to read
 * as institutional signage, which suits a certification mark. Public Sans sets
 * body copy; it was designed for public-sector communication, so it stays
 * legible at small sizes and in dense compliance detail. Plex Mono is reserved
 * for figures: scores, counts, durations.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-archivo",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Workplace Safety Certification`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Workplace Safety Certification`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Workplace Safety Certification`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/assets/img/logo/favicon.png" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Only plain data crosses into the client Header; it composes the menu
  // itself, because Lucide icon components cannot be serialised as props.
  const workshops = await getWorkshops();
  const workshopNav = workshops.map((w) => ({
    slug: w.slug,
    title: w.title,
    summary: w.summary,
    durationMinutes: w.durationMinutes,
    format: w.format as string,
  }));

  return (
    <html lang="en" className={`${archivo.variable} ${publicSans.variable} ${plexMono.variable}`}>
      {/*
        suppressHydrationWarning is here for browser extensions, not for our own
        markup. Grammarly and similar tools stamp attributes onto <body>
        (data-gr-ext-installed, data-new-gr-c-s-check-loaded) before React
        hydrates, which React then reports as a mismatch the page cannot fix.

        It suppresses warnings for this element's own attributes only — one
        level deep, not the subtree — so a genuine mismatch inside any component
        still surfaces normally.
      */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <noscript>
          {/* Motion sets an initial hidden state inline; without scripts that would
              leave sections blank, so force them visible. */}
          <style>{`[data-motion]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-flame-500 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <RevealProvider />
        <Header workshops={workshopNav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
