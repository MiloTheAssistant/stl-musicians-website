import { after } from "next/server";
import { Resend } from "resend";
import { siteConfig } from "./content";
import { formatCents } from "./payment-products";

export type PromotionNotificationEventType =
  | "checkout-started"
  | "payment-completed";

export type PromotionNotificationInput = {
  eventType: PromotionNotificationEventType;
  checkoutSessionId: string;
  clerkUserId: string;
  promotionPackage: string;
  promotionProductId?: string | null;
  promotionCampaignId?: string | null;
  source: "single" | "cart";
  amountCents?: number | null;
  currency?: string | null;
  itemCount?: number | null;
};

export type PromotionNotificationConfig = {
  apiKey: string;
  from: string;
  to: string[];
};

export type PromotionNotificationEmail = {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
};

type PromotionNotificationSendOptions = {
  env?: Record<string, string | undefined>;
  send?: (message: PromotionNotificationEmail) => Promise<unknown>;
};

let resendClient: Resend | null = null;

function getResendClient(apiKey: string) {
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

function splitEmails(value: string | undefined) {
  return (
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function eventLabel(eventType: PromotionNotificationEventType) {
  return eventType === "payment-completed"
    ? "Payment received"
    : "Checkout started";
}

export function getPromotionNotificationConfig(
  env: Record<string, string | undefined> = process.env,
): PromotionNotificationConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  const from =
    env.PROMOTION_NOTIFICATIONS_FROM?.trim() ||
    env.RESEND_FROM_EMAIL?.trim() ||
    `${siteConfig.name} <${siteConfig.email}>`;
  const to = splitEmails(
    env.PROMOTION_NOTIFICATIONS_TO || env.STL_MUSICIANS_ADMIN_EMAILS,
  );

  return {
    apiKey,
    from,
    to: to.length > 0 ? to : [siteConfig.email],
  };
}

export function buildPromotionNotificationEmail(
  input: PromotionNotificationInput,
  config: PromotionNotificationConfig,
): PromotionNotificationEmail {
  const label = eventLabel(input.eventType);
  const amount =
    typeof input.amountCents === "number"
      ? formatCents(input.amountCents)
      : "Not available";
  const lines = [
    `Event: ${label}`,
    `Package: ${input.promotionPackage}`,
    `Source: ${input.source === "cart" ? "Promotion cart" : "Single package"}`,
    `Amount: ${amount}`,
    `Checkout session: ${input.checkoutSessionId}`,
    `Clerk user: ${input.clerkUserId}`,
    `Campaign: ${input.promotionCampaignId || "Not attached"}`,
    `Product: ${input.promotionProductId || "Multiple cart items"}`,
    `Items: ${input.itemCount ?? 1}`,
    `Currency: ${(input.currency || "usd").toUpperCase()}`,
  ];

  return {
    from: config.from,
    to: config.to,
    subject: `STL-Musicians promotion ${label.toLowerCase()}: ${input.promotionPackage}`,
    text: lines.join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h1 style="font-size: 20px;">${escapeHtml(label)}</h1>
        <p>A Song Command Center promotion event needs review.</p>
        <ul>
          ${lines
            .map((line) => `<li>${escapeHtml(line)}</li>`)
            .join("")}
        </ul>
      </div>
    `,
  };
}

async function sendWithResend(
  message: PromotionNotificationEmail,
  config: PromotionNotificationConfig,
) {
  return getResendClient(config.apiKey).emails.send(message);
}

export async function sendPromotionNotification(
  input: PromotionNotificationInput,
  options: PromotionNotificationSendOptions = {},
) {
  const config = getPromotionNotificationConfig(options.env);

  if (!config) {
    return { status: "skipped" as const, reason: "not-configured" as const };
  }

  const message = buildPromotionNotificationEmail(input, config);

  try {
    await (options.send ?? ((email) => sendWithResend(email, config)))(message);
    return { status: "sent" as const };
  } catch (error) {
    console.error("Failed to send promotion notification", error);
    return { status: "failed" as const };
  }
}

export function queuePromotionNotification(input: PromotionNotificationInput) {
  after(() => sendPromotionNotification(input));
}
