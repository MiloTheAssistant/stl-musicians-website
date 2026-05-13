import type { UserRoleId } from "./roles";

type ClerkEmailAddress = {
  emailAddress?: string | null;
};

export type MusicianMembershipRole = "admin" | "member";

export type DashboardAccessUser = {
  primaryEmailAddress?: ClerkEmailAddress | null;
  emailAddresses?: ClerkEmailAddress[] | null;
};

const defaultAdminEmails = ["milotheassistant@gmail.com"];
const defaultMusicianMemberships = [
  {
    bandSlug: "case44",
    dashboardHref: "/dashboard/musician",
    adminEmail: "case44@stl-musicians.com",
    memberEmails: ["mtest@stl-musicians.com"],
  },
] as const;

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? "";
}

export function getPrimaryEmail(user: DashboardAccessUser | null | undefined) {
  return (
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.find((email) => email.emailAddress)?.emailAddress ??
    null
  );
}

export function getAdministratorEmails(raw = process.env.STL_MUSICIANS_ADMIN_EMAILS) {
  const configuredEmails =
    raw
      ?.split(",")
      .map(normalizeEmail)
      .filter(Boolean) ?? [];

  return new Set([...defaultAdminEmails, ...configuredEmails].map(normalizeEmail));
}

export function isAdministratorEmail(email: string | null | undefined) {
  return getAdministratorEmails().has(normalizeEmail(email));
}

function getCase44Emails(raw = process.env.CASE44_MUSICIAN_EMAILS) {
  const configuredEmails =
    raw
      ?.split(",")
      .map(normalizeEmail)
      .filter(Boolean) ?? [];

  return new Set(
    [
      defaultMusicianMemberships[0].adminEmail,
      ...defaultMusicianMemberships[0].memberEmails,
      ...configuredEmails,
    ].map(normalizeEmail),
  );
}

export function getMusicianMembershipForEmail(email: string | null | undefined) {
  const normalizedEmail = normalizeEmail(email);
  const case44AdminEmail = normalizeEmail(defaultMusicianMemberships[0].adminEmail);

  if (getCase44Emails().has(normalizedEmail)) {
    return {
      bandSlug: "case44",
      dashboardHref: "/dashboard/musician",
      role:
        normalizedEmail === case44AdminEmail
          ? ("admin" as const)
          : ("member" as const),
    };
  }

  return null;
}

export function getDashboardLandingForUser(user: DashboardAccessUser | null | undefined) {
  const email = getPrimaryEmail(user);

  if (isAdministratorEmail(email)) {
    return "/dashboard/admin";
  }

  return getMusicianMembershipForEmail(email)?.dashboardHref ?? null;
}

export function canAccessDashboardRole(
  role: UserRoleId,
  email: string | null | undefined,
) {
  return role !== "admin" || isAdministratorEmail(email);
}

export function canAccessBandWorkspace(
  bandSlug: string,
  email: string | null | undefined,
) {
  return (
    isAdministratorEmail(email) ||
    getMusicianMembershipForEmail(email)?.bandSlug === bandSlug
  );
}

export function getDashboardViewerAccessSummary(
  role: UserRoleId,
  email: string | null | undefined,
) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return {
      label: "Preview access",
      detail: "Local preview session",
    };
  }

  if (isAdministratorEmail(normalizedEmail)) {
    return {
      label: "Site admin",
      detail: normalizedEmail,
    };
  }

  const membership = getMusicianMembershipForEmail(normalizedEmail);

  if (membership?.bandSlug === "case44") {
    return {
      label: membership.role === "admin" ? "Case44 admin" : "Case44 member",
      detail: normalizedEmail,
    };
  }

  return {
    label: `${role[0]?.toUpperCase()}${role.slice(1)} access`,
    detail: normalizedEmail,
  };
}
