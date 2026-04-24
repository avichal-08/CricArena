export type LobbyType = {
    id: string;
    name: string;
    type: "public" | "private";
    mode: "match" | "tournament";
    tournamentId: string;
    matchId: string | null;
    createdBy: string;
    createdAt: Date;
}
