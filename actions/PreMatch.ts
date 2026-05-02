"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { db } from "@repo/db";
import { users, matches } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
    success: boolean;
    message: string;
    error?: any;
};

export async function preMatch(matchId: string, preMatchJson: string): Promise<ActionResponse> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return { success: false, message: "Unauthorized. Please log in." };
        }

        const [currentUser] = await db.select().from(users).where(eq(users.id, session.user.id));
        if (currentUser?.role !== "admin") {
            return { success: false, message: "Forbidden: Admin clearance required." };
        }

        let preMatchPayload;
        try {
            preMatchPayload = JSON.parse(preMatchJson);
        } catch (e) {
            return { success: false, message: "Invalid JSON format. Please check for syntax errors." };
        }

        const updateData: Record<string, any> = {};

        if (preMatchPayload.venue !== undefined) updateData.venue = preMatchPayload.venue;
        if (preMatchPayload.toss !== undefined) updateData.toss = preMatchPayload.toss;
        if (preMatchPayload.lineups !== undefined) updateData.lineups = preMatchPayload.lineups;
        if (preMatchPayload.winProbability !== undefined) updateData.winProbability = preMatchPayload.winProbability;

        if (Object.keys(updateData).length === 0) {
            return { success: false, message: "No valid match fields (venue, toss, lineups, winProbability) found." };
        }

        await db.update(matches)
            .set(updateData)
            .where(eq(matches.id, matchId));

        revalidatePath("/", "layout");
        return {
            success: true,
            message: `Successfully updated: ${Object.keys(updateData).join(", ")}`
        };

    } catch (error: any) {
        console.error("Pre-match action error:", error);
        return {
            success: false,
            message: "An unexpected error occurred while updating the match.",
            error: error.message
        };
    }
}