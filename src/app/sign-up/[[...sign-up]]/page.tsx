import { SignUp } from "@clerk/nextjs";
import { Eyebrow, SectionShell } from "@/components/ui";
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
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const params = await searchParams;
  const role = getRoleParam(params?.role);
  const dashboardHref = isKnownRole(role) ? getDashboardForRole(role) : "/dashboard";
  const signInUrl = isKnownRole(role) ? `/sign-in?role=${role}` : "/sign-in";

  return (
    <SectionShell className="flex min-h-[70svh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
        <Eyebrow>Join STL-Musicians.com</Eyebrow>
        {hasClerk ? (
          <div className="mt-5">
            <SignUp
              fallbackRedirectUrl={dashboardHref}
              forceRedirectUrl={dashboardHref}
              signInUrl={signInUrl}
            />
          </div>
        ) : (
          <div className="mt-5">
            <h1 className="text-3xl font-black">Account creation is wired for Clerk.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Once Clerk env vars are provisioned through Vercel, this page
              becomes the live sign-up flow for all launch roles.
            </p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
