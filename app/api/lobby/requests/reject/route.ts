import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { lobbyMembers, lobbies } from "@repo/db/schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { lobbyId, requestUserId } = await req.json();
        if (!lobbyId || !requestUserId) {
            return NextResponse.json({ success: false, message: "Lobby id or request user id missing" }, { status: 400 });
        }

        const [lobby] = await db.select().from(lobbies).where(eq(lobbies.id, lobbyId));
        if (!lobby) {
            return NextResponse.json({ success: false, message: "Lobby not found" }, { status: 404 });
        }

        const finalStatus = "rejected";

        await db
            .update(lobbyMembers)
            .set({
                status: finalStatus,
            })
            .where(
                and(
                    eq(lobbyMembers.userId, requestUserId),
                    eq(lobbyMembers.lobbyId, lobbyId)
                )
            );

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error: any) {
        console.error("ERROR:", error);
        
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}