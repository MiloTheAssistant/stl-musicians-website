import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db";
import { hasDatabaseUrl } from "@/db/env";
import { promotionClickEvents } from "@/db/schema";
import {
  getReleaseSmartLinkPath,
  getSmartLinkReleaseBySlug,
} from "@/lib/song-promotion";
import { buildPromotionClickEvent } from "@/lib/song-promotion-analytics";

type RouteContext = {
  params: Promise<{ releaseSlug: string; platformId: string }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { releaseSlug, platformId } = await params;
  const release = getSmartLinkReleaseBySlug(releaseSlug);
  const link = release?.destinationLinks.find((item) => item.id === platformId);
  const fallbackUrl = new URL(
    release ? getReleaseSmartLinkPath(release) : "/",
    request.url,
  );

  if (!release || !link) {
    return NextResponse.redirect(fallbackUrl);
  }

  const click = buildPromotionClickEvent({
    releaseSlug,
    platformId,
    source: request.nextUrl.searchParams.get("source"),
    referrer: request.headers.get("referer"),
    userAgent: request.headers.get("user-agent"),
  });

  if (hasDatabaseUrl()) {
    try {
      await getDb().insert(promotionClickEvents).values({
        releaseSlug: click.releaseSlug,
        platformId: click.platformId,
        source: click.source,
        referrer: click.referrer,
        userAgent: click.userAgent,
      });
    } catch {
      // Click tracking should never block fans from reaching the release.
    }
  }

  return NextResponse.redirect(link.url);
}
