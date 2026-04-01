"use server";

import { db } from "@repo/db";
import { lobbies, lobbyMembers } from "@repo/db/schema";

type CreateLobbyPayload = {
  name: string;
  type: "public" | "private";
  mode: "tournament" | "match";
  userId: string;
  tournamentId: string;
  matchId?: string | null;
};

export async function createLobbyAction(data: CreateLobbyPayload) {
  const [newLobby] = await db.insert(lobbies).values({
    name: data.name,
    type: data.type,
    mode: data.mode,
    tournamentId: data.tournamentId,
    matchId: data.matchId,
    createdBy: data.userId,
  }).returning({ id: lobbies.id });

  await db.insert(lobbyMembers).values({
    lobbyId: newLobby.id,
    userId: data.userId,
    role: "admin",
    status: "accepted",
  });

  return newLobby.id;
}