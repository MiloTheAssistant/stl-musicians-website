import { Eyebrow, SectionShell } from "@/components/ui";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <SectionShell>
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-3 text-5xl font-black">Privacy Policy</h1>
      <div className="mt-8 max-w-3xl space-y-5 text-[var(--muted)]">
        <p>
          STL-Musicians.com collects account, profile, event, and communication
          information needed to operate music discovery, promotion, and future
          booking workflows.
        </p>
        <p>
          Production launch should review this placeholder with counsel before
          paid promotion, messaging, or payment processing is activated.
        </p>
      </div>
    </SectionShell>
  );
}
