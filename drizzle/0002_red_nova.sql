CREATE TABLE "promotion_cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cart_id" uuid NOT NULL,
	"promotion_product_id" text NOT NULL,
	"promotion_campaign_id" text,
	"promotion_package" text NOT NULL,
	"description" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_amount_cents" integer NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotion_carts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"band_slug" text NOT NULL,
	"campaign_id" text,
	"status" text DEFAULT 'open' NOT NULL,
	"stripe_checkout_session_id" text,
	"amount_total_cents" integer,
	"currency" text DEFAULT 'usd' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotion_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_user_id" text NOT NULL,
	"promotion_cart_id" uuid,
	"stripe_checkout_session_id" text NOT NULL,
	"promotion_product_id" text NOT NULL,
	"promotion_campaign_id" text,
	"promotion_package" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_amount_cents" integer NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "stripe_checkout_sessions" ADD COLUMN "promotion_cart_id" uuid;--> statement-breakpoint
ALTER TABLE "promotion_cart_items" ADD CONSTRAINT "promotion_cart_items_cart_id_promotion_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."promotion_carts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_order_items" ADD CONSTRAINT "promotion_order_items_promotion_cart_id_promotion_carts_id_fk" FOREIGN KEY ("promotion_cart_id") REFERENCES "public"."promotion_carts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stripe_checkout_sessions" ADD CONSTRAINT "stripe_checkout_sessions_promotion_cart_id_promotion_carts_id_fk" FOREIGN KEY ("promotion_cart_id") REFERENCES "public"."promotion_carts"("id") ON DELETE no action ON UPDATE no action;