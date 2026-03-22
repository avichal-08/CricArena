"use client"

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  console.log(session?.user.role)
  return (
    <div>
      {session && <div>
        {session.user.email}
        {session.user.role}
      </div>
      }
      {session?.user.role === 'admin' && <div>
        {session.user.role}
      </div>
      }
      <button onClick={() => signIn("google", { callbackUrl: "/" })}>Sign In</button>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Log Out</button>
    </div>
  )
}