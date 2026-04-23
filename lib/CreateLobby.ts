import { db } from "@repo/db";
import { lobbies, lobbyMembers } from "@repo/db/schema";
import type { CreateLobbyPayload } from "@/types/CreateLobbyPayload";

export async function createLobby(
  data: CreateLobbyPayload,
  userId: string
) {

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return await db.transaction(async (tx) => {
    try {
      const [newLobby] = await tx.insert(lobbies).values({
        name: data.name,
        type: data.type,
        mode: data.mode,
        tournamentId: data.tournamentId,
        matchId: data.matchId ?? null,
        createdBy: userId,
      }).returning({ id: lobbies.id });

      await tx.insert(lobbyMembers).values({
        lobbyId: newLobby.id,
        userId,
        role: "admin",
        status: "accepted",
      });

      return newLobby.id;

    } catch (err) {
      console.error("INSERT FAILED:", err);
      throw err;
    }
  });
}