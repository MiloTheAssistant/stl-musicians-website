import { notFound } from "next/navigation";
import {
  CalendarPlus,
  CheckCircle2,
  Mail,
  Megaphone,
  Music2,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { artistProfiles, events, promotionPackages } from "@/lib/content";
import { isKnownRole, userRoles } from "@/lib/roles";

const dashboardCards = {
  musician: [
    ["Profile strength", "82%", "Add production photos and stage plot.", Music2],
    ["Upcoming events", "3", "Post a new gig or release party.", CalendarPlus],
    ["Promotion requests", "Future", "Boost songs, albums, and events.", Megaphone],
  ],
  promoter: [
    ["Saved artists", "18", "Track artists for upcoming bills.", Star],
    ["Discovery queue", "42", "Filter by genre, media, and room fit.", Search],
    ["Campaign opportunities", "Future", "Coordinate release and event pushes.", Megaphone],
  ],
  member: [
    ["Saved profiles", "7", "Keep acts ready for private events.", Star],
    ["Open conversations", "2", "Direct communication starts here.", Mail],
    ["Event interest", "4", "Request availability for future dates.", CalendarPlus],
  ],
  admin: [
    ["Profiles to approve", "11", "Review completeness and fit.", CheckCircle2],
    ["Events pending", "5", "Moderate dates before publishing.", CalendarPlus],
    ["Trust queue", "3", "Investigate flags and spam reports.", ShieldCheck],
  ],
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const config = userRoles.find((item) => item.id === role);
  return {
    title: config ? `${config.label} Dashboard` : "Dashboard",
  };
}

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isKnownRole(role)) {
    notFound();
  }

  const config = userRoles.find((item) => item.id === role);

  if (!config) {
    notFound();
  }

  return (
    <SectionShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>{config.label}</Eyebrow>
          <h1 className="mt-3 text-5xl font-black">{config.headline}</h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{config.description}</p>
        </div>
        <ButtonLink href={`/login/${role}`}>Account entry</ButtonLink>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {dashboardCards[role].map(([title, value, description, Icon]) => (
          <article key={title} className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <Icon className="size-5 text-[var(--brass-light)]" aria-hidden />
            <p className="mt-5 text-sm text-[var(--muted)]">{title}</p>
            <p className="mt-1 text-4xl font-black">{value}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <h2 className="text-2xl font-black">Scene feed</h2>
          <div className="mt-5 space-y-4">
            {artistProfiles.slice(0, 4).map((artist) => (
              <div key={artist.slug} className="flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
                <div>
                  <p className="font-bold">{artist.name}</p>
                  <p className="text-sm text-[var(--muted)]">{artist.genre} / {artist.homeBase}</p>
                </div>
                <span className="text-xs uppercase text-[var(--brass-light)]">{artist.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <h2 className="text-2xl font-black">Promotion roadmap</h2>
          <div className="mt-5 space-y-4">
            {promotionPackages.map((item) => (
              <div key={item} className="border-t border-[var(--line)] pt-4">
                <p className="font-bold">{item}</p>
                <p className="text-sm text-[var(--muted)]">
                  Reserved for Phase 4 paid campaign fulfillment.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-10 rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.32)] p-6">
        <h2 className="text-2xl font-black">Upcoming event signals</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <div key={event.title} className="rounded-md bg-[rgba(9,9,7,0.45)] p-4">
              <p className="font-bold">{event.title}</p>
              <p className="text-sm text-[var(--muted)]">{event.venue}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
