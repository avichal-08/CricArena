import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";
import { redirect } from "next/navigation";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { ShieldAlert } from "lucide-react";
import AdminNav from "@/components/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/api/auth/signin");

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="text-lg font-bold text-white">Access Denied</h1>
          <p className="text-sm text-stone-500 mt-1 font-mono">403 · Admin clearance required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminNav />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}