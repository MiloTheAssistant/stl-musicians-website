import { Eyebrow, SectionShell } from "@/components/ui";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for STL-Musicians.com accounts, profiles, bookings, promotions, payments, subscriptions, messaging, and analytics.",
};

const lastUpdated = "May 6, 2026";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect account, profile, booking, messaging, promotion, payment, and subscription information that you provide when you create an account, build a profile, request a booking, message another user, purchase paid promotion, subscribe to a plan, contact support, or otherwise use the platform.",
      "Moderated profile, event, photo, video, audio, and other media submissions may include artist names, band names, stage names, venue details, event details, biographies, links, images, media files, captions, availability, and other content you choose to submit for public or platform use.",
      "We also collect device and usage information such as IP address, browser type, approximate location, pages viewed, referring pages, search terms, cookie identifiers, and interactions with profiles, events, promotions, forms, and messages.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use personal information to operate STL-Musicians.com, authenticate users, publish and moderate profiles, process booking and promotion workflows, deliver communications, provide customer support, improve discovery, prevent fraud and abuse, and comply with legal obligations.",
      "We use payment-related information for payments, subscriptions, paid promotions, booking requests, invoices, receipts, risk review, refunds, chargebacks, and tax or accounting records. Payment processors may receive payment information directly, and we do not intentionally store full card numbers on the site.",
      "We may use aggregated or de-identified information to understand platform performance, improve local music discovery, and report high-level platform activity without identifying a specific user.",
    ],
  },
  {
    title: "Analytics, Advertising, and Cookies",
    body: [
      "We may use Google Analytics, Google advertising tools, Meta Pixel, and Meta advertising tools to understand site traffic, measure campaigns, build audiences, and show relevant ads or marketing messages.",
      "Cookies, pixels, tags, local storage, and similar technologies may support sign-in, security, preferences, analytics, advertising, and performance measurement. You can manage cookies through your browser settings, but blocking some cookies may affect site functionality.",
      "Because there is no consistent industry standard for browser Do Not Track signals, we do not currently change our data practices when those signals are received.",
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We share information with service providers that help us host the site, provide authentication, store data and media, send email, process payments, run analytics and advertising, prevent fraud, provide customer support, and operate booking, messaging, subscription, and promotion workflows.",
      "We may share information with musicians, bands, promoters, small venues, members, and administrators when needed to facilitate a booking request, message, profile interaction, paid promotion, event opportunity, or other platform transaction.",
      "We may disclose information if required by law, legal process, security review, rights enforcement, fraud prevention, or to protect users, the platform, or the public.",
    ],
  },
  {
    title: "Moderation and Public Content",
    body: [
      "Profiles, events, media, descriptions, links, and other submitted content may be reviewed before or after publication. We may remove or restrict content that appears inaccurate, unlawful, abusive, infringing, misleading, unsafe, or inconsistent with platform standards.",
      "Public profile and event content may be visible to visitors, search engines, users, venues, promoters, members, and administrators. Do not submit information that you do not want used for platform discovery, booking, promotion, or moderation purposes.",
    ],
  },
  {
    title: "Retention and Security",
    body: [
      "We keep information for as long as reasonably needed to provide the platform, maintain records, resolve disputes, enforce agreements, prevent abuse, comply with legal obligations, and support accounting, tax, payment, subscription, and booking records.",
      "We use reasonable administrative, technical, and organizational measures to protect information. No internet service can guarantee absolute security, so users should protect account credentials and report suspected unauthorized access.",
    ],
  },
  {
    title: "Your Choices and Rights",
    body: [
      "You may request access, correction, deletion, or other available privacy rights by contacting us. Some information may be retained when needed for legal, fraud-prevention, payment, tax, accounting, dispute, or platform safety reasons.",
      "You can unsubscribe from marketing emails where an unsubscribe option is provided. Transactional, account, security, booking, payment, or support messages may still be sent when needed to operate the service.",
    ],
  },
  {
    title: "Minors",
    body: [
      "The platform is intended for users who are 18 or older. We do not knowingly collect personal information from anyone under 18. If you believe a minor has provided personal information, contact us so we can review and delete it where appropriate.",
    ],
  },
  {
    title: "Changes",
    body: [
      "We may update this Privacy Policy as our services, payment features, subscription plans, paid promotions, booking workflows, advertising tools, or legal requirements change. The updated version will be posted on this page with a new last updated date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <SectionShell>
      <Eyebrow>Legal</Eyebrow>
      <div className="max-w-4xl">
        <h1 className="mt-3 text-5xl font-black">Privacy Policy</h1>
        <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
          Last updated: {lastUpdated}
        </p>
        <div className="mt-8 space-y-5 text-[var(--muted)]">
          <p>
            This Privacy Policy explains how {siteConfig.legalOperator} operates{" "}
            {siteConfig.name} and collects, uses, discloses, and protects
            personal information when people visit the site, create accounts,
            publish profiles, submit media, request bookings, send messages,
            purchase paid promotions, subscribe to platform services, or contact
            us.
          </p>
          <p>
            STL-Musicians.com is a local music discovery, booking,
            communication, promotion, and subscription platform for musicians,
            bands, promoters, small venues, and members in the St. Louis music
            community.
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-4xl space-y-8">
        {sections.map((section) => (
          <section key={section.title} className="border-t border-[var(--line)] pt-6">
            <h2 className="text-2xl font-black">{section.title}</h2>
            <div className="mt-4 space-y-4 text-[var(--muted)]">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}

        <section className="border-t border-[var(--line)] pt-6">
          <h2 className="text-2xl font-black">Contact</h2>
          <div className="mt-4 space-y-3 text-[var(--muted)]">
            <p>
              For privacy questions, requests, or complaints, contact{" "}
              {siteConfig.legalOperator} at:
            </p>
            <address className="space-y-2 not-italic">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-[var(--foreground)] hover:text-[var(--brass-light)]"
                >
                  {siteConfig.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href={siteConfig.phoneHref}
                  className="text-[var(--foreground)] hover:text-[var(--brass-light)]"
                >
                  {siteConfig.phone}
                </a>
              </p>
              <p>Location: {siteConfig.location}</p>
            </address>
          </div>
        </section>
      </div>
    </SectionShell>
  );
}
