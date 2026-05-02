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
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 text-sm text-[var(--muted)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="font-bold text-[var(--foreground)]">{siteConfig.name}</p>
          <p>{siteConfig.tagline}</p>
        </div>
        <nav className="flex flex-wrap gap-4">
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
