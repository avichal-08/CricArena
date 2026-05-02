export type RichScorecard = {
    matchInfo?: {
        battingTeam: string,
        bowlingTeam: string,
        totalScore: string,
        overs: string,
        extras: string,
        crr: string
    };
    playerStats: any[];
};