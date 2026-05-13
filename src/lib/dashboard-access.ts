import type { UserRoleId } from "./roles";

type ClerkEmailAddress = {
  emailAddress?: string | null;
};

export type DashboardAccessUser = {
  primaryEmailAddress?: ClerkEmailAddress | null;
  emailAddresses?: ClerkEmailAddress[] | null;
};

const defaultAdminEmails = ["milotheassistant@gmail.com"];
const defaultMusicianMemberships = [
  {
    bandSlug: "case44",
    dashboardHref: "/dashboard/musician",
    emails: ["case44@stl-musicians.com", "mtest@stl-musicians.com"],
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
    [...defaultMusicianMemberships[0].emails, ...configuredEmails].map(
      normalizeEmail,
    ),
  );
}

export function getMusicianMembershipForEmail(email: string | null | undefined) {
  const normalizedEmail = normalizeEmail(email);

  if (getCase44Emails().has(normalizedEmail)) {
    return {
      bandSlug: "case44",
      dashboardHref: "/dashboard/musician",
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
