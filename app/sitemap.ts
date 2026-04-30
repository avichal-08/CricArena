import type { MetadataRoute } from "next";
import { db } from "@repo/db"; 
import { lobbies, matches } from "@repo/db/schema";
import { eq, and, gte } from "drizzle-orm";

export const revalidate = 3600;

const SEO_PAGES = [
  "best-fantasy-cricket-app",
  "ipl-college-leaderboard",
  "dream11-alternative-for-college",
  "free-private-cricket-lobbies",
  "realtime-ipl-scoring-app"
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://cricarena-sage.vercel.app";

  const publicLobbies = await db
    .select({ id: lobbies.id, createdAt: lobbies.createdAt })
    .from(lobbies)
    .where(eq(lobbies.type, 'public'));

  
  const now = new Date();
  const upcomingMatches = await db
    .select({ id: matches.id, matchDate: matches.startTime })
    .from(matches)
    .where(gte(matches.startTime, now));

  const lobbyUrls: MetadataRoute.Sitemap = publicLobbies.map((lobby:any) => ({
    url: `${base}/lobby/${lobby.id}`,
    lastModified: lobby.createdAt, 
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const matchUrls: MetadataRoute.Sitemap = upcomingMatches.map((match) => ({
    url: `${base}/matches/${match.id}`, 
    lastModified: new Date(), 
    changeFrequency: "hourly",
    priority: 0.9,
  }));

  const seoUrls: MetadataRoute.Sitemap = SEO_PAGES.map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...seoUrls,
    ...matchUrls,
    ...lobbyUrls,
  ];
}