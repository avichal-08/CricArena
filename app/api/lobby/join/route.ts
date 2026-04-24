import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { lobbyMembers, lobbies } from "@repo/db/schema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { lobbyId } = await req.json();
        if (!lobbyId) {
            return NextResponse.json({ success: false, message: "Lobby ID is required" }, { status: 400 });
        }

        const [lobby] = await db.select().from(lobbies).where(eq(lobbies.id, lobbyId));
        if (!lobby) {
            return NextResponse.json({ success: false, message: "Lobby not found" }, { status: 404 });
        }

        const initialStatus = lobby.type === "public" ? "accepted" : "pending";

        await db.insert(lobbyMembers).values({
            lobbyId,
            userId: session.user.id,
            role: "member",
            status: initialStatus,
        });

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error: any) {
        console.error("JOIN API ERROR:", error);
        if (error.code === '23505') {
            return NextResponse.json({ success: false, message: "Already a member" }, { status: 409 });
        }
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}