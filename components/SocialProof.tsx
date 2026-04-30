import { db } from "@repo/db";
import { users, lobbies, matchEntries, reviews } from "@repo/db/schema";
import { count, avg } from "drizzle-orm";

function formatStatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
  }
  return num.toLocaleString() + "+";
}

export async function SocialProof() {
  const [
    [playersResult],
    [lobbiesResult],
    [squadsResult],
    [ratingResult]
  ] = await Promise.all([
    db.select({ value: count() }).from(users),
    db.select({ value: count() }).from(lobbies),
    db.select({ value: count() }).from(matchEntries),
    db.select({ value: avg(reviews.rating) }).from(reviews),
  ]);

  const playersCount = playersResult?.value || 0;
  const lobbiesCount = lobbiesResult?.value || 0;
  const squadsCount = squadsResult?.value || 0;
  
  const averageRating = ratingResult?.value 
    ? Number(ratingResult.value).toFixed(1) 
    : "5.0";

  const stats = [
    { value: formatStatNumber(playersCount), label: "Active Players" },
    { value: formatStatNumber(lobbiesCount), label: "Lobbies Created" },
    { value: formatStatNumber(squadsCount), label: "Squads Submitted" },
    { value: `${averageRating}★`, label: "Player Rating" },
  ];

  return (
    <section className="py-16 px-6 border-y border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-stone-600 mb-10">
          Trusted by cricket fans across the country
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.05] rounded-2xl overflow-hidden">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-8 px-6 bg-[oklch(0.09_0.007_38)] text-center transition-colors hover:bg-white/[0.02]"
            >
              <span className="text-3xl font-black text-white mb-1.5">
                {stat.value}
              </span>
              <span className="text-[11px] font-medium text-stone-500">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}