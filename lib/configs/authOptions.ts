import { NextAuthOptions, DefaultSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@repo/db"; 
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "admin" | "user";
        } & DefaultSession["user"];
    }
    interface User {
        role: "admin" | "user";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId: string;
        role: "admin" | "user";
    }
}

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as any, 
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.userId = user.id;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;

                const [dbUser] = await db
                    .select({ role: users.role })
                    .from(users)
                    .where(eq(users.email, user.email!));

                token.role = dbUser?.role || "user"; 
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.userId) {
                session.user.id = token.userId as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.image as string;
                session.user.role = token.role as "admin" | "user"; 
            }
            return session;
        },
    }
};