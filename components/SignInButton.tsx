"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SignInButton({ 
  className, 
  children 
}: { 
  className?: string;
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (error) {
      console.error("Sign in failed:", error);
      setIsLoading(false); 
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`${className} disabled:opacity-80 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
      ) : (
        children
      )}
    </button>
  );
}