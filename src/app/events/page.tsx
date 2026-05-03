import { CalendarDays } from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { events } from "@/lib/content";

export const metadata = {
  title: "Events",
  description: "Discover the artists, rooms, and shows moving St. Louis.",
};

export default function EventsPage() {
  return (
    <SectionShell>
      <Eyebrow>Event Calendar</Eyebrow>
      <h1 className="mt-3 max-w-4xl text-5xl font-black">
        Discover the artists, rooms, and shows moving St. Louis.
      </h1>
      <div className="mt-10 grid gap-5">
        {events.map((event) => (
          <article key={event.title} className="grid gap-5 rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="flex size-14 items-center justify-center rounded-md bg-[var(--brass)] text-[var(--ink)]">
              <CalendarDays className="size-6" aria-hidden />
            </div>
            <div>
              <h2 className="text-2xl font-black">{event.title}</h2>
              <p className="text-sm text-[var(--muted)]">
                {new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(event.date))}{" "}
                / {event.venue}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
            <ButtonLink href={event.ticketUrl} variant="secondary">Details</ButtonLink>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
