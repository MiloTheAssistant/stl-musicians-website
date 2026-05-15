export type TestBandDashboard = {
  slug: string;
  name: string;
  genre: string;
  location: string;
  repoUrl: string;
  websiteUrl: string;
  logoImage: string;
  description: string;
  activePlanId: "basic" | "song" | "album";
  trialEndsAt: string;
  stats: BandWorkspaceStat[];
  navigation: BandWorkspaceNavItem[];
  upcomingEvents: BandWorkspaceEvent[];
  socialImpact: BandSocialImpact[];
};

export type BandWorkspaceStat = {
  label: string;
  value: string;
  detail: string;
};

export type BandWorkspaceNavItem = {
  label: string;
  href: string;
  description: string;
};

export type BandWorkspaceEvent = {
  date: string;
  time: string;
  title: string;
  venue: string;
  status: "Booked" | "Published";
};

export type BandSocialImpact = {
  channel: "Facebook" | "Instagram" | "TikTok" | "LinkedIn";
  value: string;
};

export function getCase44WebsiteUrl() {
  return (
    process.env.NEXT_PUBLIC_CASE44_SITE_URL ??
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3010"
      : "https://case44.vercel.app")
  );
}

export function getCase44DashboardBand(): TestBandDashboard {
  return {
    slug: "case44",
    name: "Case44",
    genre: "Blues / Rock",
    location: "St. Louis, Missouri",
    repoUrl: "https://github.com/MiloTheAssistant/case44",
    websiteUrl: getCase44WebsiteUrl(),
    logoImage: "/images/case44/1bdbd8c8-case44-lettered.png",
    description:
      "Test band workspace for validating website publishing, promotions, events, and subscription features.",
    activePlanId: "song",
    trialEndsAt: "2026-07-02",
    stats: [
      {
        label: "Songs Promoted",
        value: "2",
        detail: "1 active spotlight and 1 draft campaign this month.",
      },
      {
        label: "Social Media Impact",
        value: "14.8k",
        detail: "Estimated reach across connected social accounts.",
      },
      {
        label: "Next 14 Days",
        value: "3",
        detail: "Booked or published events through May 17.",
      },
    ],
    navigation: [
      {
        label: "Website",
        href: "#website",
        description: "Review public site content and publishing status.",
      },
      {
        label: "Songs",
        href: "/dashboard/musician/songs",
        description: "Manage song spotlights and promotion campaigns.",
      },
      {
        label: "Social",
        href: "#social",
        description: "Draft posts and review connected account impact.",
      },
      {
        label: "Events Calendar",
        href: "#events",
        description: "Review upcoming shows and booking details.",
      },
      {
        label: "Merch",
        href: "#merch",
        description: "Edit products, sizes, images, and availability.",
      },
      {
        label: "Billing",
        href: "#billing",
        description: "View subscription tier and platform payment setup.",
      },
    ],
    upcomingEvents: [
      {
        date: "May 3",
        time: "4:00 PM",
        title: "Case 44 Hosts Weekly Jam Session",
        venue: "Moonshine Blues Bar",
        status: "Published",
      },
      {
        date: "May 10",
        time: "7:00 PM",
        title: "Case 44 @ Fast Eddie's Bon Air",
        venue: "Fast Eddie's Bon-Air",
        status: "Booked",
      },
      {
        date: "May 17",
        time: "2:00 PM",
        title: "Case 44 @ Hawg Pit BBQ - Grafton Bike Week",
        venue: "Hawg Pit BBQ",
        status: "Published",
      },
    ],
    socialImpact: [
      { channel: "Facebook", value: "6.2k" },
      { channel: "Instagram", value: "3.9k" },
      { channel: "TikTok", value: "3.1k" },
      { channel: "LinkedIn", value: "1.6k" },
    ],
  };
}
