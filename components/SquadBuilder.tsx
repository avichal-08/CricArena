"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Plus, Loader2, User, Swords, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveSquadAction } from "@/lib/actions/SquadBuilder";

type Player = { id: string; name: string; teamId: string; role: string };

export const getPlayerCategory = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes('bat')) return 'BAT';
  if (r.includes('bowl')) return 'BOWL';
  if (r.includes('wk') || r.includes('wicket')) return 'WK';
  if (r.includes('all') || r === 'ar') return 'AR';
  return 'OTHER';
};

export function SquadBuilder({
  lobbyId,
  match,
  players,
  initialSelection,
}: {
  lobbyId: string;
  match: any;
  players: Player[];
  initialSelection: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const roles = ["ALL", "BAT", "BOWL", "AR", "WK"];

  const selectedPlayers = players.filter((p) => selectedIds.includes(p.id));
  const isFull = selectedIds.length === 12;

  const roleCounts = {
    BAT: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'BAT').length,
    BOWL: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'BOWL').length,
    AR: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'AR').length,
    WK: selectedPlayers.filter((p) => getPlayerCategory(p.role) === 'WK').length,
  };

  const hasAllRoles = roleCounts.BAT > 0 && roleCounts.BOWL > 0 && roleCounts.AR > 0 && roleCounts.WK > 0;
  
  const isValidSquad = isFull && hasAllRoles;

  const togglePlayer = (playerId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(playerId)) return prev.filter((id) => id !== playerId);
      if (prev.length >= 12) return prev;
      return [...prev, playerId];
    });
  };

  const handleSave = () => {
    if (!isValidSquad) return;
    startTransition(async () => {
      await saveSquadAction(lobbyId, match.id, selectedIds);
      router.push(`/lobby/${lobbyId}`);
    });
  };

  const filteredPlayers = players.filter((p) => {
    if (roleFilter === "ALL") return true;
    return getPlayerCategory(p.role) === roleFilter;
  });

  return (
    <div className="flex flex-col h-full w-full">
      
      <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-zinc-800/60 bg-black shrink-0">
        <div className="flex items-center gap-4">
          <Link href={`/lobby/${lobbyId}`} className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Build Squad</h1>
            <p className="text-xs text-zinc-500 font-medium">
              {match.teamAShort} vs {match.teamBShort}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500">Selected:</span>
              <span className={`text-sm font-mono font-bold ${isFull ? 'text-green-500' : 'text-white'}`}>
                {selectedIds.length}/12
              </span>
            </div>
            {isFull && !hasAllRoles && (
              <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" /> Missing required roles
              </span>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={!isValidSquad || isPending}
            className="flex items-center gap-2 bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-500 hover:bg-zinc-200 transition-colors px-4 md:px-5 py-2 rounded-md font-semibold text-sm active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Save
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="flex-1 flex flex-col border-r border-zinc-800/60 bg-black">
          
          <div className="p-4 border-b border-zinc-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {roles.map((role) => {
              const isMissing = role !== "ALL" && roleCounts[role as keyof typeof roleCounts] === 0 && selectedIds.length > 8;

              return (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-colors shrink-0 ${
                    roleFilter === role
                      ? "bg-white text-black"
                      : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {role}
                  {isMissing && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />}
                </button>
              );
            })}
          </div>

          <ScrollArea className="flex-1 h-0">
            <div className="divide-y divide-zinc-800/60 pb-20 md:pb-0">
              {filteredPlayers.map((player) => {
                const isSelected = selectedIds.includes(player.id);
                const teamShort = player.teamId === match.teamAId ? match.teamAShort : match.teamBShort;
                
                return (
                  <div 
                    key={player.id} 
                    onClick={() => togglePlayer(player.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
                      isSelected ? "bg-blue-950/20" : "hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                         <Image src={`/teams/${teamShort.toLowerCase()}.webp`} alt={teamShort} width={24} height={24} className="opacity-50 object-contain" />
                      </div>
                      <div>
                        <h3 className={`text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-200"}`}>
                          {player.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase">{teamShort}</span>
                          <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                          <span className="text-[10px] font-medium text-zinc-400 uppercase">{getPlayerCategory(player.role)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className={`w-7 h-7 rounded-md flex items-center justify-center border transition-all ${
                      isSelected 
                        ? "bg-blue-600 border-blue-500 text-white" 
                        : "bg-zinc-900 border-zinc-700 text-zinc-400"
                    }`}>
                      {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="hidden lg:flex flex-col w-[380px] bg-[#050505]">
          <div className="p-4 border-b border-zinc-800/60 bg-black/50">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Swords className="w-4 h-4 text-zinc-500" /> Your Playing XII
            </h2>
          </div>
          <ScrollArea className="flex-1 p-4 h-0">
            {selectedPlayers.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-3 mt-20">
                <User className="w-8 h-8 opacity-20" />
                <p className="text-sm font-medium">No players selected yet.</p>
              </div>
            ) : (
              <div className="space-y-2 pb-10">
                {selectedPlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 rounded-md border border-zinc-800 bg-zinc-900/30">
                     <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-200">{player.name}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">{getPlayerCategory(player.role)}</span>
                     </div>
                     <button onClick={() => togglePlayer(player.id)} className="text-zinc-500 hover:text-red-400 transition-colors p-1">
                       <MinusIcon className="w-4 h-4" />
                     </button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

      </div>
      
      <div className="lg:hidden p-3 border-t border-zinc-800/60 bg-black shrink-0 flex justify-between items-center z-10 pb-safe">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Selected</span>
          <span className={`text-lg font-mono font-black ${isFull ? 'text-green-500' : 'text-white'}`}>
             {selectedIds.length} <span className="text-zinc-600 text-sm">/ 12</span>
          </span>
        </div>
        <div className="flex gap-1.5">
          {roles.filter(r => r !== "ALL").map(role => {
             const count = roleCounts[role as keyof typeof roleCounts];
             const isError = count === 0 && isFull;
             
             return (
               <div key={role} className={`flex flex-col items-center rounded px-2 py-1 border transition-colors ${isError ? 'bg-red-950/50 border-red-900' : 'bg-zinc-900 border-zinc-800'}`}>
                 <span className={`text-[9px] font-bold ${isError ? 'text-red-400' : 'text-zinc-500'}`}>{role}</span>
                 <span className={`text-xs font-mono font-semibold ${isError ? 'text-red-400' : 'text-zinc-300'}`}>{count}</span>
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
}

function MinusIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}