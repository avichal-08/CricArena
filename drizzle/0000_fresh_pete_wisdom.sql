CREATE TYPE "public"."lobby_mode" AS ENUM('tournament', 'match');--> statement-breakpoint
CREATE TYPE "public"."lobby_role" AS ENUM('admin', 'member');--> statement-breakpoint
CREATE TYPE "public"."lobby_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."lobby_type" AS ENUM('public', 'private');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "lobby" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "lobby_type" DEFAULT 'public' NOT NULL,
	"mode" "lobby_mode" DEFAULT 'tournament' NOT NULL,
	"tournament_id" text NOT NULL,
	"match_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lobby_member" (
	"id" text PRIMARY KEY NOT NULL,
	"lobby_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "lobby_role" DEFAULT 'member' NOT NULL,
	"status" "lobby_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lobby_member_lobby_id_user_id_unique" UNIQUE("lobby_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "match_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"lobby_id" text NOT NULL,
	"match_id" text NOT NULL,
	"team_selection" jsonb NOT NULL,
	"captain_id" text,
	"vice_captain_id" text,
	"points_breakdown" jsonb,
	"pre_predictions" jsonb NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "match_entry_user_id_lobby_id_match_id_unique" UNIQUE("user_id","lobby_id","match_id")
);
--> statement-breakpoint
CREATE TABLE "match" (
	"id" text PRIMARY KEY NOT NULL,
	"tournament_id" text NOT NULL,
	"team_a_id" text NOT NULL,
	"team_b_id" text NOT NULL,
	"scorecard" jsonb,
	"is_abandoned" boolean DEFAULT false NOT NULL,
	"start_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"team_id" text NOT NULL,
	"role" text NOT NULL,
	"playing_style" text
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"logo_url" text
);
--> statement-breakpoint
CREATE TABLE "tournament" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lobby" ADD CONSTRAINT "lobby_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lobby" ADD CONSTRAINT "lobby_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lobby" ADD CONSTRAINT "lobby_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lobby_member" ADD CONSTRAINT "lobby_member_lobby_id_lobby_id_fk" FOREIGN KEY ("lobby_id") REFERENCES "public"."lobby"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lobby_member" ADD CONSTRAINT "lobby_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_entry" ADD CONSTRAINT "match_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_entry" ADD CONSTRAINT "match_entry_lobby_id_lobby_id_fk" FOREIGN KEY ("lobby_id") REFERENCES "public"."lobby"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_entry" ADD CONSTRAINT "match_entry_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_tournament_id_tournament_id_fk" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_team_a_id_team_id_fk" FOREIGN KEY ("team_a_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_team_b_id_team_id_fk" FOREIGN KEY ("team_b_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lobby_type_idx" ON "lobby" USING btree ("type");--> statement-breakpoint
CREATE INDEX "lobby_tournament_idx" ON "lobby" USING btree ("tournament_id");--> statement-breakpoint
CREATE INDEX "lm_user_id_idx" ON "lobby_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "lm_lobby_id_idx" ON "lobby_member" USING btree ("lobby_id");--> statement-breakpoint
CREATE INDEX "leaderboard_idx" ON "match_entry" USING btree ("lobby_id","match_id","score");--> statement-breakpoint
CREATE INDEX "me_match_id_idx" ON "match_entry" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "start_time_idx" ON "match" USING btree ("start_time");--> statement-breakpoint
CREATE INDEX "player_team_id_idx" ON "player" USING btree ("team_id");