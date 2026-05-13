const neonDatabaseUrlEnvKeys = [
  "DATABASE_URL",
  "Command_Center_DATABASE_URL",
] as const;

export function getDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
) {
  return neonDatabaseUrlEnvKeys
    .map((key) => env[key])
    .find((value): value is string => Boolean(value?.trim()));
}

export function hasDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
) {
  return Boolean(getDatabaseUrl(env));
}

export function requireDatabaseUrl(
  env: Record<string, string | undefined> = process.env,
) {
  const databaseUrl = getDatabaseUrl(env);

  if (!databaseUrl) {
    throw new Error("DATABASE_URL or Command_Center_DATABASE_URL is required");
  }

  return databaseUrl;
}
