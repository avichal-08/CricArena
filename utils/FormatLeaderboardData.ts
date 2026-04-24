import { LeaderboardMemberDb, LeaderboardMember } from '@/types/LeaderboardMember';

export const formatLeaderboardData = (dbData: LeaderboardMemberDb[]): LeaderboardMember[] => {
  return dbData.map((member) => ({
    ...member,
    userName: member.userName ?? undefined,
    userImage: member.userImage ?? undefined,
  }));
};