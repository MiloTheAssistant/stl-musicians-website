"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  canAccessBandWorkspace,
  getPrimaryEmail,
} from "@/lib/dashboard-access";
import {
  parseCampaignIntakeForm,
  saveCampaignIntake,
} from "@/lib/campaign-intake";

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

async function requireCase44CampaignAccess() {
  if (!hasClerkEnv) {
    return;
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/dashboard/musician");
  }

  if (!canAccessBandWorkspace("case44", getPrimaryEmail(user))) {
    notFound();
  }
}

export async function saveCampaignIntakeAction(formData: FormData) {
  await requireCase44CampaignAccess();

  const parsed = parseCampaignIntakeForm(formData);

  if (!parsed.ok) {
    redirect(
      `/dashboard/musician?campaign=invalid&reason=${encodeURIComponent(
        parsed.errors[0] ?? "invalid",
      )}#campaign-intake`,
    );
  }

  await saveCampaignIntake(parsed.value);
  revalidatePath("/dashboard/musician");
  revalidatePath("/dashboard/musician/songs");
  redirect(
    `/dashboard/musician?campaign=${parsed.value.status === "submitted" ? "submitted" : "saved"}#campaign-intake`,
  );
}
