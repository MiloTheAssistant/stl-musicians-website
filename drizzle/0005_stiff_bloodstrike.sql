ALTER TYPE "public"."campaign_status" ADD VALUE 'submitted' BEFORE 'requested';--> statement-breakpoint
ALTER TYPE "public"."campaign_status" ADD VALUE 'needs_review' BEFORE 'requested';--> statement-breakpoint
ALTER TYPE "public"."campaign_status" ADD VALUE 'in_fulfillment' BEFORE 'scheduled';--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD COLUMN "package_intent" text;--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD COLUMN "local_tie_ins" text;--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD COLUMN "artist_notes" text;--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();