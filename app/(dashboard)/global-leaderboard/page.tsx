import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { users, matchEntries } from "@repo/db/schema";
import { sql, desc, eq } from "drizzle-orm";
import { GlobalLeaderboardClient } from "@/components/GlobalLeaderboardClient";

export default async function GlobalLeaderboardPage() {
    const session = await getServerSession(authOptions);

    const currentUserId: string | undefined = session?.user.id;

    const rawLeaderboard = await db
        .select({
            userId: users.id,
            name: users.name,
            image: users.image,
            totalScore: sql<number>`COALESCE(SUM(${matchEntries.score}), 0)::int`,
        })
        .from(users)
        .leftJoin(matchEntries, eq(users.id, matchEntries.userId))
        .groupBy(users.id)
        .orderBy(desc(sql`COALESCE(SUM(${matchEntries.score}), 0)`));

    const rankedLeaderboard = rawLeaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
    }));

    const top30 = rankedLeaderboard.slice(0, 30);
    const currentUserStats = rankedLeaderboard.find(u => u.userId === currentUserId);

    return (
        <div className="max-w-4xl mx-auto w-full p-5 md:p-10 pb-24">
            <GlobalLeaderboardClient
                top30={top30}
                currentUserStats={currentUserStats}
            />
        </div>
    );
}