import { describe, expect, it } from "vitest";
import {
  artistProfiles,
  authPortals,
  coreGenres,
  events,
  getArtistBySlug,
  venues,
} from "./content";
import { dashboardRoutes, userRoles } from "./roles";

describe("STL-Musicians launch content", () => {
  it("represents the core St. Louis music genres in discovery", () => {
    expect(coreGenres).toEqual(
      expect.arrayContaining([
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
      ]),
    );
  });

  it("ships real role portals and dashboard routes for every launch audience", () => {
    expect(userRoles.map((role) => role.id)).toEqual([
      "musician",
      "promoter",
      "member",
      "admin",
    ]);
    expect(authPortals.map((portal) => portal.role)).toEqual([
      "musician",
      "promoter",
      "member",
      "admin",
    ]);
    expect(dashboardRoutes.map((route) => route.href)).toEqual([
      "/dashboard/musician",
      "/dashboard/promoter",
      "/dashboard/member",
      "/dashboard/admin",
    ]);
  });

  it("provides seeded artists, venues, and events for the first public launch", () => {
    expect(artistProfiles).toHaveLength(6);
    expect(venues).toHaveLength(4);
    expect(events).toHaveLength(4);
    expect(getArtistBySlug("riverfront-brass-union")?.homeBase).toBe(
      "Soulard",
    );
  });
});
