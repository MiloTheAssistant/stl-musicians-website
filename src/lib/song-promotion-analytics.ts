import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { hasDatabaseUrl } from "@/db/env";
import { promotionClickEvents, promotionFanLeads } from "@/db/schema";

export type PromotionClickEventInput = {
  releaseSlug: string;
  platformId: string;
  source?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
};

export type PromotionClickEvent = {
  releaseSlug: string;
  platformId: string;
  source: string | null;
  referrer: string | null;
  userAgent: string | null;
  occurredAt: Date;
};

export type FanLeadInput = {
  releaseSlug: string;
  email: string;
  source?: string | null;
};

export type NormalizedFanLead = {
  releaseSlug: string;
  email: string;
  source: string | null;
};

export type SmartLinkAnalyticsInput = {
  releaseSlug: string;
  platformIds: string[];
  packageStatus: string;
  nextAction: string;
  clicks: Array<{ platformId: string }>;
  fanLeads: Array<{ email: string }>;
};

export type SmartLinkAnalyticsSummary = {
  releaseSlug: string;
  totalClicks: number;
  fanCaptureCount: number;
  packageStatus: string;
  nextAction: string;
  clicksByPlatform: Array<{
    platformId: string;
    clicks: number;
  }>;
};

export function buildPromotionClickEvent(
  input: PromotionClickEventInput,
): PromotionClickEvent {
  return {
    releaseSlug: input.releaseSlug,
    platformId: input.platformId,
    source: input.source?.trim() || null,
    referrer: input.referrer?.trim() || null,
    userAgent: input.userAgent?.trim() || null,
    occurredAt: new Date(),
  };
}

export function normalizeFanLeadInput(input: FanLeadInput): NormalizedFanLead {
  const email = input.email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("A valid email address is required");
  }

  return {
    releaseSlug: input.releaseSlug,
    email,
    source: input.source?.trim() || null,
  };
}

export function summarizeSmartLinkAnalytics(
  input: SmartLinkAnalyticsInput,
): SmartLinkAnalyticsSummary {
  return {
    releaseSlug: input.releaseSlug,
    totalClicks: input.clicks.length,
    fanCaptureCount: input.fanLeads.length,
    packageStatus: input.packageStatus,
    nextAction: input.nextAction,
    clicksByPlatform: input.platformIds.map((platformId) => ({
      platformId,
      clicks: input.clicks.filter((click) => click.platformId === platformId).length,
    })),
  };
}

export async function getSmartLinkAnalyticsSummary({
  releaseSlug,
  platformIds,
  packageStatus,
  nextAction,
}: {
  releaseSlug: string;
  platformIds: string[];
  packageStatus: string;
  nextAction: string;
}) {
  if (!hasDatabaseUrl()) {
    return summarizeSmartLinkAnalytics({
      releaseSlug,
      platformIds,
      packageStatus,
      nextAction,
      clicks: [],
      fanLeads: [],
    });
  }

  const [clicks, fanLeads] = await Promise.all([
    getDb()
      .select({ platformId: promotionClickEvents.platformId })
      .from(promotionClickEvents)
      .where(eq(promotionClickEvents.releaseSlug, releaseSlug)),
    getDb()
      .select({ email: promotionFanLeads.email })
      .from(promotionFanLeads)
      .where(eq(promotionFanLeads.releaseSlug, releaseSlug)),
  ]);

  return summarizeSmartLinkAnalytics({
    releaseSlug,
    platformIds,
    packageStatus,
    nextAction,
    clicks,
    fanLeads,
  });
}
