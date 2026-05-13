import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BarChart3,
  Bot,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Globe2,
  Mail,
  Megaphone,
  Music2,
  Package,
  ReceiptText,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { getCase44DashboardBand } from "@/lib/band-dashboard";
import { artistProfiles, events, promotionPackages } from "@/lib/content";
import {
  canAccessBandWorkspace,
  canAccessDashboardRole,
  getDashboardViewerAccessSummary,
  getPrimaryEmail,
} from "@/lib/dashboard-access";
import {
  getBillingSummaryForUser,
  getPaymentOperationsSummary,
} from "@/lib/payment-records";
import { isKnownRole, userRoles } from "@/lib/roles";
import {
  getPlanById,
  paymentArchitecture,
  storageArchitecture,
} from "@/lib/subscription-plans";
import { createCustomerPortalSession } from "@/app/pricing/actions";

const dashboardCards = {
  musician: [
    ["Profile strength", "82%", "Add production photos and stage plot.", Music2],
    ["Upcoming events", "3", "Post a new gig or release party.", CalendarPlus],
    ["Promotion requests", "Future", "Boost songs, albums, and events.", Megaphone],
  ],
  promoter: [
    ["Saved artists", "18", "Track artists for upcoming bills.", Star],
    ["Discovery queue", "42", "Filter by genre, media, and room fit.", Search],
    ["Campaign opportunities", "Future", "Coordinate release and event pushes.", Megaphone],
  ],
  member: [
    ["Saved profiles", "7", "Keep acts ready for private events.", Star],
    ["Open conversations", "2", "Direct communication starts here.", Mail],
    ["Event interest", "4", "Request availability for future dates.", CalendarPlus],
  ],
  admin: [
    ["Profiles to approve", "11", "Review completeness and fit.", CheckCircle2],
    ["Events pending", "5", "Moderate dates before publishing.", CalendarPlus],
    ["Trust queue", "3", "Investigate flags and spam reports.", ShieldCheck],
  ],
} as const;

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const config = userRoles.find((item) => item.id === role);
  return {
    title: config ? `${config.label} Dashboard` : "Dashboard",
  };
}

export default async function RoleDashboardPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isKnownRole(role)) {
    notFound();
  }

  let viewerEmail: string | null = null;
  let viewerClerkUserId: string | null = null;

  if (hasClerkEnv) {
    const user = await currentUser();
    viewerClerkUserId = user?.id ?? null;
    viewerEmail = getPrimaryEmail(user);

    if (!canAccessDashboardRole(role, viewerEmail)) {
      notFound();
    }
  }

  const config = userRoles.find((item) => item.id === role);
  const viewerAccess = getDashboardViewerAccessSummary(role, viewerEmail);
  const case44Band = getCase44DashboardBand();
  const musicianDashboardBand =
    role === "musician" &&
    (!hasClerkEnv || canAccessBandWorkspace(case44Band.slug, viewerEmail))
      ? case44Band
      : null;
  const activePlan = musicianDashboardBand
    ? getPlanById(musicianDashboardBand.activePlanId)
    : null;
  const billingSummary = musicianDashboardBand
    ? await getBillingSummaryForUser(viewerClerkUserId)
    : null;
  const paymentOperations =
    role === "admin" ? await getPaymentOperationsSummary() : null;
  const adminBandDirectory =
    role === "admin"
      ? [
          {
            name: case44Band.name,
            genre: case44Band.genre,
            homeBase: case44Band.location,
            status: "published",
          },
          ...artistProfiles,
        ]
      : [];

  if (!config) {
    notFound();
  }

  return (
    <SectionShell>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-end">
        <div className="min-w-0">
          <Eyebrow>{config.label}</Eyebrow>
          <h1 className="mt-3 max-w-5xl text-4xl font-black leading-[0.98] sm:text-5xl lg:text-6xl">
            {config.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-[var(--muted)]">{config.description}</p>
        </div>
        <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] px-4 py-3 text-sm lg:justify-self-end">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]">
            Account
          </p>
          <p className="mt-1 text-xs font-semibold uppercase text-[var(--muted)]">
            Workspace access
          </p>
          <p className="mt-1 font-bold">{viewerAccess.label}</p>
          <p className="break-words text-[var(--muted)]">{viewerAccess.detail}</p>
        </div>
      </div>
      {musicianDashboardBand && (
        <section className="mt-10 overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--ink)]">
          <div className="grid gap-5 border-b border-[var(--line)] bg-[rgba(245,234,210,0.05)] p-4 sm:p-5 lg:grid-cols-[minmax(120px,160px)_minmax(0,1fr)] lg:items-center xl:grid-cols-[minmax(130px,168px)_minmax(0,1fr)_auto]">
            <div className="flex aspect-[4/3] w-full max-w-40 items-center justify-center rounded-md border border-[rgba(245,234,210,0.36)] bg-[var(--muted)] p-3 sm:max-w-44">
              <Image
                src={musicianDashboardBand.logoImage}
                alt="Case44 band logo"
                width={360}
                height={160}
                className="max-h-full w-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <Eyebrow>Case44 Workspace</Eyebrow>
              <h2 className="mt-2 max-w-3xl text-2xl font-black leading-tight sm:text-3xl">
                Administer {musicianDashboardBand.name} on STL-Musicians.com
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                {musicianDashboardBand.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[var(--brass-light)]">
                <span>{musicianDashboardBand.genre}</span>
                <span aria-hidden>/</span>
                <span>{musicianDashboardBand.location}</span>
                {activePlan && (
                  <>
                    <span aria-hidden>/</span>
                    <span>{activePlan.name}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:max-w-80 xl:justify-end">
              <ButtonLink
                href={musicianDashboardBand.websiteUrl}
                target="_blank"
                rel="noreferrer"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <span className="inline-flex items-center gap-2">
                  Open public website
                  <ExternalLink className="size-4" aria-hidden />
                </span>
              </ButtonLink>
              <ButtonLink href="#merch" className="w-full sm:w-auto">
                <span className="inline-flex items-center gap-2">
                  Edit Products
                  <Package className="size-4" aria-hidden />
                </span>
              </ButtonLink>
            </div>
          </div>
          <div className="p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {musicianDashboardBand.navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4 transition hover:bg-[rgba(245,234,210,0.08)]"
                >
                  <p className="font-bold">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {musicianDashboardBand.stats.map((stat) => (
                <article
                  key={stat.label}
                  className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-5"
                >
                  <BarChart3 className="size-5 text-[var(--brass-light)]" aria-hidden />
                  <p className="mt-4 text-sm text-[var(--muted)]">{stat.label}</p>
                  <p className="mt-1 text-4xl font-black">{stat.value}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {stat.detail}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <section
                id="events"
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Eyebrow>Calendar</Eyebrow>
                    <h3 className="mt-2 text-2xl font-black">Next 14 Days</h3>
                  </div>
                  <ButtonLink href="#calendar" variant="ghost">
                    Drill into calendar
                  </ButtonLink>
                </div>
                <div className="mt-5 divide-y divide-[var(--line)]">
                  {musicianDashboardBand.upcomingEvents.map((event) => (
                    <div
                      key={`${event.date}-${event.title}`}
                      className="grid gap-3 py-4 md:grid-cols-[0.7fr_1fr_auto] md:items-center"
                    >
                      <div>
                        <p className="font-bold">{event.date}</p>
                        <p className="text-sm text-[var(--muted)]">{event.time}</p>
                      </div>
                      <div>
                        <p className="font-bold">{event.title}</p>
                        <p className="text-sm text-[var(--muted)]">{event.venue}</p>
                      </div>
                      <Tag>{event.status}</Tag>
                    </div>
                  ))}
                </div>
              </section>

              <section
                id="social"
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5"
              >
                <Eyebrow>Connected Impact</Eyebrow>
                <h3 className="mt-2 text-2xl font-black">Social Media Impact</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {musicianDashboardBand.socialImpact.map((item) => (
                    <div
                      key={item.channel}
                      className="rounded-md bg-[rgba(9,9,7,0.4)] p-4"
                    >
                      <p className="text-sm text-[var(--muted)]">{item.channel}</p>
                      <p className="mt-1 text-2xl font-black">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <section
                id="billing"
                className="rounded-md border border-[var(--line)] bg-[rgba(33,49,77,0.25)] p-5"
              >
                <CreditCard className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 text-2xl font-black">Billing</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {activePlan?.summary}
                </p>
                <div className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                  <p>
                    <strong className="text-[var(--foreground)]">Current plan:</strong>{" "}
                    {billingSummary?.status === "trial" && activePlan
                      ? activePlan.name
                      : billingSummary?.planName}
                  </p>
                  <p>
                    <strong className="text-[var(--foreground)]">Billing status:</strong>{" "}
                    {billingSummary?.status}
                    {billingSummary?.billingInterval
                      ? ` / ${billingSummary.billingInterval}`
                      : ""}
                  </p>
                  <p>
                    <strong className="text-[var(--foreground)]">Subscriptions:</strong>{" "}
                    {paymentArchitecture.subscriptionProcessor}
                  </p>
                  <p>
                    <strong className="text-[var(--foreground)]">Platform payments:</strong>{" "}
                    {paymentArchitecture.marketplaceProcessor}
                  </p>
                </div>
                {billingSummary?.canManageBilling && (
                  <form action={createCustomerPortalSession} className="mt-5">
                    <button
                      type="submit"
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                    >
                      Manage billing
                    </button>
                  </form>
                )}
              </section>

              <section
                id="merch"
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5"
              >
                <Package className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 text-2xl font-black">Merch</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Edit products, images, sizes, pricing, and availability before
                  connecting checkout or fulfillment.
                </p>
                <ButtonLink href="#products" className="mt-5" variant="secondary">
                  Edit Products
                </ButtonLink>
              </section>

              <section
                id="help"
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5"
              >
                <Bot className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 text-2xl font-black">Help</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  The assistant drawer will answer plan questions, navigation tips,
                  and next-step recommendations once the core workspace is stable.
                </p>
              </section>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <section
                id="website"
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5"
              >
                <Globe2 className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 text-2xl font-black">Website Controls</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Public website review stays available, but the dashboard is now
                  the command center for STL-Musicians features.
                </p>
              </section>
              <section className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5">
                <ReceiptText className="size-5 text-[var(--brass-light)]" aria-hidden />
                <h3 className="mt-4 text-2xl font-black">Storage Foundation</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  {storageArchitecture.relationalStore} stores account, campaign,
                  booking, product, and payment records. {storageArchitecture.fileStore}
                  {" "}stores photos, merch images, EPKs, and social media assets.
                </p>
              </section>
            </div>
          </div>
        </section>
      )}
      {adminBandDirectory.length > 0 && (
        <section className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Administrator</Eyebrow>
              <h2 className="mt-2 text-3xl font-black">Musicians / Bands</h2>
            </div>
            <p className="text-sm font-semibold text-[var(--brass-light)]">
              {adminBandDirectory.length} profiles
            </p>
          </div>
          <div className="mt-6 divide-y divide-[var(--line)]">
            {adminBandDirectory.map((artist) => (
              <div key={artist.name} className="grid gap-2 py-4 md:grid-cols-[1.2fr_0.9fr_0.8fr] md:items-center">
                <div>
                  <p className="font-bold">{artist.name}</p>
                  <p className="text-sm text-[var(--muted)]">{artist.homeBase}</p>
                </div>
                <p className="text-sm text-[var(--muted)]">{artist.genre}</p>
                <p className="text-xs font-bold uppercase text-[var(--brass-light)]">{artist.status}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      {paymentOperations && (
        <section className="mt-10 rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.25)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Payment Operations</Eyebrow>
              <h2 className="mt-2 text-3xl font-black">Billing and Promotion Status</h2>
            </div>
            <Tag>Stripe</Tag>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Active subscriptions</p>
              <p className="mt-2 text-3xl font-black">
                {paymentOperations.activeSubscriptions}
              </p>
            </article>
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Needs attention</p>
              <p className="mt-2 text-3xl font-black">
                {paymentOperations.attentionSubscriptions}
              </p>
            </article>
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Paid promotions</p>
              <p className="mt-2 text-3xl font-black">
                {paymentOperations.paidPromotions}
              </p>
            </article>
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Pending promotions</p>
              <p className="mt-2 text-3xl font-black">
                {paymentOperations.pendingPromotions}
              </p>
            </article>
          </div>
        </section>
      )}
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {dashboardCards[role].map(([title, value, description, Icon]) => (
          <article key={title} className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <Icon className="size-5 text-[var(--brass-light)]" aria-hidden />
            <p className="mt-5 text-sm text-[var(--muted)]">{title}</p>
            <p className="mt-1 text-4xl font-black">{value}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
          </article>
        ))}
      </div>
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <h2 className="text-2xl font-black">Scene feed</h2>
          <div className="mt-5 space-y-4">
            {artistProfiles.slice(0, 4).map((artist) => (
              <div key={artist.slug} className="flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
                <div>
                  <p className="font-bold">{artist.name}</p>
                  <p className="text-sm text-[var(--muted)]">{artist.genre} / {artist.homeBase}</p>
                </div>
                <span className="text-xs uppercase text-[var(--brass-light)]">{artist.status}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <h2 className="text-2xl font-black">Promotion roadmap</h2>
          <div className="mt-5 space-y-4">
            {promotionPackages.map((item) => (
              <div key={item} className="border-t border-[var(--line)] pt-4">
                <p className="font-bold">{item}</p>
                <p className="text-sm text-[var(--muted)]">
                  Reserved for Phase 4 paid campaign fulfillment.
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="mt-10 rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.32)] p-6">
        <h2 className="text-2xl font-black">Upcoming event signals</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <div key={event.title} className="rounded-md bg-[rgba(9,9,7,0.45)] p-4">
              <p className="font-bold">{event.title}</p>
              <p className="text-sm text-[var(--muted)]">{event.venue}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
