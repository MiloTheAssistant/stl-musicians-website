CREATE TABLE "promotion_campaign_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promotion_campaign_id" uuid,
	"title" text NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"owner" text DEFAULT 'stl-musicians' NOT NULL,
	"due_at" timestamp with time zone,
	"package_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"guardrail" text,
	"requires_official_access" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotion_click_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"release_landing_page_id" uuid,
	"release_slug" text NOT NULL,
	"platform_id" text NOT NULL,
	"source" text,
	"referrer" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotion_fan_leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"release_landing_page_id" uuid,
	"release_slug" text NOT NULL,
	"email" text NOT NULL,
	"source" text,
	"consent" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "promotion_fulfillment_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promotion_campaign_id" uuid,
	"promotion_campaign_task_id" uuid,
	"author_clerk_user_id" text,
	"note" text NOT NULL,
	"proof_url" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "release_landing_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promotion_campaign_id" uuid,
	"release_id" uuid,
	"slug" text NOT NULL,
	"headline" text NOT NULL,
	"summary" text NOT NULL,
	"artwork_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"fan_capture_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "release_landing_pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "release_platform_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"release_landing_page_id" uuid,
	"platform" text NOT NULL,
	"category" text NOT NULL,
	"url" text NOT NULL,
	"status" text DEFAULT 'live' NOT NULL,
	"cta_label" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "promotion_campaign_tasks" ADD CONSTRAINT "promotion_campaign_tasks_promotion_campaign_id_promotion_campaigns_id_fk" FOREIGN KEY ("promotion_campaign_id") REFERENCES "public"."promotion_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_click_events" ADD CONSTRAINT "promotion_click_events_release_landing_page_id_release_landing_pages_id_fk" FOREIGN KEY ("release_landing_page_id") REFERENCES "public"."release_landing_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_fan_leads" ADD CONSTRAINT "promotion_fan_leads_release_landing_page_id_release_landing_pages_id_fk" FOREIGN KEY ("release_landing_page_id") REFERENCES "public"."release_landing_pages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_fulfillment_notes" ADD CONSTRAINT "promotion_fulfillment_notes_promotion_campaign_id_promotion_campaigns_id_fk" FOREIGN KEY ("promotion_campaign_id") REFERENCES "public"."promotion_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_fulfillment_notes" ADD CONSTRAINT "promotion_fulfillment_notes_promotion_campaign_task_id_promotion_campaign_tasks_id_fk" FOREIGN KEY ("promotion_campaign_task_id") REFERENCES "public"."promotion_campaign_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_landing_pages" ADD CONSTRAINT "release_landing_pages_promotion_campaign_id_promotion_campaigns_id_fk" FOREIGN KEY ("promotion_campaign_id") REFERENCES "public"."promotion_campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_landing_pages" ADD CONSTRAINT "release_landing_pages_release_id_band_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."band_releases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "release_platform_links" ADD CONSTRAINT "release_platform_links_release_landing_page_id_release_landing_pages_id_fk" FOREIGN KEY ("release_landing_page_id") REFERENCES "public"."release_landing_pages"("id") ON DELETE no action ON UPDATE no action;