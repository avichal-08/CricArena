import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/configs/authOptions";

import { SignInButton } from "@/components/SignInButton";
import { SignOutButton } from "@/components/SignOutButton";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session?.user?.role)
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
      <SignInButton/>
      <SignOutButton/>
    </div>
  )
}