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
