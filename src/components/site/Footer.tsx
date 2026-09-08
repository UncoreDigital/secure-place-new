import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ArrowUpRight } from "lucide-react";
import { footerNav, site, logo } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container-page section-y-sm">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${site.name} home`}>
              <Image
                src={logo.onDark}
                alt={site.name}
                width={logo.width}
                height={logo.height}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 text-base leading-relaxed text-white/65">
              Your trusted partner in workplace safety and awareness. Emergency
              readiness, employee empowerment and safety certification in one
              platform.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-3 text-base text-white/80 transition-colors hover:text-flame-400"
              >
                <Mail className="h-4 w-4 shrink-0 text-flame-500" />
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="group inline-flex items-center gap-3 text-base text-white/80 transition-colors hover:text-flame-400"
              >
                <Phone className="h-4 w-4 shrink-0 text-flame-500" />
                {site.phone}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {footerNav.map((column) => (
              <div key={column.title}>
                <h2 className="font-mono text-2xs font-semibold uppercase tracking-[0.16em] text-flame-500">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="link-underline text-base text-white/65 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            © {year} {site.name}. All rights reserved.
          </p>
          <a
            href="https://uncoredigital.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white/80"
          >
            Built by Uncore Digital
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
