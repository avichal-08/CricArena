import Link from "next/link";
import { Plus } from "lucide-react";

export function CreateLobbyButton() {
  return (
    <Link href="/lobby/create">
      <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all duration-150 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-md shadow-orange-500/15">
        <Plus className="w-4 h-4" />
        Create Lobby
      </button>
    </Link>
  );
}