import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/AppShell";

export default async function DashboardLayout({ children }:
    {
        children: React.ReactNode;
    }) {

    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }

    return (
        <AppShell user={session?.user}>
            {children}
        </AppShell>
    )
}