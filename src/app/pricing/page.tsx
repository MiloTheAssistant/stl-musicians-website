import { Megaphone } from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { promotionPackages } from "@/lib/content";

export const metadata = {
  title: "Pricing",
  description: "Future promotion and featured listing packages for STL-Musicians.com.",
};

export default function PricingPage() {
  return (
    <SectionShell>
      <Eyebrow>Future Monetization</Eyebrow>
      <h1 className="mt-3 text-5xl font-black">Paid promotion is earmarked, not rushed.</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Phase 4 adds Stripe-backed subscriptions, featured listings, and paid
        promotion services for songs, albums, and events.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {promotionPackages.map((item) => (
          <article key={item} className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <Megaphone className="size-5 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-4 text-xl font-black">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Reserved for launch validation before payment fulfillment.
            </p>
          </article>
        ))}
      </div>
      <ButtonLink href="/login/musician" className="mt-8">
        Prepare promotion request
      </ButtonLink>
    </SectionShell>
  );
}
