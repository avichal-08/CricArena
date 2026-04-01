import Link from "next/link";

import { Plus } from "lucide-react";

export function CreateLobbyButton() {
    return (
        <div>
            <Link href="/lobby/create">
                <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-2.5 rounded-md font-medium text-sm active:scale-[0.98]">
                    <Plus className="w-4 h-4" />
                    Create Lobby
                </button>
            </Link>
        </div>
    )
}