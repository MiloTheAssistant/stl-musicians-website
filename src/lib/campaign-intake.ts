import { and, desc, eq } from "drizzle-orm";
import { hasDatabaseUrl } from "@/db/env";
import { getDb } from "@/db";
import {
  artistAccountLinks,
  artistProfilesTable,
  bandReleases,
  promotionCampaigns,
} from "@/db/schema";
import { getCase44DashboardBand } from "./band-dashboard";
import {
  getSmartLinkReleaseForCampaign,
  getSongPromotionWorkspaceForBand,
  type SongPromotionChannelId,
} from "./song-promotion";

export const campaignIntakeStatuses = [
  "draft",
  "submitted",
  "needs_review",
  "paid",
  "in_fulfillment",
] as const;

export type CampaignIntakeStatus = (typeof campaignIntakeStatuses)[number];

export const campaignIntakeStatusLabels: Record<CampaignIntakeStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  needs_review: "Needs review",
  paid: "Paid",
  in_fulfillment: "In fulfillment",
};

export type CampaignIntakePlatformLink = {
  platform: "Spotify" | "Apple Music" | "YouTube" | "Social";
  fieldName: "spotifyUrl" | "appleMusicUrl" | "youtubeUrl" | "socialUrl";
  url: string;
};

export type CampaignIntakeDraft = {
  bandSlug: string;
  artistName: string;
  genre: string;
  homeBase: string;
  campaignId: string;
  releaseTitle: string;
  releaseDate: string;
  artworkUrl: string;
  platformLinks: CampaignIntakePlatformLink[];
  localTieIns: string;
  packageIntent: string;
  notes: string;
  status: CampaignIntakeStatus;
  publicPublishingStatus: string;
};

export type CampaignIntakeInput = Omit<
  CampaignIntakeDraft,
  "artistName" | "genre" | "homeBase" | "publicPublishingStatus"
>;

export const case44ArtistProfileId = "33333333-3333-4333-8333-333333333333";
export const case44ReleaseId = "22222222-2222-4222-8222-222222222222";

const platformFields = [
  {
    platform: "Spotify",
    fieldName: "spotifyUrl",
    category: "streaming",
  },
  {
    platform: "Apple Music",
    fieldName: "appleMusicUrl",
    category: "streaming",
  },
  {
    platform: "YouTube",
    fieldName: "youtubeUrl",
    category: "social-video",
  },
  {
    platform: "Social",
    fieldName: "socialUrl",
    category: "social-video",
  },
] as const;

function getString(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isValidDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function isAllowedUrl(value: string) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function normalizeCampaignIntakeStatus(
  value: FormDataEntryValue | string | null | undefined,
): CampaignIntakeStatus {
  if (value === "requested") {
    return "submitted";
  }

  if (value === "approved") {
    return "needs_review";
  }

  if (value === "scheduled" || value === "completed") {
    return "in_fulfillment";
  }

  return typeof value === "string" &&
    campaignIntakeStatuses.includes(value as CampaignIntakeStatus)
    ? (value as CampaignIntakeStatus)
    : "draft";
}

export function parseCampaignIntakeForm(formData: FormData):
  | { ok: true; value: CampaignIntakeInput; errors: [] }
  | { ok: false; value: null; errors: string[] } {
  const releaseTitle = getString(formData, "releaseTitle");
  const releaseDate = getString(formData, "releaseDate");
  const artworkUrl = getString(formData, "artworkUrl");
  const localTieIns = getString(formData, "localTieIns");
  const packageIntent = getString(formData, "packageIntent");
  const notes = getString(formData, "notes");
  const intent = getString(formData, "intent");
  const status = normalizeCampaignIntakeStatus(
    intent === "submit" ? "submitted" : formData.get("status"),
  );
  const errors: string[] = [];

  if (!releaseTitle) {
    errors.push("Release title is required.");
  }

  if (!releaseDate) {
    errors.push("Release date is required.");
  } else if (!isValidDateInput(releaseDate)) {
    errors.push("Release date must use YYYY-MM-DD.");
  }

  if (!packageIntent) {
    errors.push("Package intent is required.");
  }

  if (!isAllowedUrl(artworkUrl)) {
    errors.push("Artwork must be a valid URL or site asset path.");
  }

  const platformLinks = platformFields
    .map((field) => ({
      platform: field.platform,
      fieldName: field.fieldName,
      url: getString(formData, field.fieldName),
    }))
    .filter((link) => link.url.length > 0);

  for (const link of platformLinks) {
    if (!isAllowedUrl(link.url) || link.url.startsWith("/")) {
      errors.push(`${link.platform} must be a valid public URL.`);
    }
  }

  if (errors.length > 0) {
    return { ok: false, value: null, errors };
  }

  return {
    ok: true,
    errors: [],
    value: {
      bandSlug: "case44",
      campaignId:
        getString(formData, "campaignId") ||
        getFallbackCampaignIntakeDraft("case44").campaignId,
      releaseTitle,
      releaseDate,
      artworkUrl,
      platformLinks,
      localTieIns,
      packageIntent,
      notes,
      status,
    },
  };
}

export function getFallbackCampaignIntakeDraft(bandSlug: string): CampaignIntakeDraft {
  const band = getCase44DashboardBand();
  const workspace = getSongPromotionWorkspaceForBand(bandSlug);

  if (!workspace) {
    return {
      bandSlug,
      artistName: band.name,
      genre: band.genre,
      homeBase: band.location,
      campaignId: "",
      releaseTitle: "",
      releaseDate: "",
      artworkUrl: "",
      platformLinks: [],
      localTieIns: "",
      packageIntent: "",
      notes: "",
      status: "draft",
      publicPublishingStatus: "Private draft is not published to a public SmartLink.",
    };
  }

  const campaign = workspace.activeCampaign;
  const smartLinkRelease = getSmartLinkReleaseForCampaign(campaign.id);

  return {
    bandSlug,
    artistName: band.name,
    genre: band.genre,
    homeBase: band.location,
    campaignId: campaign.id,
    releaseTitle: campaign.release.title,
    releaseDate: campaign.release.releaseDate,
    artworkUrl: campaign.release.artworkUrl ?? band.logoImage,
    platformLinks: platformFields
      .map((field) => {
        const destination = smartLinkRelease?.destinationLinks.find((link) =>
          link.platform.toLowerCase().includes(field.platform.toLowerCase()),
        );

        return {
          platform: field.platform,
          fieldName: field.fieldName,
          url: destination?.url ?? "",
        };
      })
      .filter((link) => link.url),
    localTieIns: smartLinkRelease?.localTieIns.join("\n") ?? "",
    packageIntent: "Full release campaign",
    notes: campaign.release.notes,
    status: "draft",
    publicPublishingStatus: "Private draft is not published to a public SmartLink.",
  };
}

function mergeDraft(
  fallback: CampaignIntakeDraft,
  values: Partial<CampaignIntakeDraft>,
): CampaignIntakeDraft {
  return {
    ...fallback,
    ...values,
    platformLinks: values.platformLinks ?? fallback.platformLinks,
  };
}

export async function getCampaignIntakeForBand(bandSlug: string) {
  const fallback = getFallbackCampaignIntakeDraft(bandSlug);

  if (!hasDatabaseUrl() || bandSlug !== "case44") {
    return fallback;
  }

  const [profile] = await getDb()
    .select()
    .from(artistProfilesTable)
    .where(eq(artistProfilesTable.slug, bandSlug))
    .limit(1);

  if (!profile) {
    return fallback;
  }

  const [release] = await getDb()
    .select()
    .from(bandReleases)
    .where(eq(bandReleases.artistProfileId, profile.id))
    .orderBy(desc(bandReleases.updatedAt))
    .limit(1);

  const [campaign] = await getDb()
    .select()
    .from(promotionCampaigns)
    .where(eq(promotionCampaigns.id, fallback.campaignId))
    .limit(1);

  const accountLinks = await getDb()
    .select()
    .from(artistAccountLinks)
    .where(eq(artistAccountLinks.artistProfileId, profile.id));

  const platformLinks = platformFields
    .map((field) => {
      const record = accountLinks.find((link) => link.platform === field.platform);

      return {
        platform: field.platform,
        fieldName: field.fieldName,
        url: record?.url ?? "",
      };
    })
    .filter((link) => link.url);

  return mergeDraft(fallback, {
    artistName: profile.name,
    genre: profile.genre,
    homeBase: profile.homeBase,
    releaseTitle: release?.title ?? fallback.releaseTitle,
    releaseDate: release?.releaseDate
      ? release.releaseDate.toISOString().slice(0, 10)
      : fallback.releaseDate,
    artworkUrl: release?.artworkUrl ?? fallback.artworkUrl,
    platformLinks,
    localTieIns: campaign?.localTieIns ?? fallback.localTieIns,
    packageIntent: campaign?.packageIntent ?? fallback.packageIntent,
    notes: campaign?.artistNotes ?? release?.notes ?? fallback.notes,
    status: normalizeCampaignIntakeStatus(campaign?.status),
  });
}

async function upsertArtistAccountLink(
  artistProfileId: string,
  link: CampaignIntakePlatformLink,
) {
  const field = platformFields.find((item) => item.platform === link.platform);
  const [matchingLink] = await getDb()
    .select()
    .from(artistAccountLinks)
    .where(
      and(
        eq(artistAccountLinks.artistProfileId, artistProfileId),
        eq(artistAccountLinks.platform, link.platform),
      ),
    )
    .limit(1);

  if (matchingLink) {
    await getDb()
      .update(artistAccountLinks)
      .set({
        url: link.url,
        status: "needs-review",
        setupMode: "profile-link",
        setupUrl: link.url,
        notes: "Artist-submitted campaign intake link.",
        updatedAt: new Date(),
      })
      .where(eq(artistAccountLinks.id, matchingLink.id));
    return;
  }

  await getDb().insert(artistAccountLinks).values({
    artistProfileId,
    platform: link.platform,
    category: field?.category ?? "social-video",
    url: link.url,
    status: "needs-review",
    setupMode: "profile-link",
    setupUrl: link.url,
    notes: "Artist-submitted campaign intake link.",
  });
}

export async function saveCampaignIntake(input: CampaignIntakeInput) {
  if (!hasDatabaseUrl()) {
    return null;
  }

  const fallback = getFallbackCampaignIntakeDraft(input.bandSlug);
  const releaseDate = new Date(`${input.releaseDate}T00:00:00Z`);
  const channels: SongPromotionChannelId[] = [
    "streaming",
    "social-video",
    "direct-to-fan",
    "local-stl",
    "paid-boosts",
  ];

  await getDb()
    .insert(artistProfilesTable)
    .values({
      id: case44ArtistProfileId,
      slug: input.bandSlug,
      name: fallback.artistName,
      genre: fallback.genre,
      homeBase: fallback.homeBase,
      bio: input.notes || "Artist-submitted campaign workspace.",
      bookingFocus: input.localTieIns || "Local STL release support.",
      mediaLinks: input.platformLinks.map((link) => link.url),
      isFeatured: true,
    })
    .onConflictDoUpdate({
      target: artistProfilesTable.slug,
      set: {
        name: fallback.artistName,
        genre: fallback.genre,
        homeBase: fallback.homeBase,
        bio: input.notes || "Artist-submitted campaign workspace.",
        bookingFocus: input.localTieIns || "Local STL release support.",
        mediaLinks: input.platformLinks.map((link) => link.url),
        isFeatured: true,
      },
    });

  await getDb()
    .insert(bandReleases)
    .values({
      id: case44ReleaseId,
      artistProfileId: case44ArtistProfileId,
      title: input.releaseTitle,
      releaseType: "single",
      primaryTrackTitle: input.releaseTitle,
      releaseDate,
      smartLinkUrl: null,
      artworkUrl: input.artworkUrl || null,
      notes: input.notes,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: bandReleases.id,
      set: {
        title: input.releaseTitle,
        primaryTrackTitle: input.releaseTitle,
        releaseDate,
        artworkUrl: input.artworkUrl || null,
        notes: input.notes,
        updatedAt: new Date(),
      },
    });

  for (const link of input.platformLinks) {
    await upsertArtistAccountLink(case44ArtistProfileId, link);
  }

  await getDb()
    .insert(promotionCampaigns)
    .values({
      id: input.campaignId,
      artistProfileId: case44ArtistProfileId,
      releaseId: case44ReleaseId,
      title: `${input.releaseTitle} release campaign`,
      campaignType: "song-release",
      status: input.status,
      budgetCents: 0,
      channels,
      packageIntent: input.packageIntent,
      localTieIns: input.localTieIns,
      artistNotes: input.notes,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: promotionCampaigns.id,
      set: {
        artistProfileId: case44ArtistProfileId,
        releaseId: case44ReleaseId,
        title: `${input.releaseTitle} release campaign`,
        status: input.status,
        channels,
        packageIntent: input.packageIntent,
        localTieIns: input.localTieIns,
        artistNotes: input.notes,
        updatedAt: new Date(),
      },
    });
}
