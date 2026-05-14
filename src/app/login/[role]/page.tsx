import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, LogIn } from "lucide-react";
import { ButtonLink, Eyebrow, SectionShell } from "@/components/ui";
import { authPortals } from "@/lib/content";
import { isKnownRole, userRoles, type UserRoleId } from "@/lib/roles";

const loginHeroVisuals: Record<
  UserRoleId,
  {
    src: string;
    alt: string;
    kicker: string;
    caption: string;
  }
> = {
  musician: {
    src: "/images/hero-ai-03.png",
    alt: "Backstage guitars, laptop, and stage lights for a working musician command center",
    kicker: "Release command",
    caption: "Manage songs, shows, assets, and launch packages from one stage-ready workspace.",
  },
  promoter: {
    src: "/images/hero-ai-01.png",
    alt: "Packed concert crowd under bright venue lights for promoter discovery",
    kicker: "Room energy",
    caption: "Find serious artists, shape stronger bills, and coordinate audience demand.",
  },
  member: {
    src: "/images/hero-ai-02.png",
    alt: "Warm local music room with a band performing for a small venue audience",
    kicker: "Local booking",
    caption: "Plan private events, small-room bookings, and direct artist conversations.",
  },
  admin: {
    src: "/images/hero-ai-04.png",
    alt: "Outdoor concert with a city skyline and stage lights for platform administration",
    kicker: "Scene ops",
    caption: "Curate profiles, events, trust signals, and promotion fulfillment with context.",
  },
};

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

  const visual = loginHeroVisuals[role];

  return (
    <SectionShell>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative min-h-[420px] overflow-hidden rounded-md border border-[var(--line)] bg-[var(--ink)] shadow-2xl">
          <Image
            src={visual.src}
            alt={visual.alt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,7,0.04)_0%,rgba(9,9,7,0.32)_48%,rgba(9,9,7,0.9)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,7,0.18)_0%,rgba(9,9,7,0)_48%,rgba(9,9,7,0.35)_100%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--brass-light)]">
              {visual.kicker}
            </p>
            <p className="mt-3 max-w-md text-lg font-bold leading-7 text-[var(--foreground)]">
              {visual.caption}
            </p>
          </div>
        </div>
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
