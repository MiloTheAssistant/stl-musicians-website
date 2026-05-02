import { SignIn } from "@clerk/nextjs";
import { Eyebrow, SectionShell } from "@/components/ui";
import { getDashboardForRole, isKnownRole } from "@/lib/roles";

export const metadata = {
  title: "Sign In",
};

type SearchParams = Promise<{
  role?: string | string[];
}>;

function getRoleParam(role: string | string[] | undefined) {
  return Array.isArray(role) ? role[0] : role;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: SearchParams;
} = {}) {
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const params = await searchParams;
  const role = getRoleParam(params?.role);
  const dashboardHref = isKnownRole(role) ? getDashboardForRole(role) : "/dashboard";
  const signUpUrl = isKnownRole(role) ? `/sign-up?role=${role}` : "/sign-up";

  return (
    <SectionShell className="flex min-h-[70svh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
        <Eyebrow>Account Access</Eyebrow>
        {hasClerk ? (
          <div className="mt-5">
            <SignIn
              fallbackRedirectUrl={dashboardHref}
              forceRedirectUrl={dashboardHref}
              signUpUrl={signUpUrl}
            />
          </div>
        ) : (
          <div className="mt-5">
            <h1 className="text-3xl font-black">Clerk is ready to connect.</h1>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in
              Vercel and local env files to activate hosted sign-in.
            </p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}
