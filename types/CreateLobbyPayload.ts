export type CreateLobbyPayload = {
  name: string;
  type: "public" | "private";
  mode: "tournament" | "match";
  tournamentId: string;
  matchId?: string | null;
};