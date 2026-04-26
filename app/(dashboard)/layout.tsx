import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";

import { SideBar } from "@/components/SideBar";

export default async function DashboardLayout({ children }:
    {
        children: React.ReactNode;
    }) {

    const session = await getServerSession(authOptions);
    if (!session) redirect("/api/auth/signin");
    return (
        <SideBar user={session?.user}>
            {children}
        </SideBar>
    )
}