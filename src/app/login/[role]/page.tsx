import { notFound } from "next/navigation";
import { ArrowRight, LogIn } from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { authPortals } from "@/lib/content";
import { isKnownRole, userRoles } from "@/lib/roles";

export function generateStaticParams() {
  return userRoles.map((role) => ({ role: role.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const portal = authPortals.find((item) => item.role === role);
  return {
    title: portal?.title ?? "Login",
    description: portal?.proofPoints.join(", "),
  };
}

export default async function RoleLoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;

  if (!isKnownRole(role)) {
    notFound();
  }

  const portal = authPortals.find((item) => item.role === role);
  const roleConfig = userRoles.find((item) => item.id === role);

  if (!portal || !roleConfig) {
    notFound();
  }

  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="stage-visual min-h-[420px] rounded-lg border border-[var(--line)]" />
        <div>
          <Eyebrow>{roleConfig.label}</Eyebrow>
          <h1 className="mt-4 text-5xl font-black">{portal.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{roleConfig.headline}</p>
          <div className="mt-8 rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-5">
            <h2 className="text-xl font-black">Launch account tools</h2>
            <ul className="mt-4 space-y-3 text-[var(--muted)]">
              {portal.proofPoints.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <ArrowRight className="size-4 text-[var(--brass-light)]" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/sign-up?role=${role}`}>
              <LogIn className="size-4" aria-hidden />
              Create account
            </ButtonLink>
            <ButtonLink href={`/sign-in?role=${role}`} variant="secondary">
              Sign in
            </ButtonLink>
            <ButtonLink href={roleConfig.dashboardHref} variant="ghost">
              Preview dashboard
            </ButtonLink>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
