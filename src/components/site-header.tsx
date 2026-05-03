import { Show, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { CalendarDays, MapPin, Music2 } from "lucide-react";
import { ButtonLink } from "@/components/ui";
import { siteConfig } from "@/lib/content";

const navItems = [
  { href: "/musicians", label: "Musicians", icon: Music2 },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/venues", label: "Venues", icon: MapPin },
];

export function SiteHeader() {
  const hasClerkEnv = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(17,17,15,0.88)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label={`${siteConfig.name} home`}>
          <LogoMark />
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase tracking-[0.08em] text-[var(--foreground)]">
              STL Musicians
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
          {hasClerkEnv ? (
            <Show
              when="signed-out"
              fallback={
                <>
                  <ButtonLink href="/dashboard" variant="secondary">
                    Dashboard
                  </ButtonLink>
                  <SignOutButton redirectUrl="/dashboard">
                    <button
                      className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-4 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[rgba(245,234,210,0.14)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                      type="button"
                    >
                      Sign out
                    </button>
                  </SignOutButton>
                </>
              }
            >
              <ButtonLink href="/dashboard">Sign-Up / Sign-In</ButtonLink>
            </Show>
          ) : (
            <ButtonLink href="/dashboard">Sign-Up / Sign-In</ButtonLink>
          )}
        </div>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span className="flex size-11 items-center justify-center rounded-md border border-[rgba(245,234,210,0.18)] bg-[var(--brass)] text-[var(--ink)] shadow-[0_0_24px_rgba(181,139,42,0.28)]">
      <svg
        aria-hidden
        className="size-8"
        fill="none"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 42C16.8 24 23.8 14 32 14s15.2 10 19 28"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M18 42h28"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="5"
        />
        <path
          d="M22 34v-8M30 42V25M38 42V29M46 34v-6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <circle cx="48" cy="18" fill="currentColor" r="3" />
      </svg>
    </span>
  );
}
