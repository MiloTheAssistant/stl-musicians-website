"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  addCampaignFulfillmentNote,
  getFulfillmentTaskForCampaign,
  normalizeFulfillmentTaskStatus,
  saveCampaignFulfillmentTaskStatus,
} from "@/lib/promotion-fulfillment";
import { isAdministratorEmail, getPrimaryEmail } from "@/lib/dashboard-access";
import { getSongPromotionWorkspaceForBand } from "@/lib/song-promotion";

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

async function requireAdminFulfillmentContext(formData: FormData) {
  let authorClerkUserId: string | null = null;

  if (hasClerkEnv) {
    const user = await currentUser();

    if (!user || !isAdministratorEmail(getPrimaryEmail(user))) {
      notFound();
    }

    authorClerkUserId = user.id;
  }

  const campaignId = String(formData.get("promotionCampaignId") ?? "");
  const taskId = String(formData.get("fulfillmentTaskId") ?? "");
  const workspace = getSongPromotionWorkspaceForBand("case44");
  const campaign = workspace?.activeCampaign;
  const task = campaign
    ? getFulfillmentTaskForCampaign(campaignId, taskId)
    : undefined;

  if (!workspace || !campaign || campaign.id !== campaignId || !task) {
    notFound();
  }

  return { campaign, task, authorClerkUserId };
}

export async function updatePromotionFulfillmentTaskStatus(formData: FormData) {
  const { campaign, task } = await requireAdminFulfillmentContext(formData);
  const status = normalizeFulfillmentTaskStatus(formData.get("status"));

  await saveCampaignFulfillmentTaskStatus({ campaign, task, status });
  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin?ops=status-updated");
}

export async function addPromotionFulfillmentNote(formData: FormData) {
  const { campaign, task, authorClerkUserId } =
    await requireAdminFulfillmentContext(formData);
  const note = String(formData.get("note") ?? "").trim();

  if (!note) {
    redirect("/dashboard/admin?ops=note-empty");
  }

  await addCampaignFulfillmentNote({
    campaign,
    task,
    note,
    authorClerkUserId,
  });
  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin?ops=note-added");
}
