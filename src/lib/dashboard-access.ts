import type { UserRoleId } from "./roles";

type ClerkEmailAddress = {
  emailAddress?: string | null;
};

export type DashboardAccessUser = {
  primaryEmailAddress?: ClerkEmailAddress | null;
  emailAddresses?: ClerkEmailAddress[] | null;
};

const defaultAdminEmails = ["milotheassistant@gmail.com"];

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

export function getDashboardLandingForUser(user: DashboardAccessUser | null | undefined) {
  return isAdministratorEmail(getPrimaryEmail(user)) ? "/dashboard/admin" : null;
}

export function canAccessDashboardRole(
  role: UserRoleId,
  email: string | null | undefined,
) {
  return role !== "admin" || isAdministratorEmail(email);
}
