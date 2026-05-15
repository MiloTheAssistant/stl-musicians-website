import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { siteConfig } from "@/lib/content";
import {
  getReleaseSmartLinkPath,
  getSmartLinkReleaseBySlug,
} from "@/lib/song-promotion";
import { captureReleaseFanLead } from "./actions";

type ReleasePageProps = {
  params: Promise<{ releaseSlug: string }>;
  searchParams?: Promise<{ lead?: string }>;
};

export async function generateMetadata({
  params,
}: ReleasePageProps): Promise<Metadata> {
  const { releaseSlug } = await params;
  const release = getSmartLinkReleaseBySlug(releaseSlug);

  if (!release) {
    return {
      title: "Release not found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = getReleaseSmartLinkPath(release);
  const imageUrl = release.artworkUrl
    ? new URL(release.artworkUrl, siteConfig.url).toString()
    : undefined;

  return {
    title: `${release.title} by ${release.bandName}`,
    description: release.summary,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${release.title} by ${release.bandName}`,
      description: release.summary,
      url: canonicalPath,
      siteName: siteConfig.name,
      type: "music.song",
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  };
}

export default async function ReleaseSmartLinkPage({
  params,
  searchParams,
}: ReleasePageProps) {
  const { releaseSlug } = await params;
  const query = await searchParams;
  const release = getSmartLinkReleaseBySlug(releaseSlug);

  if (!release) {
    notFound();
  }

  const releasePath = getReleaseSmartLinkPath(release);
  const releaseDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${release.releaseDate}T00:00:00Z`));
  const launchPathItems = [
    {
      label: "SmartLink",
      value: "Live hub",
      detail: "One shareable page for fans, venues, ads, and local discovery.",
    },
    {
      label: "Release date",
      value: releaseDate,
      detail: "Built around the public launch window and follow-up recap.",
    },
    {
      label: "Local signal",
      value: "STL push",
      detail: "Connects the song to local show, calendar, and fan moments.",
    },
  ];
  const localPushItems = [
    {
      icon: MapPin,
      title: "Featured release lane",
      detail: release.localTieIns[0],
    },
    {
      icon: CalendarDays,
      title: "Show and venue tie-ins",
      detail: release.localTieIns[1],
    },
    {
      icon: Bell,
      title: "Fan update capture",
      detail: release.localTieIns[2],
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "MusicRecording",
          name: release.primaryTrackTitle,
          byArtist: {
            "@type": "MusicGroup",
            name: release.bandName,
            url: `${siteConfig.url}/artists/${release.bandSlug}`,
          },
          datePublished: release.releaseDate,
          image: release.artworkUrl
            ? new URL(release.artworkUrl, siteConfig.url).toString()
            : undefined,
          url: `${siteConfig.url}${releasePath}`,
        }}
      />
      <main>
        <section className="relative isolate overflow-hidden border-b border-[var(--line)] bg-[var(--ink)]">
          <Image
            src="/images/hero-ai-01.png"
            alt=""
            fill
            preload
            sizes="100vw"
            className="absolute inset-0 -z-30 size-full object-cover"
          />
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(9,9,7,0.96)_0%,rgba(9,9,7,0.84)_38%,rgba(33,49,77,0.48)_68%,rgba(9,9,7,0.68)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_28%,rgba(216,183,101,0.28),transparent_26%),linear-gradient(180deg,rgba(9,9,7,0.16),rgba(9,9,7,0.88))]" />

          <div className="mx-auto grid min-h-[calc(100svh-9rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.56fr)] lg:px-8">
            <div className="min-w-0 max-w-3xl">
              <div className="flex flex-wrap gap-2">
                <Tag>Featured STL release</Tag>
                <Tag>{release.releaseType}</Tag>
                <Tag>{releaseDate}</Tag>
              </div>
              <div className="mt-8">
                <Eyebrow>SmartLink release page</Eyebrow>
              </div>
              <h1 className="mt-4 max-w-[12ch] text-4xl font-black leading-[0.96] text-[var(--foreground)] sm:max-w-3xl sm:text-6xl lg:text-7xl">
                {release.title}
              </h1>
              <p className="mt-5 text-xl font-black text-[var(--brass-light)]">
                {release.bandName} / {release.primaryTrackTitle}
              </p>
              <p className="mt-6 max-w-[32ch] text-lg leading-8 text-[rgba(245,234,210,0.82)] sm:max-w-2xl">
                {release.summary} Built for fans, venues, and launch-day sharing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {release.destinationLinks.slice(0, 3).map((link) => (
                  <ButtonLink
                    key={link.id}
                    href={`${releasePath}/go/${link.id}?source=hero`}
                  >
                    {link.platform}
                  </ButtonLink>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full min-w-0 max-w-[420px] rounded-lg border border-[rgba(245,234,210,0.2)] bg-[rgba(9,9,7,0.72)] p-4 shadow-2xl shadow-black/45 backdrop-blur-sm">
              {release.artworkUrl ? (
                <div className="overflow-hidden rounded-md border border-[rgba(216,183,101,0.28)] bg-[var(--muted)] p-5">
                  <Image
                    src={release.artworkUrl}
                    alt={`${release.bandName} ${release.title} artwork`}
                    width={900}
                    height={900}
                    sizes="(max-width: 768px) 82vw, 360px"
                    className="aspect-square w-full scale-[0.82] object-contain"
                  />
                </div>
              ) : null}
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-3">
                  <p className="text-xs font-bold uppercase text-[var(--brass-light)]">
                    Local push
                  </p>
                  <p className="mt-1 font-black">STL release lane</p>
                </div>
                <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-3">
                  <p className="text-xs font-bold uppercase text-[var(--brass-light)]">
                    Fan capture
                  </p>
                  <p className="mt-1 font-black">Launch updates</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionShell className="scroll-mt-24" id="smartlink-details">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.76fr)_minmax(320px,0.46fr)]">
            <section className="rounded-lg border border-[var(--line)] bg-[linear-gradient(135deg,rgba(245,234,210,0.08),rgba(33,49,77,0.2))] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow>Authorized handoffs</Eyebrow>
                  <h2 className="mt-3 max-w-3xl text-3xl font-black">
                    Release destinations
                  </h2>
                </div>
                <Tag>{release.destinationLinks.length} links</Tag>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {release.destinationLinks.map((link, index) => (
                  <a
                    key={link.id}
                    href={`${releasePath}/go/${link.id}?source=destination-card`}
                    className="group grid min-h-44 rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.42)] p-5 transition hover:border-[var(--brass)] hover:bg-[rgba(9,9,7,0.58)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs font-bold uppercase text-[var(--brass-light)]">
                          0{index + 1}
                        </p>
                        <h3 className="mt-3 text-xl font-black">
                          {link.platform}
                        </h3>
                      </div>
                      <span className="inline-flex size-9 items-center justify-center rounded-full border border-[var(--line)] text-[var(--brass-light)] transition group-hover:border-[var(--brass)]">
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                      {link.description}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <Tag>{link.status}</Tag>
                      <p className="text-sm font-bold text-[var(--brass-light)]">
                        {link.ctaLabel}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <aside className="grid gap-6">
              <section className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
                <Mail className="size-5 text-[var(--brass-light)]" aria-hidden />
                <Eyebrow>Fan update desk</Eyebrow>
                <h2 className="mt-3 text-2xl font-black">Follow the launch</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Get Case44 release updates, local show tie-ins, and STL-Musicians
                  launch notes.
                </p>
                <form action={captureReleaseFanLead} className="mt-5 space-y-3">
                  <input type="hidden" name="releaseSlug" value={release.slug} />
                  <input type="hidden" name="source" value="smartlink" />
                  <label className="block text-sm font-bold" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="fan@example.com"
                    className="min-h-11 w-full rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-[var(--foreground)] outline-none focus:border-[var(--brass)]"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)]"
                  >
                    Get release updates
                  </button>
                  {query?.lead === "received" ? (
                    <p className="text-sm font-bold text-[var(--brass-light)]">
                      You are on the release update list.
                    </p>
                  ) : null}
                  {query?.lead === "invalid" ? (
                    <p className="text-sm font-bold text-[var(--brass-light)]">
                      Enter a valid email address.
                    </p>
                  ) : null}
                </form>
              </section>

              <section className="rounded-lg border border-[var(--line)] bg-[rgba(9,9,7,0.38)] p-6">
                <Eyebrow>Launch path</Eyebrow>
                <div className="mt-5 divide-y divide-[var(--line)]">
                  {launchPathItems.map((item) => (
                    <div key={item.label} className="py-4 first:pt-0 last:pb-0">
                      <p className="text-xs font-bold uppercase text-[var(--brass-light)]">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xl font-black">{item.value}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {item.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>

          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.66fr)_minmax(320px,0.34fr)]">
            <div className="rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.3)] p-6">
              <Eyebrow>STL release circuit</Eyebrow>
              <h2 className="mt-3 text-3xl font-black">Local push modules</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {localPushItems.map(({ icon: Icon, title, detail }) => (
                  <article
                    key={title}
                    className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-4"
                  >
                    <Icon className="size-5 text-[var(--brass-light)]" aria-hidden />
                    <h3 className="mt-4 text-lg font-black">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      {detail}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[rgba(75,23,28,0.28)] p-6">
              <ShieldCheck className="size-5 text-[var(--brass-light)]" aria-hidden />
              <Eyebrow>Managed guardrails</Eyebrow>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[var(--muted)]">
                {release.guardrails.map((guardrail) => (
                  <li key={guardrail} className="flex gap-3">
                    <CheckCircle2
                      className="mt-0.5 size-4 shrink-0 text-[var(--brass-light)]"
                      aria-hidden
                    />
                    <span>{guardrail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </SectionShell>
      </main>
    </>
  );
}
