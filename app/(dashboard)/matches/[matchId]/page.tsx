import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { alias } from "drizzle-orm/pg-core";
import { eq, gte, asc, or } from "drizzle-orm";

import { db } from "@repo/db";
import { matches, teams } from "@repo/db/schema";


import { authOptions } from "@/lib/configs/authOptions";

export default async function Match() {

    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/")
    }

    const userId = session?.user?.id;

    

    return (
        <div>
            m
        </div>
    )
}