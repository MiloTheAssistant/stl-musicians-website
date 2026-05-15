import { describe, expect, it } from "vitest";
import {
  getFallbackCampaignIntakeDraft,
  normalizeCampaignIntakeStatus,
  parseCampaignIntakeForm,
} from "./campaign-intake";

describe("campaign intake", () => {
  it("labels the artist-facing review workflow statuses", () => {
    expect(normalizeCampaignIntakeStatus("submitted")).toBe("submitted");
    expect(normalizeCampaignIntakeStatus("needs_review")).toBe("needs_review");
    expect(normalizeCampaignIntakeStatus("paid")).toBe("paid");
    expect(normalizeCampaignIntakeStatus("in_fulfillment")).toBe("in_fulfillment");
    expect(normalizeCampaignIntakeStatus("archived")).toBe("draft");
  });

  it("builds the Case44 fallback draft from the active pilot campaign", () => {
    const draft = getFallbackCampaignIntakeDraft("case44");

    expect(draft.bandSlug).toBe("case44");
    expect(draft.artistName).toBe("Case44");
    expect(draft.releaseTitle).toBe("Long Way Home");
    expect(draft.releaseDate).toBe("2026-06-14");
    expect(draft.status).toBe("draft");
    expect(draft.publicPublishingStatus).toContain("not published");
  });

  it("validates the editable release, platform, show, package, and note fields", () => {
    const formData = new FormData();
    formData.set("releaseTitle", "South Broadway Lights");
    formData.set("releaseDate", "2026-08-21");
    formData.set("artworkUrl", "/images/case44/cover.png");
    formData.set("spotifyUrl", "https://open.spotify.com/artist/case44");
    formData.set("appleMusicUrl", "https://music.apple.com/us/artist/case44");
    formData.set("youtubeUrl", "https://youtube.com/@case44");
    formData.set("socialUrl", "https://instagram.com/case44");
    formData.set("localTieIns", "Release party at Moonshine Blues Bar");
    formData.set("packageIntent", "Full release campaign");
    formData.set("notes", "Need review before public SmartLink changes.");
    formData.set("intent", "submit");

    const parsed = parseCampaignIntakeForm(formData);

    expect(parsed.ok).toBe(true);
    expect(parsed.value?.status).toBe("submitted");
    expect(parsed.value?.releaseTitle).toBe("South Broadway Lights");
    expect(parsed.value?.platformLinks.map((link) => link.platform)).toEqual([
      "Spotify",
      "Apple Music",
      "YouTube",
      "Social",
    ]);
  });

  it("rejects missing required campaign intake fields before persistence", () => {
    const parsed = parseCampaignIntakeForm(new FormData());

    expect(parsed.ok).toBe(false);
    expect(parsed.errors).toContain("Release title is required.");
    expect(parsed.errors).toContain("Release date is required.");
    expect(parsed.errors).toContain("Package intent is required.");
  });
});
