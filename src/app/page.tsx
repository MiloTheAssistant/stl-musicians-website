import {
  CalendarDays,
  Handshake,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
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
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--ink)]">
        <Image
          src="/images/hero-ai-02.png"
          alt="Warm stage lights cutting through concert haze in a St. Louis music venue"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,7,0.9)_0%,rgba(17,17,15,0.7)_42%,rgba(17,17,15,0.28)_100%)] lg:bg-[linear-gradient(90deg,rgba(9,9,7,0.4)_0%,rgba(17,17,15,0.46)_38%,rgba(9,9,7,0.94)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,7,0.4)_0%,rgba(9,9,7,0.1)_44%,rgba(9,9,7,0.84)_100%)]" />
        <div className="relative mx-auto grid min-h-[calc(100svh-73px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
          <div className="max-w-3xl lg:col-start-2">
            <Eyebrow>StageLink STL / Launch Platform</Eyebrow>
            <h1 className="mt-5 text-5xl font-black leading-[0.94] text-[var(--foreground)] sm:text-7xl lg:text-8xl">
              Where St. Louis musicians, venues, and fans connect.
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
        </div>
      </section>

      <SectionShell>
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
          <div>
            <Eyebrow>Discovery Engine</Eyebrow>
            <h2 className="mt-3 text-4xl font-black">
              The St. Louis music scene, all in one place.
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Search-ready genre coverage, launch-ready profiles, event listings,
              and role-specific portals give the site a real product spine from day one.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
            <VisualPanel
              src="/images/hero-ai-01.png"
              alt="Packed concert crowd under white and brass stage lights"
              label="Live Discovery"
              title="The scene, turned all the way up."
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {coreGenres.slice(0, 5).map((genre) => (
                <div
                  key={genre}
                  className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.05)] p-4 text-sm font-bold"
                >
                  {genre}
                </div>
              ))}
            </div>
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

      <section className="relative overflow-hidden border-y border-[var(--line)] bg-[var(--stage)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-34"
          style={{ backgroundImage: "url('/images/hero-ai-03.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(27,26,23,0.96)_0%,rgba(27,26,23,0.82)_48%,rgba(27,26,23,0.7)_100%)]" />
        <SectionShell>
          <div className="relative grid gap-5 lg:grid-cols-4">
            {authPortals.map((portal) => (
              <article
                key={portal.role}
                className="flex min-h-72 flex-col rounded-lg border border-[var(--line)] bg-[rgba(9,9,7,0.78)] p-5 shadow-xl backdrop-blur"
              >
                <Users className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 min-h-14 text-balance text-lg font-black leading-tight">
                  {portal.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  {portal.proofPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <ButtonLink href={portal.href} className="mt-auto w-full">
                  {portal.cta}
                </ButtonLink>
              </article>
            ))}
          </div>
        </SectionShell>
      </section>

      <SectionShell>
        <div className="mb-8 max-w-3xl">
          <Eyebrow>Find / Connect / Promote</Eyebrow>
          <h2 className="mt-3 text-4xl font-black">
            Find the sound. Book the room. Build the scene.
          </h2>
        </div>
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
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative overflow-hidden rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.38)]">
            <Image
              src="/images/hero-ai-04.png"
              alt="Outdoor night concert with crowd, riverfront city lights, and sweeping stage beams"
              width={1792}
              height={1024}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="h-72 w-full object-cover"
            />
            <div className="p-6">
              <CalendarDays className="size-6 text-[var(--brass-light)]" aria-hidden />
              <h2 className="mt-4 text-3xl font-black">Upcoming STL signals</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Discover the artists, rooms, and shows moving St. Louis.
              </p>
              <div className="mt-5 space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.title} className="border-t border-[var(--line)] pt-4">
                    <p className="font-bold">{event.title}</p>
                    <p className="text-sm text-[var(--muted)]">{event.venue}</p>
                  </div>
                ))}
              </div>
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
            <h2 className="mt-3 text-3xl font-black">
              Every St. Louis stage starts with the right connection.
            </h2>
            <p className="mt-2 text-[var(--muted)]">{siteConfig.description}</p>
          </div>
          <ButtonLink href="/sign-up">Create an account</ButtonLink>
        </SectionShell>
      </section>
    </>
  );
}

function VisualPanel({
  src,
  alt,
  label,
  title,
}: {
  src: string;
  alt: string;
  label: string;
  title: string;
}) {
  return (
    <div className="relative min-h-80 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--ink)] shadow-2xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 48vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,7,0.08)_0%,rgba(9,9,7,0.18)_44%,rgba(9,9,7,0.86)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--brass-light)]">
          {label}
        </p>
        <h3 className="mt-2 text-2xl font-black">{title}</h3>
      </div>
    </div>
  );
}
