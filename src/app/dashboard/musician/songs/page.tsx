import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Link2,
  Megaphone,
  Music2,
  Radio,
  Rocket,
  Settings2,
} from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { getCase44DashboardBand } from "@/lib/band-dashboard";
import {
  canAccessBandWorkspace,
  getPrimaryEmail,
} from "@/lib/dashboard-access";
import { formatCents, getPromotionProductById } from "@/lib/payment-products";
import {
  getAccountReadinessScore,
  getCampaignFulfillmentTasks,
  getMissingAccountLinks,
  getReleaseSmartLinkPath,
  getSmartLinkReleaseForCampaign,
  getSongPromotionWorkspaceForBand,
  songPromotionChannels,
  type AccountSetupStatus,
  type CampaignFulfillmentTask,
  type PromotionActionStatus,
} from "@/lib/song-promotion";
import { getSmartLinkAnalyticsSummary } from "@/lib/song-promotion-analytics";
import { addPromotionToCart } from "./cart/actions";

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export const metadata = {
  title: "Songs Command Center",
};

function statusLabel(
  status:
    | AccountSetupStatus
    | PromotionActionStatus
    | CampaignFulfillmentTask["status"],
) {
  return status
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function SongsDashboardPage() {
  const band = getCase44DashboardBand();
  const workspace = getSongPromotionWorkspaceForBand(band.slug);

  if (!workspace) {
    notFound();
  }

  if (hasClerkEnv) {
    const user = await currentUser();
    const viewerEmail = getPrimaryEmail(user);

    if (!canAccessBandWorkspace(band.slug, viewerEmail)) {
      notFound();
    }
  }

  const missingAccounts = getMissingAccountLinks(workspace);
  const readinessScore = getAccountReadinessScore(workspace);
  const activeCampaign = workspace.activeCampaign;
  const paidBoosts = activeCampaign.paidBoostProductIds.map((productId) =>
    getPromotionProductById(productId),
  );
  const smartLinkRelease = getSmartLinkReleaseForCampaign(activeCampaign.id);
  const fulfillmentTasks = getCampaignFulfillmentTasks(activeCampaign.id);
  const nextTask =
    fulfillmentTasks.find((task) => task.status !== "done") ?? fulfillmentTasks[0];
  const smartLinkAnalytics = smartLinkRelease
    ? await getSmartLinkAnalyticsSummary({
        releaseSlug: smartLinkRelease.slug,
        platformIds: smartLinkRelease.destinationLinks.map((link) => link.id),
        packageStatus: activeCampaign.status,
        nextAction: nextTask?.title ?? "Review campaign plan",
      })
    : null;

  return (
    <SectionShell>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <ButtonLink href="/dashboard/musician" variant="ghost" className="mb-5 px-0">
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" aria-hidden />
              Back to musician dashboard
            </span>
          </ButtonLink>
          <Eyebrow>{workspace.bandName} Songs</Eyebrow>
          <h1 className="mt-3 max-w-5xl text-4xl font-black leading-[0.98] sm:text-5xl lg:text-6xl">
            Songs Command Center
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Plan one release campaign, operate SmartLink handoffs, and choose
            tiered STL-Musicians launch packages from the same workspace.
          </p>
        </div>
        <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] px-4 py-3 text-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]">
            Account readiness
          </p>
          <p className="mt-1 text-3xl font-black">{readinessScore}%</p>
          <p className="text-[var(--muted)]">
            {missingAccounts.length} setup items still missing
          </p>
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Tag>{activeCampaign.status}</Tag>
              <Tag>{activeCampaign.goal}</Tag>
              <Tag>{activeCampaign.release.releaseType}</Tag>
            </div>
            <h2 className="mt-4 text-3xl font-black">{activeCampaign.release.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {activeCampaign.release.notes}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4">
                <Music2 className="size-5 text-[var(--brass-light)]" aria-hidden />
                <p className="mt-3 text-sm text-[var(--muted)]">Primary track</p>
                <p className="font-bold">{activeCampaign.release.primaryTrackTitle}</p>
              </div>
              <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4">
                <Rocket className="size-5 text-[var(--brass-light)]" aria-hidden />
                <p className="mt-3 text-sm text-[var(--muted)]">Release date</p>
                <p className="font-bold">{activeCampaign.release.releaseDate}</p>
              </div>
              <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4">
                <Link2 className="size-5 text-[var(--brass-light)]" aria-hidden />
                <p className="mt-3 text-sm text-[var(--muted)]">Campaign budget</p>
                <p className="font-bold">{formatCents(activeCampaign.budgetCents)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-md border border-[var(--line)] bg-[rgba(33,49,77,0.25)] p-4">
            <Settings2 className="size-5 text-[var(--brass-light)]" aria-hidden />
            <h3 className="mt-3 text-xl font-black">Concierge OS</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Phase 1 stores profile links, claim status, public SmartLink
              destinations, and fulfillment tasks. Official OAuth work stays
              behind guarded handoffs until a specific paid workflow proves it.
            </p>
            <div className="mt-4 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.05)] p-3">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]">
                Case44 admin
              </p>
              <p className="mt-1 break-words text-sm font-bold">
                {workspace.adminEmail}
              </p>
            </div>
            {smartLinkRelease ? (
              <ButtonLink
                href={getReleaseSmartLinkPath(smartLinkRelease)}
                variant="secondary"
                className="mt-4 w-full"
              >
                Public SmartLink
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </section>

      {smartLinkRelease && smartLinkAnalytics ? (
        <section className="mt-6 rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>SmartLink Analytics</Eyebrow>
              <h2 className="mt-2 text-3xl font-black">Campaign performance</h2>
            </div>
            <ButtonLink
              href={getReleaseSmartLinkPath(smartLinkRelease)}
              variant="secondary"
            >
              View SmartLink
            </ButtonLink>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Total clicks</p>
              <p className="mt-2 text-3xl font-black">
                {smartLinkAnalytics.totalClicks}
              </p>
            </article>
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Fan captures</p>
              <p className="mt-2 text-3xl font-black">
                {smartLinkAnalytics.fanCaptureCount}
              </p>
            </article>
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Package status</p>
              <p className="mt-2 text-3xl font-black">
                {statusLabel(smartLinkAnalytics.packageStatus as PromotionActionStatus)}
              </p>
            </article>
            <article className="rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4">
              <p className="text-sm text-[var(--muted)]">Next action</p>
              <p className="mt-2 text-lg font-black">
                {smartLinkAnalytics.nextAction}
              </p>
            </article>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {smartLinkAnalytics.clicksByPlatform.map((item) => {
              const link = smartLinkRelease.destinationLinks.find(
                (destination) => destination.id === item.platformId,
              );

              return (
                <article
                  key={item.platformId}
                  className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4"
                >
                  <p className="text-sm font-bold">
                    {link?.platform ?? item.platformId}
                  </p>
                  <p className="mt-2 text-2xl font-black">{item.clicks}</p>
                  <p className="mt-1 text-xs font-bold uppercase text-[var(--brass-light)]">
                    Platform clicks
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Eyebrow>Action Plan</Eyebrow>
              <h2 className="mt-2 text-3xl font-black">Release visibility checklist</h2>
            </div>
            <Tag>{activeCampaign.actions.length} actions</Tag>
          </div>
          <div className="mt-5 divide-y divide-[var(--line)]">
            {activeCampaign.actions.map((action) => (
              <article
                key={action.id}
                className="grid gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{statusLabel(action.status)}</Tag>
                    <Tag>{action.priority} priority</Tag>
                  </div>
                  <h3 className="mt-3 text-xl font-black">{action.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {action.detail}
                  </p>
                </div>
                <ButtonLink
                  href={action.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  className="w-full lg:w-auto"
                >
                  <span className="inline-flex items-center gap-2">
                    {action.ctaLabel}
                    <ExternalLink className="size-4" aria-hidden />
                  </span>
                </ButtonLink>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 sm:p-6">
          <Eyebrow>Account readiness</Eyebrow>
          <h2 className="mt-2 text-3xl font-black">Attached profiles</h2>
          <div className="mt-5 space-y-3">
            {workspace.accountLinks.map((account) => (
              <article
                key={account.platform}
                className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{account.platform}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                      {account.notes}
                    </p>
                  </div>
                  <Tag>{statusLabel(account.status)}</Tag>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-[var(--brass-light)]">
                  <span>{account.setupMode === "oauth-later" ? "OAuth later" : "Profile link"}</span>
                  <span aria-hidden>/</span>
                  <a
                    href={account.setupUrl}
                    target={account.setupUrl.startsWith("/") ? undefined : "_blank"}
                    rel={account.setupUrl.startsWith("/") ? undefined : "noreferrer"}
                    className="inline-flex items-center gap-1 hover:text-[var(--foreground)]"
                  >
                    Setup reference
                    {!account.setupUrl.startsWith("/") && (
                      <ExternalLink className="size-3" aria-hidden />
                    )}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 sm:p-6">
        <Eyebrow>Channels</Eyebrow>
        <h2 className="mt-2 text-3xl font-black">Balanced promotion lanes</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {songPromotionChannels.map((channel) => (
            <article
              key={channel.id}
              className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4"
            >
              <Radio className="size-5 text-[var(--brass-light)]" aria-hidden />
              <h3 className="mt-3 font-black">{channel.label}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {channel.summary}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Fulfillment</Eyebrow>
            <h2 className="mt-2 text-3xl font-black">STL-Musicians ops checklist</h2>
          </div>
          <Tag>{fulfillmentTasks.length} tasks</Tag>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fulfillmentTasks.map((task) => (
            <article
              key={task.id}
              className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Tag>{statusLabel(task.status)}</Tag>
                <Tag>{task.owner}</Tag>
              </div>
              <h3 className="mt-3 text-lg font-black">{task.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                Due {task.dueDate}. {task.guardrail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[var(--line)] bg-[rgba(33,49,77,0.25)] p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Concierge packages</Eyebrow>
            <h2 className="mt-2 text-3xl font-black">Tiered launch packages</h2>
          </div>
          <ButtonLink href="/dashboard/musician/songs/cart" variant="secondary">
            Campaign Cart
          </ButtonLink>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {paidBoosts.map((boost) => (
            <article
              key={boost.id}
              className="flex flex-col rounded-md border border-[var(--line)] bg-[rgba(9,9,7,0.35)] p-4"
            >
              <Megaphone className="size-5 text-[var(--brass-light)]" aria-hidden />
              <h3 className="mt-3 text-xl font-black">{boost.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {boost.description}
              </p>
              <p className="mt-4 text-2xl font-black">{formatCents(boost.amountCents)}</p>
              <form action={addPromotionToCart} className="mt-auto pt-5">
                <input type="hidden" name="promotionProductId" value={boost.id} />
                <input
                  type="hidden"
                  name="promotionCampaignId"
                  value={activeCampaign.id}
                />
                <button
                  type="submit"
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                >
                  Add package
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-5 sm:p-6">
        <CheckCircle2 className="size-5 text-[var(--brass-light)]" aria-hidden />
        <h2 className="mt-4 text-2xl font-black">Operational note</h2>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-[var(--muted)]">
          This command center is reusable for future bands. Case44 is the first
          validation workspace, while SmartLink pages, release platform links,
          fulfillment tasks, notes, click events, and fan leads can move behind
          Neon and Drizzle without changing the dashboard workflow.
        </p>
      </section>
    </SectionShell>
  );
}
