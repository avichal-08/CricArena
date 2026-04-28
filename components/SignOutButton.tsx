"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/20 text-stone-400 hover:text-red-400 transition-all duration-150 text-sm font-medium"
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </button>
  )
}