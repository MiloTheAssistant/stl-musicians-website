import { SignUp } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Eyebrow, SectionShell } from "@/components/ui";
import {
  getDashboardLandingForUser,
  getPrimaryEmail,
} from "@/lib/dashboard-access";
import { getDashboardForRole, isKnownRole } from "@/lib/roles";

export const metadata = {
  title: "Sign Up",
};

type SearchParams = Promise<{
  role?: string | string[];
}>;

function getRoleParam(role: string | string[] | undefined) {
  return Array.isArray(role) ? role[0] : role;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: SearchParams;
} = {}) {
  const hasClerk =
    Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    Boolean(process.env.CLERK_SECRET_KEY);
  const params = await searchParams;
  const role = getRoleParam(params?.role);
  const dashboardHref = isKnownRole(role) ? getDashboardForRole(role) : "/dashboard";
  const signInUrl = isKnownRole(role) ? `/sign-in?role=${role}` : "/sign-in";

  if (!hasClerk) {
    redirect(dashboardHref);
  }

  let signedInDashboardHref: string | null = null;

  try {
    const user = await currentUser();
    signedInDashboardHref = getDashboardLandingForUser(user);

    if (!signedInDashboardHref && getPrimaryEmail(user)) {
      signedInDashboardHref = dashboardHref;
    }
  } catch {
    signedInDashboardHref = null;
  }

  if (signedInDashboardHref) {
    redirect(signedInDashboardHref);
  }

  return (
    <SectionShell className="flex min-h-[70svh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
        <Eyebrow>Join STL-Musicians.com</Eyebrow>
        <div className="mt-5">
          <SignUp
            fallbackRedirectUrl={dashboardHref}
            forceRedirectUrl={dashboardHref}
            signInUrl={signInUrl}
          />
        </div>
      </div>
    </SectionShell>
  );
}
