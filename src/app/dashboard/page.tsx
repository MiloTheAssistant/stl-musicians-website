import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { dashboardRoutes } from "@/lib/roles";

export const metadata = {
  title: "Dashboards",
};

export default function DashboardIndexPage() {
  return (
    <SectionShell>
      <Eyebrow>Role Dashboards</Eyebrow>
      <h1 className="mt-3 text-5xl font-black">Choose a launch workspace.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {dashboardRoutes.map((route) => (
          <article key={route.href} className="rounded-lg border border-[var(--line)] bg-[rgba(245,234,210,0.06)] p-6">
            <h2 className="text-2xl font-black">{route.label}</h2>
            <p className="mt-3 text-sm text-[var(--muted)]">
              Preview the operational dashboard for this account type.
            </p>
            <ButtonLink href={route.href} className="mt-5">Open dashboard</ButtonLink>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
