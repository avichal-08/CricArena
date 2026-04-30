import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://cricarena-sage.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/","/how-it-works"],
      disallow: ["/home/","/lobby/","/matches/","/global-leaderboard/","/admin/","/profile/", "/api/"], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}