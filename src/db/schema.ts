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

export const bandReleases = pgTable("band_releases", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistProfileId: uuid("artist_profile_id").references(
    () => artistProfilesTable.id,
  ),
  title: text("title").notNull(),
  releaseType: text("release_type").notNull(),
  primaryTrackTitle: text("primary_track_title").notNull(),
  releaseDate: timestamp("release_date", { withTimezone: true }),
  smartLinkUrl: text("smart_link_url"),
  artworkUrl: text("artwork_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const artistAccountLinks = pgTable("artist_account_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  artistProfileId: uuid("artist_profile_id").references(
    () => artistProfilesTable.id,
  ),
  platform: text("platform").notNull(),
  category: text("category").notNull(),
  url: text("url"),
  status: text("status").notNull(),
  setupMode: text("setup_mode").notNull(),
  setupUrl: text("setup_url").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
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
  releaseId: uuid("release_id").references(() => bandReleases.id),
  title: text("title").notNull(),
  campaignType: text("campaign_type").notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  budgetCents: integer("budget_cents"),
  channels: jsonb("channels").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const stripeCustomers = pgTable("stripe_customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const stripeSubscriptions = pgTable("stripe_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  planId: text("plan_id").notNull(),
  billingInterval: text("billing_interval").notNull(),
  status: text("status").notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const promotionCarts = pgTable("promotion_carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  bandSlug: text("band_slug").notNull(),
  campaignId: text("campaign_id"),
  status: text("status").notNull().default("open"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  amountTotalCents: integer("amount_total_cents"),
  currency: text("currency").notNull().default("usd"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const promotionCartItems = pgTable("promotion_cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => promotionCarts.id),
  promotionProductId: text("promotion_product_id").notNull(),
  promotionCampaignId: text("promotion_campaign_id"),
  promotionPackage: text("promotion_package").notNull(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitAmountCents: integer("unit_amount_cents").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const stripeCheckoutSessions = pgTable("stripe_checkout_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  kind: text("kind").notNull(),
  clerkUserId: text("clerk_user_id").notNull(),
  planId: text("plan_id"),
  billingInterval: text("billing_interval"),
  promotionProductId: text("promotion_product_id"),
  promotionPackage: text("promotion_package"),
  promotionCampaignId: uuid("promotion_campaign_id").references(
    () => promotionCampaigns.id,
  ),
  promotionCartId: uuid("promotion_cart_id").references(() => promotionCarts.id),
  amountTotalCents: integer("amount_total_cents"),
  currency: text("currency"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const promotionPayments = pgTable("promotion_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  promotionCampaignId: uuid("promotion_campaign_id").references(
    () => promotionCampaigns.id,
  ),
  promotionProductId: text("promotion_product_id").notNull(),
  promotionPackage: text("promotion_package").notNull(),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull().unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const promotionOrderItems = pgTable("promotion_order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  promotionCartId: uuid("promotion_cart_id").references(() => promotionCarts.id),
  stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull(),
  promotionProductId: text("promotion_product_id").notNull(),
  promotionCampaignId: text("promotion_campaign_id"),
  promotionPackage: text("promotion_package").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitAmountCents: integer("unit_amount_cents").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
