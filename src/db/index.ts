import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { requireDatabaseUrl } from "./env";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!db) {
    db = drizzle(neon(requireDatabaseUrl()));
  }

  return db;
}
