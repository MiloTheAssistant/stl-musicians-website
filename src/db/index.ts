import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to initialize the database");
  }

  if (!db) {
    db = drizzle(neon(process.env.DATABASE_URL));
  }

  return db;
}
