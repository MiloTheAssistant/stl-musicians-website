CREATE TABLE "artist_account_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_profile_id" uuid,
	"platform" text NOT NULL,
	"category" text NOT NULL,
	"url" text,
	"status" text NOT NULL,
	"setup_mode" text NOT NULL,
	"setup_url" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "band_releases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artist_profile_id" uuid,
	"title" text NOT NULL,
	"release_type" text NOT NULL,
	"primary_track_title" text NOT NULL,
	"release_date" timestamp with time zone,
	"smart_link_url" text,
	"artwork_url" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD COLUMN "release_id" uuid;--> statement-breakpoint
ALTER TABLE "artist_account_links" ADD CONSTRAINT "artist_account_links_artist_profile_id_artist_profiles_id_fk" FOREIGN KEY ("artist_profile_id") REFERENCES "public"."artist_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "band_releases" ADD CONSTRAINT "band_releases_artist_profile_id_artist_profiles_id_fk" FOREIGN KEY ("artist_profile_id") REFERENCES "public"."artist_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_campaigns" ADD CONSTRAINT "promotion_campaigns_release_id_band_releases_id_fk" FOREIGN KEY ("release_id") REFERENCES "public"."band_releases"("id") ON DELETE no action ON UPDATE no action;