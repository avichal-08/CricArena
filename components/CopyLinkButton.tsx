"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

export function CopyLinkButton({ lobbyId }: { lobbyId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/lobby/${lobbyId}`;
    await navigator.clipboard.writeText(url);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors px-4 py-2.5 rounded-md font-medium text-sm border border-zinc-800 active:scale-[0.98]"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Copied!</span>
        </>
      ) : (
        <>
          <Link2 className="w-4 h-4" />
          Share Link
        </>
      )}
    </button>
  );
}