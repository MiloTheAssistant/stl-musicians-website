import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { artistProfiles, coreGenres } from "@/lib/content";

export const metadata = {
  title: "Musicians",
  description: "Discover St. Louis musicians and bands by genre, media, and booking fit.",
  alternates: {
    canonical: "/musicians",
  },
};

export default function MusiciansPage() {
  return (
    <SectionShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Musician Discovery</Eyebrow>
          <h1 className="mt-3 text-5xl font-black">Find the sound for the room.</h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Launch profiles are seeded to establish the pattern: rich EPKs,
            genre clarity, media links, and booking intent.
          </p>
        </div>
        <ButtonLink href="/login/musician">List your act</ButtonLink>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {coreGenres.map((genre) => (
          <Tag key={genre}>{genre}</Tag>
        ))}
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {artistProfiles.map((artist) => (
          <article key={artist.slug} className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <div className="flex items-center justify-between">
              <Tag>{artist.genre}</Tag>
              <span className="text-xs font-bold uppercase text-[var(--brass-light)]">{artist.status}</span>
            </div>
            <h2 className="mt-5 text-2xl font-black">{artist.name}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{artist.homeBase}</p>
            <p className="mt-4 min-h-24 text-sm leading-6 text-[var(--muted)]">{artist.shortBio}</p>
            <p className="mt-4 text-sm font-bold">Best for: {artist.bookingFocus}</p>
            <ButtonLink href={`/musicians/${artist.slug}`} variant="secondary" className="mt-5 w-full">
              View EPK
            </ButtonLink>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
