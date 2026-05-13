export type AccountSetupStatus = "connected" | "claimed" | "needs-review" | "missing";
export type AccountSetupMode = "profile-link" | "oauth-later";
export type PromotionActionStatus = "ready" | "todo" | "blocked" | "optional";
export type PromotionActionPriority = "high" | "medium" | "low";

export type BandRelease = {
  id: string;
  bandSlug: string;
  title: string;
  releaseType: "single" | "ep" | "album";
  primaryTrackTitle: string;
  releaseDate: string;
  smartLinkUrl: string;
  artworkUrl?: string;
  notes: string;
};

export type ArtistAccountLink = {
  platform: string;
  category: "streaming" | "social-video" | "direct-to-fan" | "local-stl";
  url: string | null;
  status: AccountSetupStatus;
  setupMode: AccountSetupMode;
  setupUrl: string;
  notes: string;
};

export type SongPromotionAction = {
  id: string;
  channelId: SongPromotionChannelId;
  title: string;
  status: PromotionActionStatus;
  priority: PromotionActionPriority;
  ctaLabel: string;
  ctaUrl: string;
  detail: string;
};

export type SongPromotionCampaign = {
  id: string;
  release: BandRelease;
  title: string;
  goal: "Release visibility";
  status: "draft" | "requested" | "approved" | "paid" | "scheduled" | "completed";
  promotionCampaignType: "song-release" | "album-launch";
  budgetCents: number;
  channels: SongPromotionChannelId[];
  paidBoostProductIds: string[];
  actions: SongPromotionAction[];
};

export type SongPromotionChannelId =
  | "streaming"
  | "social-video"
  | "direct-to-fan"
  | "local-stl"
  | "paid-boosts";

export type SongPromotionChannel = {
  id: SongPromotionChannelId;
  label: string;
  summary: string;
};

export type SongPromotionWorkspace = {
  bandSlug: string;
  bandName: string;
  accountLinks: ArtistAccountLink[];
  activeCampaign: SongPromotionCampaign;
};

export const songPromotionChannels: SongPromotionChannel[] = [
  {
    id: "streaming",
    label: "Streaming and DSP",
    summary:
      "Claim artist profiles, pitch new music, and use official campaign tools where eligible.",
  },
  {
    id: "social-video",
    label: "Social and video",
    summary:
      "Turn the release into short-form clips, videos, and social assets that point back to the song.",
  },
  {
    id: "direct-to-fan",
    label: "Direct to fan",
    summary:
      "Capture owned audience value with pre-save links, Bandcamp sales, email, and fan messaging.",
  },
  {
    id: "local-stl",
    label: "Local STL",
    summary:
      "Tie the release to local venues, promoters, release-party moments, and STL-Musicians placement.",
  },
  {
    id: "paid-boosts",
    label: "STL-Musicians paid boosts",
    summary:
      "Optional paid promotion packages for musicians who want STL-Musicians to help fulfill the push.",
  },
];

const case44Workspace: SongPromotionWorkspace = {
  bandSlug: "case44",
  bandName: "Case44",
  accountLinks: [
    {
      platform: "Spotify",
      category: "streaming",
      url: "https://artists.spotify.com/",
      status: "claimed",
      setupMode: "profile-link",
      setupUrl: "https://artists.spotify.com/en/campaign-kit",
      notes: "Use Spotify for Artists for playlist pitching, Campaign Kit, Marquee, and Showcase eligibility.",
    },
    {
      platform: "Apple Music / iTunes",
      category: "streaming",
      url: "https://artists.apple.com/",
      status: "claimed",
      setupMode: "profile-link",
      setupUrl: "https://artists.apple.com/support/3392-make-most-promote",
      notes: "Use Apple Music Promote for release cards, milestones, and shareable assets.",
    },
    {
      platform: "YouTube",
      category: "social-video",
      url: "https://www.youtube.com/",
      status: "needs-review",
      setupMode: "oauth-later",
      setupUrl: "https://www.artists.youtube/features/",
      notes: "Review Official Artist Channel, Shorts, Premieres, and music video release options.",
    },
    {
      platform: "TikTok",
      category: "social-video",
      url: "https://www.tiktok.com/",
      status: "needs-review",
      setupMode: "oauth-later",
      setupUrl:
        "https://newsroom.tiktok.com/en-US/tiktok-for-artists-launches?lang=en-GB",
      notes: "Use TikTok for Artists readiness, short clips, fan spotlight ideas, and pre-release options.",
    },
    {
      platform: "Instagram / Facebook",
      category: "social-video",
      url: "https://www.instagram.com/",
      status: "claimed",
      setupMode: "oauth-later",
      setupUrl: "https://www.facebook.com/help/instagram/759279452000505",
      notes: "Prepare Reels, Stories, posts, and Meta ad creative around the release.",
    },
    {
      platform: "SoundCloud",
      category: "streaming",
      url: null,
      status: "missing",
      setupMode: "profile-link",
      setupUrl:
        "https://help.soundcloud.com/hc/en-us/articles/360048212973-Promote-on-SoundCloud-FAQs",
      notes: "Add profile link and check whether Promote on SoundCloud is available for the account.",
    },
    {
      platform: "Bandcamp / DistroKid",
      category: "direct-to-fan",
      url: "https://support.distrokid.com/hc/en-us/articles/360013647913-What-Is-HyperFollow",
      status: "needs-review",
      setupMode: "profile-link",
      setupUrl: "https://bandcamp.com/guide",
      notes: "Use smart/pre-save links before release and Bandcamp/direct-to-fan sales after release.",
    },
    {
      platform: "Amazon Music",
      category: "streaming",
      url: null,
      status: "missing",
      setupMode: "profile-link",
      setupUrl: "https://artists.amazonmusic.com/pitch",
      notes: "Claim the artist profile and pitch eligible upcoming releases through Amazon Music for Artists.",
    },
    {
      platform: "Bandsintown",
      category: "local-stl",
      url: null,
      status: "missing",
      setupMode: "profile-link",
      setupUrl: "https://www.artist.bandsintown.com/features",
      notes: "Connect release promotion with shows, fan alerts, tour dates, and local audience messages.",
    },
    {
      platform: "STL-Musicians",
      category: "local-stl",
      url: "/artists/case44",
      status: "connected",
      setupMode: "profile-link",
      setupUrl: "/dashboard/musician",
      notes: "Use the public profile, local placement, and paid boost options as the STL command layer.",
    },
  ],
  activeCampaign: {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Long Way Home release push",
    goal: "Release visibility",
    status: "draft",
    promotionCampaignType: "song-release",
    budgetCents: 4900,
    channels: [
      "streaming",
      "social-video",
      "direct-to-fan",
      "local-stl",
      "paid-boosts",
    ],
    paidBoostProductIds: [
      "song-release",
      "album-launch",
      "event-attendance",
      "featured-artist",
    ],
    release: {
      id: "case44-long-way-home",
      bandSlug: "case44",
      title: "Long Way Home",
      releaseType: "single",
      primaryTrackTitle: "Long Way Home",
      releaseDate: "2026-06-14",
      smartLinkUrl:
        "https://support.distrokid.com/hc/en-us/articles/360013647913-What-Is-HyperFollow",
      notes:
        "Use this validation campaign to prove the dashboard workflow before opening it to more bands.",
    },
    actions: [
      {
        id: "spotify-campaign-kit",
        channelId: "streaming",
        title: "Spotify Campaign Kit and playlist pitch",
        status: "todo",
        priority: "high",
        ctaLabel: "Open Spotify setup",
        ctaUrl: "https://artists.spotify.com/en/campaign-kit",
        detail:
          "Confirm the artist profile, pitch the unreleased track when eligible, and review Marquee or Showcase availability.",
      },
      {
        id: "apple-promote",
        channelId: "streaming",
        title: "Apple Music Promote assets",
        status: "ready",
        priority: "medium",
        ctaLabel: "Open Apple Promote",
        ctaUrl: "https://artists.apple.com/support/3392-make-most-promote",
        detail:
          "Create release cards, milestone assets, and social graphics for Apple Music and iTunes listeners.",
      },
      {
        id: "short-form-clips",
        channelId: "social-video",
        title: "TikTok, YouTube Shorts, and Reels clip plan",
        status: "todo",
        priority: "high",
        ctaLabel: "Review TikTok for Artists",
        ctaUrl:
          "https://newsroom.tiktok.com/en-US/tiktok-for-artists-launches?lang=en-GB",
        detail:
          "Prepare three short-form ideas: hook clip, live rehearsal clip, and release-day callout.",
      },
      {
        id: "fan-link",
        channelId: "direct-to-fan",
        title: "Smart link and direct-to-fan path",
        status: "ready",
        priority: "high",
        ctaLabel: "Review HyperFollow",
        ctaUrl:
          "https://support.distrokid.com/hc/en-us/articles/360013647913-What-Is-HyperFollow",
        detail:
          "Use one destination for pre-save, streaming links, Bandcamp sales, and owned audience follow-up.",
      },
      {
        id: "local-release-tie-in",
        channelId: "local-stl",
        title: "Local STL release tie-in",
        status: "optional",
        priority: "medium",
        ctaLabel: "Open Bandsintown features",
        ctaUrl: "https://www.artist.bandsintown.com/features",
        detail:
          "Connect the song push to shows, venue outreach, fan alerts, and STL-Musicians featured placement.",
      },
    ],
  },
};

const songPromotionWorkspaces: SongPromotionWorkspace[] = [case44Workspace];

export function getSongPromotionWorkspaceForBand(bandSlug: string) {
  return songPromotionWorkspaces.find((workspace) => workspace.bandSlug === bandSlug);
}

export function getMissingAccountLinks(workspace: SongPromotionWorkspace) {
  return workspace.accountLinks.filter((link) => link.status === "missing");
}

export function getAccountReadinessScore(workspace: SongPromotionWorkspace) {
  const readyCount = workspace.accountLinks.filter(
    (link) => link.status === "connected" || link.status === "claimed",
  ).length;

  return Math.round((readyCount / workspace.accountLinks.length) * 100);
}
