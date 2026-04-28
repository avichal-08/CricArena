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
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
        copied
          ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
          : "bg-white/[0.04] border-white/[0.08] text-stone-300 hover:text-white hover:bg-white/[0.07] hover:border-white/[0.12]"
      }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="w-3.5 h-3.5" />
          Share
        </>
      )}
    </button>
  );
}