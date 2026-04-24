import { authOptions } from "@/lib/configs/authOptions";
import { createLobby } from "@/lib/CreateLobby";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const lobbyData = await req.json();

        if (!lobbyData || Object.keys(lobbyData).length === 0) {
            return NextResponse.json({ success: false, message: "Body Empty" },
                { status: 400 })
        }

        const lobbyId = await createLobby(lobbyData, userId);

        if (!lobbyId) {
            return NextResponse.json({ success: false, message: "Server Error! Please try again later" },
                { status: 500 })
        }

        return NextResponse.json({ success: true, lobbyId },
            { status: 201 });

    } catch (error) {
        return NextResponse.json({ success: false, message: "Server Error! Please try again later" },
            { status: 500 })
    }
}