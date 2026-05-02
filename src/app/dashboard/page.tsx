import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { authPortals } from "@/lib/content";
import { getDashboardLandingForUser } from "@/lib/dashboard-access";
import { userRoles } from "@/lib/roles";

export const metadata = {
  title: "Dashboard Access",
};

const hasClerkEnv =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

export default async function DashboardIndexPage() {
  if (hasClerkEnv) {
    const dashboardLanding = getDashboardLandingForUser(await currentUser());

    if (dashboardLanding) {
      redirect(dashboardLanding);
    }
  }

  return (
    <SectionShell>
      <Eyebrow>Dashboard Access</Eyebrow>
      <div className="max-w-3xl">
        <h1 className="mt-3 text-5xl font-black">Choose how you want to use STL-Musicians.com.</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
          Each access type opens a focused workspace for the way you participate in
          the St. Louis music scene. Sign in if you already have an account, or
          join to start the Clerk account flow for that role.
        </p>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {userRoles.map((role) => {
          const portal = authPortals.find((item) => item.role === role.id);

          return (
          <article
            key={role.id}
            className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6"
          >
            <h2 className="text-2xl font-black">{role.label}</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{role.description}</p>
            <ul className="mt-5 space-y-2 text-sm text-[var(--brass-light)]">
              {portal?.proofPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="mt-auto flex flex-col gap-3 pt-6">
              <ButtonLink href={`/sign-in?role=${role.id}`} variant="secondary">
                Login
              </ButtonLink>
              <ButtonLink href={`/sign-up?role=${role.id}`}>Join</ButtonLink>
            </div>
          </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
