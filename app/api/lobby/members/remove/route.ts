import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { lobbyMembers, matchEntries, matches } from "@repo/db/schema"; // <-- Import your match table here
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lobbyId, memberId } = await req.json();

    const [adminRecord] = await db
        .select()
        .from(lobbyMembers)
        .where(
            and(
                eq(lobbyMembers.lobbyId, lobbyId),
                eq(lobbyMembers.userId, session.user.id),
                eq(lobbyMembers.role, "admin")
            )
        );

    if (!adminRecord) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [memberToDelete] = await db
        .select()
        .from(lobbyMembers)
        .where(eq(lobbyMembers.id, memberId));

    if (!memberToDelete) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    try {
        await db.transaction(async (tx) => {
            await tx
                .delete(matchEntries)
                .where(
                    and(
                        eq(matchEntries.lobbyId, lobbyId),
                        eq(matchEntries.userId, memberToDelete.userId)
                    )
                );

            await tx
                .delete(lobbyMembers)
                .where(eq(lobbyMembers.id, memberId));
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove member and match entry:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}