import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  BarChart3,
  CalendarPlus,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  Link2,
  Mail,
  Megaphone,
  Music2,
  Package,
  ReceiptText,
  Save,
  Search,
  Send,
  ShieldCheck,
  Star,
} from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { getCase44DashboardBand } from "@/lib/band-dashboard";
import {
  campaignIntakeStatusLabels,
  campaignIntakeStatuses,
  getCampaignIntakeForBand,
  type CampaignIntakeDraft,
} from "@/lib/campaign-intake";
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
import { formatCents } from "@/lib/payment-products";
import { getPromotionOrderActivity } from "@/lib/promotion-order-activity";
import {
  getReleaseSmartLinkPath,
  getSmartLinkReleaseForCampaign,
  getSongPromotionWorkspaceForBand,
} from "@/lib/song-promotion";
import {
  getCampaignFulfillmentTasksWithOverrides,
  promotionFulfillmentTaskStatuses,
} from "@/lib/promotion-fulfillment";
import { isKnownRole, userRoles } from "@/lib/roles";
import {
  getPlanById,
  paymentArchitecture,
  storageArchitecture,
} from "@/lib/subscription-plans";
import { createCustomerPortalSession } from "@/app/pricing/actions";
import { saveCampaignIntakeAction } from "./campaign-intake-actions";
import {
  addPromotionFulfillmentNote,
  updatePromotionFulfillmentTaskStatus,
} from "./promotion-fulfillment-actions";

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

const commandConsoleIcons = {
  Website: Globe2,
  Songs: Music2,
  Social: Megaphone,
  "Events Calendar": CalendarPlus,
  Merch: Package,
  Billing: CreditCard,
} as const;

const packageIntentOptions = [
  "SmartLink setup",
  "Launch prep",
  "Local STL push",
  "Full release campaign",
] as const;

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

function getCampaignLinkValue(
  campaignIntake: CampaignIntakeDraft,
  fieldName: CampaignIntakeDraft["platformLinks"][number]["fieldName"],
) {
  return campaignIntake.platformLinks.find((link) => link.fieldName === fieldName)?.url ?? "";
}

function getCampaignNotice(value: string | string[] | undefined) {
  const status = Array.isArray(value) ? value[0] : value;

  if (status === "saved") {
    return "Campaign draft saved for dashboard review.";
  }

  if (status === "submitted") {
    return "Campaign submitted for STL-Musicians review.";
  }

  if (status === "invalid") {
    return "Campaign intake needs a required field before it can be saved.";
  }

  return null;
}

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
  searchParams,
}: {
  params: Promise<{ role: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { role } = await params;
  const query = searchParams ? await searchParams : {};

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
  const case44PromotionWorkspace = getSongPromotionWorkspaceForBand(case44Band.slug);
  const musicianDashboardBand =
    role === "musician" &&
    (!hasClerkEnv || canAccessBandWorkspace(case44Band.slug, viewerEmail))
      ? case44Band
      : null;
  const activePlan = musicianDashboardBand
    ? getPlanById(musicianDashboardBand.activePlanId)
    : null;
  const campaignIntake = musicianDashboardBand
    ? await getCampaignIntakeForBand(musicianDashboardBand.slug)
    : null;
  const campaignNotice = getCampaignNotice(query.campaign);
  const billingSummary = musicianDashboardBand
    ? await getBillingSummaryForUser(viewerClerkUserId)
    : null;
  const paymentOperations =
    role === "admin" ? await getPaymentOperationsSummary() : null;
  const promotionOrderActivity =
    role === "admin" ? await getPromotionOrderActivity() : [];
  const promotionFulfillment =
    role === "admin" && case44PromotionWorkspace
      ? [
          {
            workspace: case44PromotionWorkspace,
            campaign: case44PromotionWorkspace.activeCampaign,
            smartLink: getSmartLinkReleaseForCampaign(
              case44PromotionWorkspace.activeCampaign.id,
            ),
            tasks: await getCampaignFulfillmentTasksWithOverrides(
              case44PromotionWorkspace.activeCampaign.id,
            ),
          },
        ]
      : [];
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
        <div className="grid gap-3 lg:justify-self-end">
          <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] px-4 py-3 text-sm">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]">
              Account
            </p>
            <p className="mt-1 text-xs font-semibold uppercase text-[var(--muted)]">
              Workspace access
            </p>
            <p className="mt-1 font-bold">{viewerAccess.label}</p>
            <p className="break-words text-[var(--muted)]">{viewerAccess.detail}</p>
          </div>
          {musicianDashboardBand && (
            <div
              id="help"
              className="rounded-md border border-[var(--line)] bg-[rgba(33,49,77,0.28)] px-4 py-3 text-sm"
            >
              <span className="inline-flex items-center gap-2 font-bold">
                <HelpCircle className="size-4 text-[var(--brass-light)]" aria-hidden />
                Help
              </span>
              <span className="mt-1 block text-[var(--muted)]">
                Dashboard tips, subscription guidance, and campaign intake support.
              </span>
            </div>
          )}
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
            <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4 sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Eyebrow>Dashboard management</Eyebrow>
                  <h3 className="mt-2 text-2xl font-black">Command Console</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    These controls are where the artist workspace is managed:
                    publishing review, song campaigns, social impact, Events Calendar,
                    merch, and billing.
                  </p>
                </div>
                <Tag>Managed in dashboard</Tag>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {musicianDashboardBand.navigation.map((item) => {
                  const Icon =
                    commandConsoleIcons[
                      item.label as keyof typeof commandConsoleIcons
                    ] ?? LayoutDashboard;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="group rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.32)] p-4 transition hover:border-[rgba(219,174,75,0.65)] hover:bg-[rgba(245,234,210,0.08)]"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 font-bold">
                          <Icon
                            className="size-4 text-[var(--brass-light)]"
                            aria-hidden
                          />
                          {item.label}
                        </span>
                        <span className="font-mono text-xs font-bold uppercase text-[var(--brass-light)] opacity-80">
                          Manage
                        </span>
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-[var(--muted)]">
                        {item.description}
                      </span>
                    </a>
                  );
                })}
              </div>
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

            {campaignIntake && (
              <section
                id="campaign-intake"
                className="mt-6 rounded-md border border-[var(--line)] bg-[rgba(33,49,77,0.25)] p-5"
              >
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div>
                    <Eyebrow>Artist campaign intake</Eyebrow>
                    <h3 className="mt-2 text-2xl font-black">Campaign intake</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                      Update the active Case44 campaign details before STL-Musicians
                      reviews, packages, and publishes anything public.
                    </p>
                    <p className="mt-3 text-sm font-semibold text-[var(--brass-light)]">
                      Public SmartLink publishing remains controlled by STL-Musicians;
                      dashboard drafts stay private until review.
                    </p>
                    {campaignNotice && (
                      <div className="mt-4 rounded-md border border-[rgba(219,174,75,0.45)] bg-[rgba(219,174,75,0.12)] px-4 py-3 text-sm font-semibold">
                        {campaignNotice}
                      </div>
                    )}
                  </div>
                  <div className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
                    <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]">
                      Review status
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {campaignIntakeStatusLabels[campaignIntake.status]}
                    </p>
                    <div className="mt-4 grid gap-2">
                      {campaignIntakeStatuses
                        .filter((status) => status !== "draft")
                        .map((status) => (
                          <div
                            key={status}
                            className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] px-3 py-2 text-sm"
                          >
                            <span>{campaignIntakeStatusLabels[status]}</span>
                            <Tag>
                              {campaignIntake.status === status ? "Current" : "Queue"}
                            </Tag>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <form action={saveCampaignIntakeAction} className="mt-6 grid gap-5">
                  <input
                    type="hidden"
                    name="campaignId"
                    value={campaignIntake.campaignId}
                  />
                  <input type="hidden" name="status" value={campaignIntake.status} />
                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold">
                      <span>Release title</span>
                      <input
                        name="releaseTitle"
                        defaultValue={campaignIntake.releaseTitle}
                        className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                        required
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-semibold">
                      <span>Release date</span>
                      <input
                        type="date"
                        name="releaseDate"
                        defaultValue={campaignIntake.releaseDate}
                        className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                        required
                      />
                    </label>
                  </div>

                  <label className="grid gap-2 text-sm font-semibold">
                    <span>Artwork</span>
                    <input
                      name="artworkUrl"
                      defaultValue={campaignIntake.artworkUrl}
                      placeholder="/images/case44/cover.png or https://..."
                      className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                    />
                  </label>

                  <div>
                    <div className="flex items-center gap-2">
                      <Link2 className="size-4 text-[var(--brass-light)]" aria-hidden />
                      <p className="text-sm font-bold">Platform links</p>
                    </div>
                    <div className="mt-3 grid gap-4 lg:grid-cols-2">
                      <label className="grid gap-2 text-sm font-semibold">
                        <span>Spotify</span>
                        <input
                          name="spotifyUrl"
                          defaultValue={getCampaignLinkValue(
                            campaignIntake,
                            "spotifyUrl",
                          )}
                          className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        <span>Apple Music</span>
                        <input
                          name="appleMusicUrl"
                          defaultValue={getCampaignLinkValue(
                            campaignIntake,
                            "appleMusicUrl",
                          )}
                          className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        <span>YouTube</span>
                        <input
                          name="youtubeUrl"
                          defaultValue={getCampaignLinkValue(
                            campaignIntake,
                            "youtubeUrl",
                          )}
                          className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                        />
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        <span>Social</span>
                        <input
                          name="socialUrl"
                          defaultValue={getCampaignLinkValue(campaignIntake, "socialUrl")}
                          className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="grid gap-2 text-sm font-semibold">
                      <span>Local show tie-ins</span>
                      <textarea
                        name="localTieIns"
                        rows={5}
                        defaultValue={campaignIntake.localTieIns}
                        className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 py-2 text-sm text-[var(--foreground)]"
                      />
                    </label>
                    <div className="grid gap-4">
                      <label className="grid gap-2 text-sm font-semibold">
                        <span>Package intent</span>
                        <select
                          name="packageIntent"
                          defaultValue={campaignIntake.packageIntent}
                          className="min-h-11 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm text-[var(--foreground)]"
                          required
                        >
                          {packageIntentOptions.includes(
                            campaignIntake.packageIntent as (typeof packageIntentOptions)[number],
                          ) ? null : (
                            <option value={campaignIntake.packageIntent}>
                              {campaignIntake.packageIntent}
                            </option>
                          )}
                          {packageIntentOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2 text-sm font-semibold">
                        <span>Notes</span>
                        <textarea
                          name="notes"
                          rows={5}
                          defaultValue={campaignIntake.notes}
                          className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 py-2 text-sm text-[var(--foreground)]"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      type="submit"
                      name="intent"
                      value="draft"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-4 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[rgba(245,234,210,0.14)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                    >
                      <Save className="size-4" aria-hidden />
                      Save draft
                    </button>
                    <button
                      type="submit"
                      name="intent"
                      value="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                    >
                      <Send className="size-4" aria-hidden />
                      Submit for review
                    </button>
                  </div>
                </form>
              </section>
            )}

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

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
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
      {role === "admin" && (
        <section className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Paid Package Activity</Eyebrow>
              <h2 className="mt-2 text-3xl font-black">Stripe package purchases</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Shows which Checkout purchase created fulfillment work, including
                cart orders and one-package promotion checkouts.
              </p>
            </div>
            <Tag>{promotionOrderActivity.length} recent</Tag>
          </div>

          {promotionOrderActivity.length === 0 ? (
            <div className="mt-6 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5 text-sm leading-6 text-[var(--muted)]">
              No paid package activity yet.
            </div>
          ) : (
            <div className="mt-6 divide-y divide-[var(--line)] rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)]">
              {promotionOrderActivity.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-center"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{item.source === "cart" ? "Cart order" : "Single package"}</Tag>
                      <Tag>{item.status}</Tag>
                      <Tag>{item.productId}</Tag>
                    </div>
                    <h3 className="mt-3 text-xl font-black">{item.packageName}</h3>
                    <p className="mt-2 break-all text-sm leading-6 text-[var(--muted)]">
                      Checkout session {item.stripeCheckoutSessionId}
                      {item.campaignId ? ` / Campaign ${item.campaignId}` : ""}
                    </p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p className="text-2xl font-black">
                      {formatCents(item.amountCents)}
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase text-[var(--brass-light)]">
                      Qty {item.quantity} / {item.currency.toUpperCase()}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      {promotionFulfillment.length > 0 && (
        <section className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Promotion Fulfillment</Eyebrow>
              <h2 className="mt-2 text-3xl font-black">Campaign ops console</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Manual status updates, operator notes, due dates, and proof links
                belong here before API-heavy platform modules are worth adding.
              </p>
            </div>
            <Tag>{promotionFulfillment.length} active campaign</Tag>
          </div>

          <div className="mt-6 space-y-5">
            {promotionFulfillment.map(({ workspace, campaign, smartLink, tasks }) => (
              <article
                key={campaign.id}
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>{workspace.bandName}</Tag>
                      <Tag>{campaign.status}</Tag>
                      <Tag>{campaign.release.releaseDate}</Tag>
                    </div>
                    <h3 className="mt-3 text-2xl font-black">{campaign.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                      {campaign.release.notes}
                    </p>
                  </div>
                  {smartLink ? (
                    <ButtonLink
                      href={getReleaseSmartLinkPath(smartLink)}
                      variant="secondary"
                      className="w-full lg:w-auto"
                    >
                      Public SmartLink
                    </ButtonLink>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag>{task.status}</Tag>
                        <Tag>{task.owner}</Tag>
                      </div>
                      <h4 className="mt-3 text-lg font-black">{task.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        Due {task.dueDate}. {task.guardrail}
                      </p>
                      <p className="mt-3 text-xs font-bold uppercase text-[var(--brass-light)]">
                        Packages: {task.packageIds.join(", ")}
                      </p>
                      <form
                        action={updatePromotionFulfillmentTaskStatus}
                        className="mt-4 grid gap-3"
                      >
                        <input
                          type="hidden"
                          name="promotionCampaignId"
                          value={campaign.id}
                        />
                        <input
                          type="hidden"
                          name="fulfillmentTaskId"
                          value={task.id}
                        />
                        <label
                          className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]"
                          htmlFor={`status-${task.id}`}
                        >
                          Manual status updates
                        </label>
                        <select
                          id={`status-${task.id}`}
                          name="status"
                          defaultValue={task.status}
                          className="min-h-10 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 text-sm font-bold text-[var(--foreground)]"
                        >
                          {promotionFulfillmentTaskStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[rgba(245,234,210,0.14)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                        >
                          Update status
                        </button>
                      </form>
                      <form
                        action={addPromotionFulfillmentNote}
                        className="mt-4 grid gap-3"
                      >
                        <input
                          type="hidden"
                          name="promotionCampaignId"
                          value={campaign.id}
                        />
                        <input
                          type="hidden"
                          name="fulfillmentTaskId"
                          value={task.id}
                        />
                        <label
                          className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]"
                          htmlFor={`note-${task.id}`}
                        >
                          Operator note
                        </label>
                        <textarea
                          id={`note-${task.id}`}
                          name="note"
                          rows={3}
                          placeholder="Add internal note or completion proof."
                          className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 py-2 text-sm text-[var(--foreground)]"
                        />
                        <button
                          type="submit"
                          className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--brass)] px-3 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                        >
                          Add fulfillment note
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </article>
            ))}
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
