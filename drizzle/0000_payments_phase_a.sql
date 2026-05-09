CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'requested', 'approved', 'paid', 'scheduled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('musician', 'promoter', 'member', 'admin');--> statement-breakpoint
CREATE TABLE "artist_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"genre" text NOT NULL,
	"home_base" text NOT NULL,
	"bio" text NOT NULL,
	"booking_focus" text NOT NULL,
	"media_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "artist_profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"venue_id" uuid,
	"artist_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"ticket_url" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "promotion_campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_profile_id" uuid,
	"title" text NOT NULL,
	"campaign_type" text NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"budget_cents" integer,
	"channels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotion_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"promotion_campaign_id" uuid,
	"promotion_product_id" text NOT NULL,
	"promotion_package" text NOT NULL,
	"stripe_checkout_session_id" text NOT NULL,
	"stripe_payment_intent_id" text,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "promotion_payments_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_checkout_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stripe_session_id" text NOT NULL,
	"kind" text NOT NULL,
	"clerk_user_id" text NOT NULL,
	"plan_id" text,
	"billing_interval" text,
	"promotion_product_id" text,
	"promotion_package" text,
	"promotion_campaign_id" uuid,
	"amount_total_cents" integer,
	"currency" text,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stripe_checkout_sessions_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"stripe_customer_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stripe_customers_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "stripe_customers_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);
--> statement-breakpoint
CREATE TABLE "stripe_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"stripe_subscription_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"billing_interval" text NOT NULL,
	"status" text NOT NULL,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "stripe_subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"role" "user_role" NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"neighborhood" text NOT NULL,
	"capacity" integer,
	"room_type" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artist_profiles" ADD CONSTRAINT "artist_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD CONSTRAINT "promotion_campaigns_artist_profile_id_artist_profiles_id_fk" FOREIGN KEY ("artist_profile_id") REFERENCES "public"."artist_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_payments" ADD CONSTRAINT "promotion_payments_promotion_campaign_id_promotion_campaigns_id_fk" FOREIGN KEY ("promotion_campaign_id") REFERENCES "public"."promotion_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_checkout_sessions" ADD CONSTRAINT "stripe_checkout_sessions_promotion_campaign_id_promotion_campaigns_id_fk" FOREIGN KEY ("promotion_campaign_id") REFERENCES "public"."promotion_campaigns"("id") ON DELETE no action ON UPDATE no action;