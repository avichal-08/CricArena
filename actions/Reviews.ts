"use server";

import { db } from "@repo/db";
import { reviews } from "@repo/db/schema";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";

export async function submitReviewAction(rating: number, reviewText: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    await db.insert(reviews).values({
      userId: session.user.id,
      rating,
      reviewText,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, error: "Failed to submit review" };
  }
}