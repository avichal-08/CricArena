"use client"

import { signIn } from "next-auth/react"
import { LogIn } from "lucide-react"

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/home" })}
      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-orange-500/20"
    >
      <LogIn className="w-4 h-4" />
      Sign In with Google
    </button>
  )
}