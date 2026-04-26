import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { alias } from "drizzle-orm/pg-core";
import { eq, gte, asc, or } from "drizzle-orm";

import { db } from "@repo/db";
import { matches, teams } from "@repo/db/schema";


import { authOptions } from "@/lib/configs/authOptions";

export default async function Match({ params }: { params: { matchId: string } }) {

    const session = await getServerSession(authOptions);

    const { matchId } = await params;

    const userId = session?.user?.id;



    return (
        <div>
            m
        </div>
    )
}