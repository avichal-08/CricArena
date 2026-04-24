// 1. Define the fields that never change
type BaseLeaderboardMember = {
    id: string;
    score: number;
    userId: string;
};

export type LeaderboardMember = BaseLeaderboardMember & {
    userName: string | undefined;
    userImage: string | undefined;
};

export type LeaderboardMemberDb = BaseLeaderboardMember & {
    userName: string | null;
    userImage: string | null;
};