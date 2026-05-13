import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { getArtistBySlug } from "@/lib/content";
import { canonicalPath, serializeJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);
  return {
    title: artist ? artist.name : "Musician",
    description: artist?.shortBio,
    alternates: {
      canonical: canonicalPath(`/musicians/${slug}`),
    },
  };
}

export default async function ArtistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="record-visual min-h-[420px] rounded-lg border border-[var(--line)]" />
        <div>
          <Eyebrow>{artist.homeBase} / {artist.genre}</Eyebrow>
          <h1 className="mt-4 text-5xl font-black">{artist.name}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{artist.shortBio}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Tag>{artist.bookingFocus}</Tag>
            <Tag>{artist.status}</Tag>
            <Tag>{artist.nextGig}</Tag>
          </div>
          <div className="mt-8 rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <h2 className="text-2xl font-black">Media Kit</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {artist.media.map((item) => (
                <div key={item} className="rounded-md bg-[var(--ink)] p-4 text-sm font-semibold text-[var(--muted)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/login/member">Request availability</ButtonLink>
            <ButtonLink href="/login/promoter" variant="secondary">
              Contact as promoter
            </ButtonLink>
          </div>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "MusicGroup",
            name: artist.name,
            url: `https://stl-musicians.com/musicians/${artist.slug}`,
            genre: artist.genre,
            areaServed: "Greater St. Louis Metro",
            description: artist.shortBio,
            event: artist.nextGig,
            knowsAbout: artist.bookingFocus,
          }),
        }}
      />
    </SectionShell>
  );
}
