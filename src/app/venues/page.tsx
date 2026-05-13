import { MapPin } from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { venues } from "@/lib/content";

export const metadata = {
  title: "Venues",
  description: "Every St. Louis stage starts with the right connection.",
  alternates: {
    canonical: "/venues",
  },
};

export default function VenuesPage() {
  return (
    <SectionShell>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Rooms and Buyers</Eyebrow>
          <h1 className="mt-3 max-w-4xl text-5xl font-black">
            Every St. Louis stage starts with the right connection.
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">
            Venue listings start simple and evolve into direct booking, reviews,
            recurring needs, and event staffing workflows.
          </p>
        </div>
        <ButtonLink href="/login/member">Create venue account</ButtonLink>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {venues.map((venue) => (
          <article key={venue.name} className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
            <MapPin className="size-6 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-4 text-2xl font-black">{venue.name}</h2>
            <p className="mt-2 text-[var(--muted)]">{venue.neighborhood}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-[var(--ink)] p-4">
                <p className="text-[var(--muted)]">Capacity</p>
                <p className="text-xl font-black">{venue.capacity}</p>
              </div>
              <div className="rounded-md bg-[var(--ink)] p-4">
                <p className="text-[var(--muted)]">Room type</p>
                <p className="font-bold">{venue.roomType}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
