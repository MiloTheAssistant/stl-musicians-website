import {
  CalendarDays,
  Handshake,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import {
  artistProfiles,
  authPortals,
  coreGenres,
  events,
  promotionPackages,
  siteConfig,
  venues,
} from "@/lib/content";

const stats = [
  ["10", "core genres"],
  ["4", "launch portals"],
  ["314", "metro-first focus"],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)]">
        <div className="absolute inset-0 stage-visual opacity-70" aria-hidden />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,rgba(17,17,15,0.78)_48%,rgba(17,17,15,0.2)_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-73px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow>StageLink STL / Launch Platform</Eyebrow>
            <h1 className="mt-5 text-5xl font-black leading-[0.94] text-[var(--foreground)] sm:text-7xl lg:text-8xl">
              Where St. Louis music gets discovered, promoted, and booked.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              A serious local music hub for musicians, bands, promoters, small
              venues, and fans who need one place to find the next room, bill,
              release, or opportunity.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/musicians">Explore musicians</ButtonLink>
              <ButtonLink href="/login/musician" variant="secondary">
                Promote your music
              </ButtonLink>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map(([value, label]) => (
                <div key={label} className="border-l border-[var(--brass)] pl-4">
                  <p className="text-3xl font-black">{value}</p>
                  <p className="text-xs font-semibold uppercase text-[var(--muted)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="record-visual relative aspect-[4/5] overflow-hidden rounded-lg border border-[var(--line)] shadow-2xl">
              <div className="absolute inset-x-8 bottom-8 rounded-md bg-[rgba(9,9,7,0.86)] p-6 backdrop-blur">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--brass-light)]">
                  Featured Tonight
                </p>
                <h2 className="mt-3 text-3xl font-black">River City New Music Night</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Jazz horns, hip-hop releases, rock clubs, country rooms, and
                  everything current across the STL metro.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Eyebrow>Discovery Engine</Eyebrow>
            <h2 className="mt-3 text-4xl font-black">Built around the actual scene.</h2>
            <p className="mt-4 text-[var(--muted)]">
              Search-ready genre coverage, launch-ready profiles, event listings,
              and role-specific portals give the site a real product spine from day one.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {coreGenres.map((genre) => (
              <div
                key={genre}
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.05)] p-4 text-sm font-bold"
              >
                {genre}
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {artistProfiles.slice(0, 3).map((artist) => (
            <article
              key={artist.slug}
              className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <Tag>{artist.genre}</Tag>
                <span className="text-xs uppercase text-[var(--muted)]">{artist.homeBase}</span>
              </div>
              <h3 className="mt-5 text-2xl font-black">{artist.name}</h3>
              <p className="mt-3 min-h-24 text-sm leading-6 text-[var(--muted)]">
                {artist.shortBio}
              </p>
              <ButtonLink href={`/musicians/${artist.slug}`} variant="ghost" className="mt-5 px-0">
                View profile
              </ButtonLink>
            </article>
          ))}
        </div>
      </SectionShell>

      <section className="border-y border-[var(--line)] bg-[var(--stage)]">
        <SectionShell>
          <div className="grid gap-5 lg:grid-cols-4">
            {authPortals.map((portal) => (
              <article key={portal.role} className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5">
                <Users className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 text-xl font-black">{portal.title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {portal.proofPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ButtonLink href={portal.href} className="mt-5 w-full">
                  {portal.cta}
                </ButtonLink>
              </article>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [Search, "Find", "Search musicians by genre, room fit, home base, media, and event style."],
            [Handshake, "Connect", "Members, venues, and promoters get direct paths to start serious conversations."],
            [Megaphone, "Promote", `Future paid services include ${promotionPackages.join(", ").toLowerCase()}.`],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="rounded-lg border border-[var(--line)] p-6">
              <Icon className="size-6 text-[var(--brass-light)]" aria-hidden />
              <h3 className="mt-4 text-2xl font-black">{String(title)}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{String(text)}</p>
            </div>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.38)] p-6">
            <CalendarDays className="size-6 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-4 text-3xl font-black">Upcoming STL signals</h2>
            <div className="mt-5 space-y-4">
              {events.slice(0, 3).map((event) => (
                <div key={event.title} className="border-t border-[var(--line)] pt-4">
                  <p className="font-bold">{event.title}</p>
                  <p className="text-sm text-[var(--muted)]">{event.venue}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[var(--line)] bg-[rgba(75,23,28,0.42)] p-6">
            <ShieldCheck className="size-6 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-4 text-3xl font-black">Curated, not scraped into dust.</h2>
            <p className="mt-4 text-[var(--muted)]">
              Admin approval, profile status, and future review signals keep the
              hub useful for working musicians and serious buyers.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {venues.map((venue) => (
                <div key={venue.name} className="rounded-md bg-[rgba(9,9,7,0.42)] p-4">
                  <p className="font-bold">{venue.name}</p>
                  <p className="text-sm text-[var(--muted)]">{venue.neighborhood}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <section className="border-t border-[var(--line)] bg-[var(--ink)]">
        <SectionShell className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Sparkles className="size-6 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-3 text-3xl font-black">Ready to wire up the scene?</h2>
            <p className="mt-2 text-[var(--muted)]">{siteConfig.description}</p>
          </div>
          <ButtonLink href="/sign-up">Create an account</ButtonLink>
        </SectionShell>
      </section>
    </>
  );
}
