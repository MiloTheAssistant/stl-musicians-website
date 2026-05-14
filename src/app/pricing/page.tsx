import { CreditCard, Megaphone } from "lucide-react";
import { Eyebrow, SectionShell } from "@/components/ui";
import {
  createPromotionCheckout,
  createSubscriptionCheckout,
} from "./actions";
import {
  formatCents,
  getPaidSubscriptionPlans,
  hasSubscriptionPriceIds,
  promotionProducts,
} from "@/lib/payment-products";
import { getPlanById } from "@/lib/subscription-plans";

export const metadata = {
  title: "Pricing",
  description: "Stripe-backed subscription and promotion options for STL-Musicians.com.",
  alternates: {
    canonical: "/pricing",
  },
};

const hasStripeCheckoutEnv =
  Boolean(process.env.STRIPE_SECRET_KEY) &&
  Boolean(process.env.NEXT_PUBLIC_APP_URL);
const hasSubscriptionCheckoutEnv =
  hasStripeCheckoutEnv && hasSubscriptionPriceIds();

export default function PricingPage() {
  const basicPlan = getPlanById("basic");
  const paidPlans = getPaidSubscriptionPlans();

  return (
    <SectionShell>
      <Eyebrow>Billing</Eyebrow>
      <h1 className="mt-3 max-w-4xl text-5xl font-black">
        Subscriptions and paid promotions for working musicians.
      </h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Start with the free onboarding workspace, then use Stripe Checkout for
        paid tiers and promotion packages when you are ready to push a release,
        event, or featured placement.
      </p>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {basicPlan && (
          <article className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <CreditCard className="size-5 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-4 text-2xl font-black">{basicPlan.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {basicPlan.summary}
            </p>
            <p className="mt-5 text-4xl font-black">$0</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {basicPlan.trialDays} day onboarding workspace
            </p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
              {basicPlan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        )}

        {paidPlans.map((plan) => (
          <article
            key={plan.id}
            className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5"
          >
            <CreditCard className="size-5 text-[var(--brass-light)]" aria-hidden />
            <h2 className="mt-4 text-2xl font-black">{plan.name}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {plan.summary}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-3xl font-black">
                  {formatCents(plan.monthlyPriceCents)}
                </p>
                <p className="text-sm text-[var(--muted)]">Monthly</p>
              </div>
              <div>
                <p className="text-3xl font-black">
                  {formatCents(plan.yearlyPriceCents)}
                </p>
                <p className="text-sm text-[var(--muted)]">Yearly</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-[var(--muted)]">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3 pt-6 sm:grid-cols-2">
              {hasSubscriptionCheckoutEnv ? (
                <form action={createSubscriptionCheckout}>
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="billingInterval" value="monthly" />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                  >
                    Monthly checkout
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[rgba(245,234,210,0.16)] px-4 py-2 text-sm font-bold text-[var(--muted)]"
                >
                  Monthly checkout
                </button>
              )}
              {hasSubscriptionCheckoutEnv ? (
                <form action={createSubscriptionCheckout}>
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="billingInterval" value="yearly" />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-4 py-2 text-sm font-bold text-[var(--foreground)] transition hover:bg-[rgba(245,234,210,0.14)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                  >
                    Yearly checkout
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-md border border-[var(--line)] bg-[rgba(245,234,210,0.08)] px-4 py-2 text-sm font-bold text-[var(--muted)]"
                >
                  Yearly checkout
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <section id="paid-promotions" className="mt-14 scroll-mt-24">
        <Eyebrow>Paid Promotions</Eyebrow>
        <h2 className="mt-3 text-3xl font-black">
          Buy campaign boosts without changing your subscription.
        </h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {promotionProducts.map((product) => (
            <article
              key={product.id}
              className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5"
            >
              <Megaphone
                className="size-5 text-[var(--brass-light)]"
                aria-hidden
              />
              <h3 className="mt-4 text-xl font-black">{product.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {product.description}
              </p>
              <p className="mt-5 text-3xl font-black">
                {formatCents(product.amountCents)}
              </p>
              {hasStripeCheckoutEnv ? (
                <form action={createPromotionCheckout} className="mt-auto pt-6">
                  <input
                    type="hidden"
                    name="promotionProductId"
                    value={product.id}
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[var(--brass)] px-4 py-2 text-sm font-bold text-[var(--ink)] transition hover:bg-[var(--brass-light)] focus:outline-none focus:ring-2 focus:ring-[var(--brass-light)]"
                  >
                    Promotion checkout
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-auto inline-flex min-h-11 w-full items-center justify-center rounded-md bg-[rgba(245,234,210,0.16)] px-4 py-2 text-sm font-bold text-[var(--muted)]"
                >
                  Promotion checkout
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
    </SectionShell>
  );
}
