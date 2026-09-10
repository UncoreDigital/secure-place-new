import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: Crumb[];
  children?: React.ReactNode;
};

export default function PageHero({ eyebrow, title, lede, crumbs, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pt-32 pb-16 md:pt-40 md:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-flame-500/8 blur-3xl"
      />
      <div className="container-page relative">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white/80">
                  Home
                </Link>
              </li>
              {crumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3" aria-hidden />
                  {crumb.href && i < crumbs.length - 1 ? (
                    <Link href={crumb.href} className="transition-colors hover:text-white/80">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/75" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <span className="inline-flex items-center gap-2 font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-400">
            <span className="h-1.5 w-1.5 rounded-full bg-flame-500" />
            {eyebrow}
          </span>
        )}

        <h1 className="mt-5 max-w-4xl text-fluid-2xl font-bold leading-[1.02] text-white">
          {title}
        </h1>

        {lede && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/65">{lede}</p>
        )}

        {children && <div className="mt-9">{children}</div>}
      </div>
    </section>
  );
}
