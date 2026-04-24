export type JoinRequests = {
    memberId: string;
    userId: string;
    name: string | null;
    image: string | null;
    role: "admin" | "member";
}