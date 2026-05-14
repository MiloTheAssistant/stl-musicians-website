import type { UserRoleId } from "./roles";

export const siteConfig = {
  name: "STL-Musicians.com",
  codename: "StageLink STL",
  legalOperator: "Digital Energy Holdings, LLC",
  url: "https://stl-musicians.com",
  description:
    "Where St. Louis musicians, venues, and fans connect.",
  tagline: "Where St. Louis musicians, venues, and fans connect.",
  email: "contact@stl-musicians.com",
  phone: "(573) 500-0064",
  phoneHref: "tel:+15735000064",
  location: "St. Louis, MO",
};

export const coreGenres = [
  "Rock",
  "Blues",
  "Jazz",
  "Country",
  "Hip-Hop",
  "R&B / Soul",
  "EDM / DJ",
  "Folk / Acoustic",
  "Metal / Punk",
  "Cover / Tribute",
] as const;

export type CoreGenre = (typeof coreGenres)[number];

export type ArtistProfile = {
  slug: string;
  name: string;
  genre: CoreGenre;
  homeBase: string;
  shortBio: string;
  bookingFocus: string;
  media: string[];
  nextGig: string;
  status: "featured" | "review" | "new";
};

export const artistProfiles: ArtistProfile[] = [
  {
    slug: "riverfront-brass-union",
    name: "Riverfront Brass Union",
    genre: "Jazz",
    homeBase: "Soulard",
    shortBio:
      "A horn-forward collective blending second-line energy, blue-note swing, and late-night STL groove.",
    bookingFocus: "Festivals, cocktail hours, gallery openings",
    media: ["YouTube live session", "Spotify EP", "Instagram reels"],
    nextGig: "May 17 - The Grove Street Stage",
    status: "featured",
  },
  {
    slug: "north-side-current",
    name: "North Side Current",
    genre: "Hip-Hop",
    homeBase: "North City",
    shortBio:
      "Sharp lyricism, live drums, and cinematic samples built for rooms that want more than a playlist.",
    bookingFocus: "Album releases, colleges, cultural events",
    media: ["Music video", "Bandcamp release", "TikTok clips"],
    nextGig: "May 23 - Delmar Hall showcase",
    status: "featured",
  },
  {
    slug: "red-clay-revival",
    name: "Red Clay Revival",
    genre: "Country",
    homeBase: "Metro East",
    shortBio:
      "Modern country writing with river-town grit, lap steel, and a road-tested rhythm section.",
    bookingFocus: "Breweries, outdoor stages, private parties",
    media: ["Live acoustic reel", "Spotify singles", "Press photos"],
    nextGig: "June 1 - Belleville Summer Nights",
    status: "new",
  },
  {
    slug: "arc-light-saints",
    name: "Arc Light Saints",
    genre: "Rock",
    homeBase: "The Grove",
    shortBio:
      "Lean guitars, tight hooks, and a club-ready show built for high-energy bills.",
    bookingFocus: "Clubs, festivals, support slots",
    media: ["EPK video", "Live photos", "Setlist samples"],
    nextGig: "May 30 - Off Broadway",
    status: "review",
  },
  {
    slug: "blue-hour-confessional",
    name: "Blue Hour Confessional",
    genre: "Blues",
    homeBase: "Benton Park",
    shortBio:
      "Electric blues with smoky vocals, patient guitar work, and deep South Side feel.",
    bookingFocus: "Listening rooms, restaurants, hotel lounges",
    media: ["Live trio recording", "Instagram", "Press kit"],
    nextGig: "June 7 - BB's Jazz, Blues & Soups",
    status: "featured",
  },
  {
    slug: "lofi-arch-session",
    name: "Lo-Fi Arch Session",
    genre: "EDM / DJ",
    homeBase: "Downtown West",
    shortBio:
      "A producer/DJ project crossing house, lo-fi beat culture, and visual-forward late-night sets.",
    bookingFocus: "After-parties, brand activations, art events",
    media: ["SoundCloud mix", "Visual set reel", "Instagram"],
    nextGig: "May 25 - Warehouse Sessions",
    status: "new",
  },
];

export type Venue = {
  name: string;
  neighborhood: string;
  capacity: string;
  roomType: string;
};

export const venues: Venue[] = [
  {
    name: "The Grove Street Stage",
    neighborhood: "The Grove",
    capacity: "250",
    roomType: "Original music room",
  },
  {
    name: "South City Listening Room",
    neighborhood: "Tower Grove South",
    capacity: "90",
    roomType: "Seated acoustic venue",
  },
  {
    name: "River Market Yard",
    neighborhood: "Soulard",
    capacity: "500",
    roomType: "Outdoor event space",
  },
  {
    name: "Metro East Hall",
    neighborhood: "Belleville",
    capacity: "350",
    roomType: "Private and community events",
  },
];

export type EventListing = {
  title: string;
  date: string;
  venue: string;
  artists: string[];
  tags: CoreGenre[];
  ticketUrl: string;
};

export const events: EventListing[] = [
  {
    title: "River City New Music Night",
    date: "2026-05-17T20:00:00-05:00",
    venue: "The Grove Street Stage",
    artists: ["Riverfront Brass Union", "Arc Light Saints"],
    tags: ["Jazz", "Rock"],
    ticketUrl: "#",
  },
  {
    title: "South Side Blues Table",
    date: "2026-05-22T19:30:00-05:00",
    venue: "South City Listening Room",
    artists: ["Blue Hour Confessional"],
    tags: ["Blues"],
    ticketUrl: "#",
  },
  {
    title: "Release Radar STL",
    date: "2026-05-23T21:00:00-05:00",
    venue: "Delmar Hall showcase",
    artists: ["North Side Current"],
    tags: ["Hip-Hop", "R&B / Soul"],
    ticketUrl: "#",
  },
  {
    title: "Metro East Summer Nights",
    date: "2026-06-01T18:00:00-05:00",
    venue: "Metro East Hall",
    artists: ["Red Clay Revival"],
    tags: ["Country", "Folk / Acoustic"],
    ticketUrl: "#",
  },
];

export type AuthPortal = {
  role: UserRoleId;
  title: string;
  href: string;
  cta: string;
  proofPoints: string[];
};

export const authPortals: AuthPortal[] = [
  {
    role: "musician",
    title: "Musician / Band Login",
    href: "/login/musician",
    cta: "Build your profile",
    proofPoints: ["Promote songs and albums", "Post shows", "Prepare paid boosts"],
  },
  {
    role: "promoter",
    title: "Promoter Login",
    href: "/login/promoter",
    cta: "Find talent",
    proofPoints: ["Save artists", "Coordinate campaigns", "Create opportunities"],
  },
  {
    role: "member",
    title: "Member / Small Venue Login",
    href: "/login/member",
    cta: "Start connecting",
    proofPoints: ["Save profiles", "Request availability", "Message directly"],
  },
  {
    role: "admin",
    title: "Admin Login",
    href: "/login/admin",
    cta: "Review the platform",
    proofPoints: ["Approve profiles", "Curate events", "Monitor trust signals"],
  },
];

export const promotionPackages = [
  "SmartLink Setup",
  "Launch Prep",
  "Local STL Push",
  "Full Release Campaign",
];

export function getArtistBySlug(slug: string) {
  return artistProfiles.find((artist) => artist.slug === slug);
}
