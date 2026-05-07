import Link from "next/link";
import { siteConfig } from "@/lib/content";

const links = [
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Pricing", "/pricing"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"],
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ink)]">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-[var(--muted)] sm:px-6 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start lg:px-8">
        <div className="space-y-1">
          <p className="font-bold text-[var(--foreground)]">
            {siteConfig.name}
          </p>
          <p>{siteConfig.tagline}</p>
        </div>
        <address className="not-italic">
          <dl className="grid gap-1">
            <div className="flex flex-wrap gap-x-2">
              <dt>Contact email:</dt>
              {" "}
              <dd>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[var(--foreground)] hover:text-[var(--brass-light)]"
                >
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt>Contact phone:</dt>
              {" "}
              <dd>
                <a
                  href={siteConfig.phoneHref}
                  className="text-[var(--foreground)] hover:text-[var(--brass-light)]"
                >
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt>Location:</dt>
              {" "}
              <dd className="text-[var(--foreground)]">{siteConfig.location}</dd>
            </div>
          </dl>
        </address>
        <nav className="flex flex-wrap gap-4 lg:justify-end">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-[var(--foreground)]">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
