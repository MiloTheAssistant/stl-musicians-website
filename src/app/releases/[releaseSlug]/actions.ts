"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { hasDatabaseUrl } from "@/db/env";
import { promotionFanLeads } from "@/db/schema";
import {
  getReleaseSmartLinkPath,
  getSmartLinkReleaseBySlug,
} from "@/lib/song-promotion";
import { normalizeFanLeadInput } from "@/lib/song-promotion-analytics";

export async function captureReleaseFanLead(formData: FormData) {
  const releaseSlug = String(formData.get("releaseSlug") ?? "");
  const email = String(formData.get("email") ?? "");
  const source = String(formData.get("source") ?? "smartlink");
  const release = getSmartLinkReleaseBySlug(releaseSlug);

  if (!release) {
    redirect("/");
  }

  let status = "received";

  try {
    const lead = normalizeFanLeadInput({ releaseSlug, email, source });

    if (hasDatabaseUrl()) {
      await getDb().insert(promotionFanLeads).values({
        releaseSlug: lead.releaseSlug,
        email: lead.email,
        source: lead.source,
      });
    }
  } catch {
    status = "invalid";
  }

  const path = getReleaseSmartLinkPath(release);
  revalidatePath(path);
  redirect(`${path}?lead=${status}`);
}
