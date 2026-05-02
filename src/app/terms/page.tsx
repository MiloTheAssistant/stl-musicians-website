import { Eyebrow, SectionShell } from "@/components/ui";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <SectionShell>
      <Eyebrow>Legal</Eyebrow>
      <h1 className="mt-3 text-5xl font-black">Terms of Service</h1>
      <div className="mt-8 max-w-3xl space-y-5 text-[var(--muted)]">
        <p>
          Users are responsible for accurate profiles, lawful media links,
          respectful communication, and honoring agreements made through the
          platform.
        </p>
        <p>
          Booking, payment, promotion campaign, community guideline, cookie, and
          DMCA terms should be finalized before those workflows accept live
          transactions.
        </p>
      </div>
    </SectionShell>
  );
}
