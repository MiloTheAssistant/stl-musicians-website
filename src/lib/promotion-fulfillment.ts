import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { hasDatabaseUrl } from "@/db/env";
import {
  promotionCampaigns,
  promotionCampaignTasks,
  promotionFulfillmentNotes,
} from "@/db/schema";
import {
  getCampaignFulfillmentTasks,
  type CampaignFulfillmentTask,
  type SongPromotionCampaign,
} from "./song-promotion";

export const promotionFulfillmentTaskStatuses = [
  "todo",
  "in-progress",
  "blocked",
  "done",
] as const satisfies CampaignFulfillmentTask["status"][];

export type PromotionFulfillmentTaskStatus =
  (typeof promotionFulfillmentTaskStatuses)[number];

export function normalizeFulfillmentTaskStatus(
  value: FormDataEntryValue | string | null,
): PromotionFulfillmentTaskStatus {
  if (
    typeof value === "string" &&
    promotionFulfillmentTaskStatuses.includes(
      value as PromotionFulfillmentTaskStatus,
    )
  ) {
    return value as PromotionFulfillmentTaskStatus;
  }

  throw new Error("A valid fulfillment status is required");
}

export function getFulfillmentTaskForCampaign(
  campaignId: string,
  taskId: string,
) {
  return getCampaignFulfillmentTasks(campaignId).find((task) => task.id === taskId);
}

export function getFulfillmentTasksForPaidProducts(
  campaignId: string,
  productIds: string[],
) {
  const paidProductIds = new Set(productIds.filter(Boolean));

  return getCampaignFulfillmentTasks(campaignId).filter((task) =>
    task.packageIds.some((packageId) => paidProductIds.has(packageId)),
  );
}

function hasDatabase() {
  return hasDatabaseUrl();
}

async function ensureCampaignRecord(
  campaign: SongPromotionCampaign,
  status: SongPromotionCampaign["status"] = campaign.status,
) {
  await getDb()
    .insert(promotionCampaigns)
    .values({
      id: campaign.id,
      title: campaign.title,
      campaignType: campaign.promotionCampaignType,
      status,
      budgetCents: campaign.budgetCents,
      channels: campaign.channels,
    })
    .onConflictDoUpdate({
      target: promotionCampaigns.id,
      set: {
        title: campaign.title,
        campaignType: campaign.promotionCampaignType,
        status,
        budgetCents: campaign.budgetCents,
        channels: campaign.channels,
      },
    });
}

export async function activateFulfillmentForPaidProducts({
  campaign,
  productIds,
}: {
  campaign: SongPromotionCampaign;
  productIds: string[];
}) {
  if (!hasDatabase()) {
    return [];
  }

  const tasks = getFulfillmentTasksForPaidProducts(campaign.id, productIds);

  await ensureCampaignRecord(campaign, "paid");

  const records = [];

  for (const task of tasks) {
    records.push(
      await saveCampaignFulfillmentTaskStatus({
        campaign: { ...campaign, status: "paid" },
        task,
        status: task.status,
      }),
    );
  }

  return records;
}

export async function getCampaignFulfillmentTasksWithOverrides(
  campaignId: string,
) {
  const tasks = getCampaignFulfillmentTasks(campaignId);

  if (!hasDatabase()) {
    return tasks;
  }

  const records = await getDb()
    .select()
    .from(promotionCampaignTasks)
    .where(eq(promotionCampaignTasks.promotionCampaignId, campaignId));

  return tasks.map((task) => {
    const record = records.find((item) => item.title === task.title);

    return record
      ? {
          ...task,
          status: normalizeFulfillmentTaskStatus(record.status),
        }
      : task;
  });
}

export async function saveCampaignFulfillmentTaskStatus({
  campaign,
  task,
  status,
}: {
  campaign: SongPromotionCampaign;
  task: CampaignFulfillmentTask;
  status: PromotionFulfillmentTaskStatus;
}) {
  if (!hasDatabase()) {
    return null;
  }

  await ensureCampaignRecord(campaign);

  const [existingTask] = await getDb()
    .select()
    .from(promotionCampaignTasks)
    .where(
      and(
        eq(promotionCampaignTasks.promotionCampaignId, campaign.id),
        eq(promotionCampaignTasks.title, task.title),
      ),
    )
    .limit(1);

  if (existingTask) {
    const [updatedTask] = await getDb()
      .update(promotionCampaignTasks)
      .set({
        status,
        owner: task.owner,
        dueAt: new Date(`${task.dueDate}T00:00:00Z`),
        packageIds: task.packageIds,
        guardrail: task.guardrail,
        requiresOfficialAccess: task.requiresOfficialAccess,
        updatedAt: new Date(),
      })
      .where(eq(promotionCampaignTasks.id, existingTask.id))
      .returning();

    return updatedTask;
  }

  const [createdTask] = await getDb()
    .insert(promotionCampaignTasks)
    .values({
      promotionCampaignId: campaign.id,
      title: task.title,
      status,
      owner: task.owner,
      dueAt: new Date(`${task.dueDate}T00:00:00Z`),
      packageIds: task.packageIds,
      guardrail: task.guardrail,
      requiresOfficialAccess: task.requiresOfficialAccess,
    })
    .returning();

  return createdTask;
}

export async function addCampaignFulfillmentNote({
  campaign,
  task,
  note,
  authorClerkUserId,
}: {
  campaign: SongPromotionCampaign;
  task: CampaignFulfillmentTask;
  note: string;
  authorClerkUserId: string | null;
}) {
  if (!hasDatabase()) {
    return null;
  }

  await ensureCampaignRecord(campaign);
  const taskRecord = await saveCampaignFulfillmentTaskStatus({
    campaign,
    task,
    status: task.status,
  });

  const [createdNote] = await getDb()
    .insert(promotionFulfillmentNotes)
    .values({
      promotionCampaignId: campaign.id,
      promotionCampaignTaskId: taskRecord?.id ?? null,
      authorClerkUserId,
      note,
    })
    .returning();

  return createdNote;
}
