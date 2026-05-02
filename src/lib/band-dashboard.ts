export type TestBandDashboard = {
  slug: string;
  name: string;
  genre: string;
  location: string;
  repoUrl: string;
  websiteUrl: string;
  description: string;
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
    description:
      "Test band workspace for validating website publishing, promotions, events, and subscription features.",
  };
}
