import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "musician",
  "promoter",
  "member",
  "admin",
]);

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "requested",
  "approved",
  "paid",
  "scheduled",
  "completed",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  role: userRoleEnum("role").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const artistProfilesTable = pgTable("artist_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  genre: text("genre").notNull(),
  homeBase: text("home_base").notNull(),
  bio: text("bio").notNull(),
  bookingFocus: text("booking_focus").notNull(),
  mediaLinks: jsonb("media_links").$type<string[]>().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const venuesTable = pgTable("venues", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  neighborhood: text("neighborhood").notNull(),
  capacity: integer("capacity"),
  roomType: text("room_type").notNull(),
});

export const eventsTable = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  venueId: uuid("venue_id").references(() => venuesTable.id),
  artistIds: jsonb("artist_ids").$type<string[]>().notNull().default([]),
  ticketUrl: text("ticket_url"),
  description: text("description"),
});

export const promotionCampaigns = pgTable("promotion_campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistProfileId: uuid("artist_profile_id").references(
    () => artistProfilesTable.id,
  ),
  title: text("title").notNull(),
  campaignType: text("campaign_type").notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  budgetCents: integer("budget_cents"),
  channels: jsonb("channels").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
