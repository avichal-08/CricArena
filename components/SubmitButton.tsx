"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 active:scale-[0.98] transition-all font-bold text-[15px]"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Lobby...
        </>
      ) : (
        children
      )}
    </Button>
  );
}