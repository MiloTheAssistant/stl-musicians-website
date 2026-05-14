import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
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

        <SectionShell className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
          <div>
            <Eyebrow>Listen and follow</Eyebrow>
            <h2 className="mt-3 max-w-3xl text-3xl font-black">
              Release destinations
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {release.destinationLinks.map((link) => (
                <a
                  key={link.id}
                  href={`${releasePath}/go/${link.id}?source=destination-card`}
                  className="rounded-md border border-[var(--line)] bg-[linear-gradient(135deg,rgba(245,234,210,0.08),rgba(33,49,77,0.24))] p-5 transition hover:border-[var(--brass)] hover:bg-[rgba(245,234,210,0.12)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black">{link.platform}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {link.description}
                      </p>
                    </div>
                    <Tag>{link.status}</Tag>
                  </div>
                  <p className="mt-4 text-sm font-bold text-[var(--brass-light)]">
                    {link.ctaLabel}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
              <Eyebrow>Get release updates</Eyebrow>
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
            </div>

            <div className="rounded-md border border-[var(--line)] bg-[rgba(33,49,77,0.3)] p-6">
              <Eyebrow>Local STL push</Eyebrow>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {release.localTieIns.map((tieIn) => (
                  <li key={tieIn}>{tieIn}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-[var(--line)] bg-[rgba(75,23,28,0.28)] p-6">
              <Eyebrow>Promotion guardrails</Eyebrow>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {release.guardrails.map((guardrail) => (
                  <li key={guardrail}>{guardrail}</li>
                ))}
              </ul>
            </div>
          </aside>
        </SectionShell>
      </main>
    </>
  );
}
