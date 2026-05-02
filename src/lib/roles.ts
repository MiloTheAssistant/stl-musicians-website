export type UserRoleId = "musician" | "promoter" | "member" | "admin";

export type UserRole = {
  id: UserRoleId;
  label: string;
  headline: string;
  description: string;
  dashboardHref: string;
};

export const userRoles: UserRole[] = [
  {
    id: "musician",
    label: "Musician / Band",
    headline: "Promote your sound and get found by the right rooms.",
    description:
      "Build an EPK-style profile, share releases, post events, and prepare promotion requests.",
    dashboardHref: "/dashboard/musician",
  },
  {
    id: "promoter",
    label: "Promoter",
    headline: "Find serious artists and coordinate stronger shows.",
    description:
      "Discover local talent, manage saved artists, and shape future promotion opportunities.",
    dashboardHref: "/dashboard/promoter",
  },
  {
    id: "member",
    label: "Member / Small Venue",
    headline: "Connect directly with musicians for rooms, events, and private dates.",
    description:
      "Save profiles, submit event interest, and communicate with musicians without getting lost in DMs.",
    dashboardHref: "/dashboard/member",
  },
  {
    id: "admin",
    label: "Admin",
    headline: "Keep the scene curated, current, and trustworthy.",
    description:
      "Review profiles, approve events, manage featured content, and monitor future paid promotion flows.",
    dashboardHref: "/dashboard/admin",
  },
];

export const dashboardRoutes = userRoles.map((role) => ({
  role: role.id,
  label: role.label,
  href: role.dashboardHref,
}));

export function isKnownRole(value: unknown): value is UserRoleId {
  return userRoles.some((role) => role.id === value);
}

export function getDashboardForRole(role: UserRoleId): string {
  return userRoles.find((item) => item.id === role)?.dashboardHref ?? "/dashboard";
}
