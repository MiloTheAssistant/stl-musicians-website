import { Mail } from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: "Contact",
  description: "Contact STL-Musicians.com.",
};

export default function ContactPage() {
  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-3 text-5xl font-black">Tell us what the scene needs next.</h1>
          <p className="mt-4 text-[var(--muted)]">
            Musicians, promoters, venues, and partners can use this launch
            contact path while full messaging comes online.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
          <Mail className="size-6 text-[var(--brass-light)]" aria-hidden />
          <h2 className="mt-4 text-2xl font-black">{siteConfig.email}</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Resend is reserved in the stack for transactional email once the
            Vercel environment is provisioned.
          </p>
          <ButtonLink href={`mailto:${siteConfig.email}`} className="mt-6">
            Send email
          </ButtonLink>
        </div>
      </div>
    </SectionShell>
  );
}
