import Link from "next/link";
import { AudioLines, CalendarDays, MapPin, Music2 } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { siteConfig } from "@/lib/content";

const navItems = [
  { href: "/musicians", label: "Musicians", icon: Music2 },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/venues", label: "Venues", icon: MapPin },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(17,17,15,0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-[var(--brass)] text-[var(--ink)]">
            <AudioLines className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase text-[var(--foreground)]">
              {siteConfig.name}
            </span>
            <span className="hidden text-xs text-[var(--muted)] sm:block">
              St. Louis music discovery
            </span>
          </span>
        </Link>
        <nav className="order-3 flex w-full items-center justify-center gap-1 md:order-none md:w-auto md:justify-start">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[rgba(245,234,210,0.08)] hover:text-[var(--foreground)]"
            >
              <item.icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/dashboard">Sign-Up / Sign-In</ButtonLink>
        </div>
      </div>
    </header>
  );
}
