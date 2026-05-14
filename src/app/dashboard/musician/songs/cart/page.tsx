import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, CreditCard, ShoppingCart, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink, Eyebrow, SectionShell, Tag } from "@/components/ui";
import { getCase44DashboardBand } from "@/lib/band-dashboard";
import {
  canAccessBandWorkspace,
  getPrimaryEmail,
} from "@/lib/dashboard-access";
import { formatCents } from "@/lib/payment-products";
import { getPromotionCartDisplayItems } from "@/lib/promotion-cart";
import { getCookiePromotionCartItems } from "@/lib/promotion-cart-cookie";
import {
  getPromotionCartItemsForScope,
  hasPromotionCartDatabase,
  type PromotionCartScope,
} from "@/lib/promotion-cart-records";
import { getSongPromotionWorkspaceForBand } from "@/lib/song-promotion";
import {
  createPromotionCartCheckout,
  removePromotionFromCart,
} from "./actions";

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

const hasPromotionCheckoutEnv =
  Boolean(process.env.STRIPE_SECRET_KEY) &&
  Boolean(process.env.NEXT_PUBLIC_APP_URL);

export const metadata = {
  title: "Campaign Cart",
};

export default async function SongsCartPage() {
  const band = getCase44DashboardBand();
  const workspace = getSongPromotionWorkspaceForBand(band.slug);

  if (!workspace) {
    notFound();
  }

  let clerkUserId = "local-preview";

  if (hasClerkEnv) {
    const user = await currentUser();
    const viewerEmail = getPrimaryEmail(user);

    if (!user || !canAccessBandWorkspace(band.slug, viewerEmail)) {
      notFound();
    }

    clerkUserId = user.id;
  }

  const scope: PromotionCartScope = {
    clerkUserId,
    bandSlug: band.slug,
    campaignId: workspace.activeCampaign.id,
  };
  const cartItems = hasPromotionCartDatabase()
    ? await getPromotionCartItemsForScope(scope)
    : await getCookiePromotionCartItems(scope);
  const displayItems = getPromotionCartDisplayItems(cartItems);
  const totalCents = displayItems.reduce((total, item) => total + item.amountCents, 0);

  return (
    <SectionShell>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <ButtonLink
            href="/dashboard/musician/songs"
            variant="ghost"
            className="mb-5 px-0"
          >
            <span className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" aria-hidden />
              Back to Songs Command Center
            </span>
          </ButtonLink>
          <Eyebrow>Concierge packages</Eyebrow>
          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[0.98] sm:text-5xl lg:text-6xl">
            Campaign Cart
          </h1>
          <p className="mt-4 max-w-3xl text-[var(--muted)]">
            Review multiple launch packages for one release push, then send the
            combined cart to Multi-item Stripe Checkout.
          </p>
        </div>
        <div className="rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.06)] px-4 py-3 text-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--brass-light)]">
            Cart Total
          </p>
          <p className="mt-1 text-3xl font-black">{formatCents(totalCents)}</p>
          <p className="text-[var(--muted)]">{displayItems.length} package rows</p>
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-[var(--line)] bg-[var(--ink)] p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Eyebrow>Multi-item Stripe Checkout</Eyebrow>
            <h2 className="mt-2 text-3xl font-black">
              {workspace.activeCampaign.title}
            </h2>
          </div>
          <ButtonLink href="/dashboard/musician/songs" variant="secondary">
            Add more packages
          </ButtonLink>
        </div>

        {displayItems.length === 0 ? (
          <div className="mt-6 rounded-md border border-dashed border-[var(--line)] bg-[rgba(245,234,210,0.04)] p-6">
            <ShoppingCart className="size-6 text-[var(--brass-light)]" aria-hidden />
            <h3 className="mt-4 text-2xl font-black">No launch packages yet</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Use Add package on the Songs Command Center to stack SmartLink
              setup, launch prep, local STL push, and full campaign support
              before checkout.
            </p>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-[var(--line)]">
            {displayItems.map((item) => (
              <article
                key={`${item.productId}-${item.campaignId ?? "general"}`}
                className="grid gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>Qty {item.quantity}</Tag>
                    <Tag>{formatCents(item.unitAmountCents)} each</Tag>
                  </div>
                  <h3 className="mt-3 text-xl font-black">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
                <div className="flex flex-col gap-3 lg:min-w-44 lg:items-end">
                  <p className="text-2xl font-black">{formatCents(item.amountCents)}</p>
                  <form action={removePromotionFromCart}>
                    <input
                      type="hidden"
                      name="promotionProductId"
                      value={item.productId}
                    />
                    <input
                      type="hidden"
                      name="promotionCampaignId"
                      value={item.campaignId ?? ""}
                    />
                    <button
                      type="submit"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-3 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[rgba(245,234,210,0.14)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                    >
                      <Trash2 className="size-4" aria-hidden />
                      Remove
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-[var(--muted)]">Campaign cart subtotal</p>
            <p className="text-3xl font-black">{formatCents(totalCents)}</p>
          </div>
          {displayItems.length > 0 && hasPromotionCheckoutEnv ? (
            <form action={createPromotionCartCheckout}>
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--brass)] px-5 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)] sm:w-auto"
              >
                <CreditCard className="size-4" aria-hidden />
                Checkout campaign cart
              </button>
            </form>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[rgba(245,234,210,0.16)] px-5 py-2 text-sm font-bold text-[var(--muted)]"
            >
              <CreditCard className="size-4" aria-hidden />
              Checkout campaign cart
            </button>
          )}
        </div>
      </section>
    </SectionShell>
  );
}
