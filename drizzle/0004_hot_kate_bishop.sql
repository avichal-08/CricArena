ALTER TABLE "match" ADD COLUMN "venue" text;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "toss" text;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "lineups" jsonb;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "win_probability" jsonb;