import Link from "next/link";
import { Eyebrow, SectionShell } from "@/components/ui";
import { siteConfig } from "@/lib/content";

export const metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for STL-Musicians.com accounts, profiles, bookings, promotions, subscriptions, messaging, and moderated content.",
};

const lastUpdated = "May 6, 2026";

const sections = [
  {
    title: "Eligibility and Accounts",
    body: [
      "You must be 18 or older to use the platform. By creating an account, submitting content, messaging another user, requesting a booking, buying a paid promotion, subscribing to a plan, or otherwise using the service, you represent that you are legally able to enter these Terms.",
      "You are responsible for keeping account information accurate, maintaining the confidentiality of your credentials, and promptly updating profile, billing, booking, contact, and availability information. You are responsible for activity that occurs through your account.",
    ],
  },
  {
    title: "Platform Role",
    body: [
      "STL-Musicians.com facilitates bookings, paid promotions, subscriptions, messaging, and other platform transactions among musicians, bands, promoters, small venues, members, and administrators.",
      "The platform provides discovery, communication, moderation, payment, subscription, and transaction tools. Unless we separately agree in writing, users remain responsible for the accuracy of their profiles, the quality and legality of their services, their communications, their availability, and their performance under any booking or promotional arrangement.",
    ],
  },
  {
    title: "Payments, Subscriptions, Promotions, and Fees",
    body: [
      "By purchasing or accepting a paid service, booking, promotion, subscription, or other transaction, you agree to the displayed price and any applicable platform fees, service fees, subscription fees, promotion fees, booking fees, payment processing fees, taxes, refunds, chargebacks, and cancellation terms.",
      "STL-Musicians.com may charge or retain fees from transactions facilitated through the platform. Payment processors and other service providers may have their own terms, verification requirements, payout timelines, dispute processes, and fees.",
      "Paid promotions and subscription features may be changed, paused, rejected, moderated, rescheduled, or discontinued when needed for platform quality, legal compliance, safety, fraud prevention, billing issues, or operational reasons.",
    ],
  },
  {
    title: "User Content and Moderation",
    body: [
      "All profile, event, photo, video, audio, message, and promotional content may be moderated before or after publication. We may reject, edit, remove, restrict, or preserve content if we believe it is inaccurate, unlawful, misleading, unsafe, abusive, infringing, spam, low quality, or inconsistent with platform standards.",
      "You retain ownership of content you submit, but you grant STL-Musicians.com a non-exclusive, worldwide, royalty-free license to host, store, reproduce, display, distribute, adapt, and use that content to operate, promote, moderate, improve, and provide the platform.",
      "You are responsible for ensuring that submitted names, logos, photos, videos, audio, descriptions, links, event details, and promotional materials are accurate and that you have all rights and permissions needed to use them.",
    ],
  },
  {
    title: "Copyright and Rights Guardrails",
    body: [
      "You may not upload, post, link, stream, sell, promote, or transmit content that infringes copyright, trademark, publicity, privacy, or other rights.",
      "We may remove or disable access to content that appears to violate another party's rights. Repeat or serious violations may result in rejected submissions, account restrictions, transaction holds, payout holds, cancellation of promotions, or account termination.",
      "Copyright, trademark, impersonation, or ownership complaints should be sent to us with enough detail to identify the disputed content, the claimed owner, and the requested action.",
    ],
  },
  {
    title: "Communications and Conduct",
    body: [
      "The platform is intended to be the communication tool for booking, promotion, profile, availability, and opportunity conversations between musicians, bands, promoters, small venues, members, and administrators.",
      "You may not use the service to harass, threaten, impersonate, mislead, discriminate, spam, scrape, phish, distribute malware, bypass security, collect personal information without authorization, or interfere with the platform or other users.",
      "Do not use the service for unlawful, unsafe, obscene, exploitative, fraudulent, or unauthorized activity. We may refuse service, restrict access, moderate content, or suspend accounts when conduct risks users, transactions, the platform, or the public.",
    ],
  },
  {
    title: "Third-Party Services and Links",
    body: [
      "The service may rely on or link to third-party providers for authentication, hosting, data storage, payments, media storage, email, analytics, advertising, maps, social platforms, calendars, or other functionality.",
      "Third-party services are governed by their own terms and privacy practices. We are not responsible for third-party websites, services, availability, content, policies, fees, or disputes.",
    ],
  },
  {
    title: "Service Changes and Availability",
    body: [
      "We may update, suspend, restrict, remove, or discontinue any part of the service, including profiles, events, promotions, messaging, subscriptions, booking tools, pricing, and transaction features.",
      "We do not guarantee that the service will be uninterrupted, error-free, secure, or that any profile, event, promotion, booking, message, lead, or transaction will produce a specific outcome.",
    ],
  },
  {
    title: "Disclaimers and Liability Limits",
    body: [
      "The service is provided as is and as available. To the fullest extent permitted by law, we disclaim warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, and uninterrupted operation.",
      "To the fullest extent permitted by law, STL-Musicians.com, Digital Energy Holdings, LLC, and their owners, officers, employees, contractors, service providers, and affiliates will not be liable for indirect, incidental, consequential, special, punitive, or lost-profit damages arising from use of the platform.",
    ],
  },
  {
    title: "Indemnification",
    body: [
      "You agree to defend, indemnify, and hold harmless STL-Musicians.com, Digital Energy Holdings, LLC, and their owners, officers, employees, contractors, service providers, and affiliates from claims, losses, liabilities, damages, costs, and expenses arising from your content, conduct, transactions, breach of these Terms, or violation of law or third-party rights.",
    ],
  },
  {
    title: "Termination",
    body: [
      "You may stop using the service at any time. We may suspend, restrict, or terminate access if we believe you violated these Terms, created legal or payment risk, harmed another user, submitted infringing content, misused the platform, or created safety, fraud, moderation, or operational concerns.",
      "Obligations that should reasonably survive termination will survive, including payment obligations, fee obligations, content licenses already needed to operate the service, dispute obligations, intellectual property terms, indemnification, disclaimers, liability limits, and governing law.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "Missouri law governs these Terms and any dispute related to STL-Musicians.com, without regard to conflict-of-law rules. Venue for disputes will be in courts located in Missouri unless applicable law requires otherwise.",
    ],
  },
  {
    title: "Changes to These Terms",
    body: [
      "We may update these Terms as the platform, paid promotions, subscriptions, bookings, communications, payment tools, moderation practices, or legal requirements change. Continued use of the service after updates are posted means you accept the updated Terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <SectionShell>
      <Eyebrow>Legal</Eyebrow>
      <div className="max-w-4xl">
        <h1 className="mt-3 text-5xl font-black">Terms of Service</h1>
        <p className="mt-4 text-sm font-semibold text-[var(--muted)]">
          Last updated: {lastUpdated}
        </p>
        <div className="mt-8 space-y-5 text-[var(--muted)]">
          <p>
            These Terms of Service govern your access to and use of{" "}
            {siteConfig.name}, operated by {siteConfig.legalOperator}. By
            accessing the site, creating an account, submitting content, sending
            messages, requesting or accepting bookings, buying paid promotions,
            subscribing to services, or otherwise using the platform, you agree
            to these Terms.
          </p>
          <p>
            Please also review our{" "}
            <Link
              href="/privacy"
              className="text-[var(--foreground)] hover:text-[var(--brass-light)]"
            >
              Privacy Policy
            </Link>
            , which explains how we collect, use, and share information.
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
              Questions about these Terms should be sent to{" "}
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
