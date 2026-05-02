import { Eyebrow, SectionShell } from "@/components/ui";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: "About",
  description: "The vision behind STL-Musicians.com.",
};

export default function AboutPage() {
  return (
    <SectionShell>
      <Eyebrow>About the Platform</Eyebrow>
      <h1 className="mt-3 max-w-4xl text-5xl font-black">{siteConfig.tagline}</h1>
      <div className="mt-8 grid gap-8 text-lg leading-8 text-[var(--muted)] lg:grid-cols-2">
        <p>
          STL-Musicians.com is built to become the central hub for the greater
          St. Louis music ecosystem: musicians, bands, venues, promoters,
          small-room buyers, and listeners who want a clearer path into the scene.
        </p>
        <p>
          The launch focuses on discovery, profiles, events, role-based
          accounts, and promotion readiness. Booking, messaging, paid boosts,
          and social campaign services are staged as the marketplace matures.
        </p>
      </div>
    </SectionShell>
  );
}
