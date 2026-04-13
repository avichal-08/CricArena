import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/configs/authOptions";

import { SignInButton } from "@/components/SignInButton";
import { SignOutButton } from "@/components/SignOutButton";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  if(session){
    redirect("/home");
  }

  return (
    <div>
      <SignInButton/>
      <SignOutButton/>
    </div>
  )
}