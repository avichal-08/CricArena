"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Check, Plus, Loader2, Swords, AlertCircle, X } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { saveSquadAction } from "@/actions/SquadBuilder";
import { ScoringRules } from "./ScoringRule";

type Player = { id: string; name: string; teamId: string; role: string };

export const getPlayerCategory = (role: string) => {
  const r = role.toLowerCase();
  if (r.includes("bat")) return "BAT";
  if (r.includes("bowl")) return "BOWL";
  if (r.includes("wk") || r.includes("wicket")) return "WK";
  if (r.includes("all") || r === "ar") return "AR";
  return "OTHER";
};

function MinusIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  const roles = ["ALL", "BAT", "BOWL", "AR", "WK"];

  const selectedPlayers = players.filter((p) => selectedIds.includes(p.id));
  const isFull = selectedIds.length === 12;

  const teamACount = selectedPlayers.filter((p) => p.teamId === match.teamAId).length;
  const teamBCount = selectedPlayers.filter((p) => p.teamId === match.teamBId).length;

  const roleCounts = {
    BAT: selectedPlayers.filter((p) => getPlayerCategory(p.role) === "BAT").length,
    BOWL: selectedPlayers.filter((p) => getPlayerCategory(p.role) === "BOWL").length,
    AR: selectedPlayers.filter((p) => getPlayerCategory(p.role) === "AR").length,
    WK: selectedPlayers.filter((p) => getPlayerCategory(p.role) === "WK").length,
  };

  const hasAllRoles = roleCounts.BAT > 0 && roleCounts.BOWL > 0 && roleCounts.AR > 0 && roleCounts.WK > 0;
  const isValidSquad = isFull && hasAllRoles;

  const togglePlayer = (playerId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(playerId)) return prev.filter((id) => id !== playerId);
      if (prev.length >= 12) return prev;
      const playerToAdd = players.find((p) => p.id === playerId);
      if (!playerToAdd) return prev;
      if (playerToAdd.teamId === match.teamAId && teamACount >= 7) return prev;
      if (playerToAdd.teamId === match.teamBId && teamBCount >= 7) return prev;
      return [...prev, playerId];
    });
  };

  const handleInitialSave = () => {
    if (!isValidSquad) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    if (!isValidSquad) return;
    startTransition(async () => {
      await saveSquadAction(lobbyId, match.id, selectedIds);
      setShowConfirmModal(false);
      router.push(`/lobby/${lobbyId}`);
    });
  };

  const filteredPlayers = players.filter((p) => {
    if (roleFilter === "ALL") return true;
    return getPlayerCategory(p.role) === roleFilter;
  });

  return (
    <>
      <div className="flex flex-col h-full w-full bg-background">
        <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/[0.05] bg-[oklch(0.10_0.007_38)] shrink-0">
          <div className="flex items-center gap-3">
            <Link href={`/lobby/${lobbyId}`} className="p-2 -ml-1 text-stone-500 hover:text-stone-300 hover:bg-white/[0.05] rounded-xl transition-all">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-[15px] font-bold text-white">Build Your Squad</h1>
              <p className="text-[11px] text-stone-500 font-medium">
                {match.teamAShort} vs {match.teamBShort}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-xl">
                  <span className="text-[11px] font-bold text-stone-400">
                    {match.teamAShort} <span className={teamACount === 7 ? "text-orange-400" : "text-stone-200"}>{teamACount}</span>
                  </span>
                  <span className="text-stone-700 text-xs">|</span>
                  <span className="text-[11px] font-bold text-stone-400">
                    {match.teamBShort} <span className={teamBCount === 7 ? "text-orange-400" : "text-stone-200"}>{teamBCount}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-stone-500">Squad:</span>
                  <span className={`text-sm font-black font-mono ${isFull ? "text-orange-400" : "text-white"}`}>
                    {selectedIds.length}/12
                  </span>
                </div>
              </div>
              {isFull && !hasAllRoles && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> Missing required roles
                </span>
              )}
            </div>

            <button onClick={() => setShowRulesModal(true)} className="text-stone-400 hover:text-white">
              <AlertCircle className="w-4 h-4" />
            </button>

            <button
              onClick={handleInitialSave}
              disabled={!isValidSquad}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-white/[0.06] disabled:text-stone-600 text-white transition-all duration-150 px-4 py-2.5 rounded-xl font-semibold text-sm active:scale-[0.97] shadow-lg shadow-orange-500/20 disabled:shadow-none"
            >
              <Check className="w-4 h-4" />
              Save Squad
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col border-r border-white/[0.04]">
            <div className="p-3 border-b border-white/[0.04] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {roles.map((role) => {
                const isMissing = role !== "ALL" && roleCounts[role as keyof typeof roleCounts] === 0 && selectedIds.length > 8;
                return (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`relative px-3.5 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-150 shrink-0 ${roleFilter === role
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-white/[0.04] text-stone-500 hover:text-stone-300 hover:bg-white/[0.06]"
                      }`}
                  >
                    {role}
                    {isMissing && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <ScrollArea className="flex-1 h-0">
              <div className="divide-y divide-white/[0.03] pb-24 md:pb-0">
                {filteredPlayers.map((player) => {
                  const isSelected = selectedIds.includes(player.id);
                  const teamShort = player.teamId === match.teamAId ? match.teamAShort : match.teamBShort;
                  const isTeamLimitReached =
                    !isSelected &&
                    ((player.teamId === match.teamAId && teamACount >= 7) ||
                      (player.teamId === match.teamBId && teamBCount >= 7));

                  return (
                    <div
                      key={player.id}
                      onClick={() => !isTeamLimitReached && togglePlayer(player.id)}
                      className={`flex items-center justify-between px-4 py-3.5 transition-all duration-150 ${isSelected
                        ? "bg-orange-500/[0.08]"
                        : isTeamLimitReached
                          ? "opacity-35 cursor-not-allowed"
                          : "hover:bg-white/[0.02] cursor-pointer"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                          <Image
                            src={`/teams/${teamShort.toLowerCase()}.webp`}
                            alt={teamShort}
                            width={22}
                            height={22}
                            className="opacity-60 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className={`text-[13px] font-semibold leading-tight ${isSelected ? "text-white" : "text-stone-200"}`}>
                            {player.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-bold uppercase ${player.teamId === match.teamAId ? "text-sky-400" : "text-emerald-400"
                              }`}>
                              {teamShort}
                            </span>
                            <span className="w-0.5 h-0.5 rounded-full bg-stone-700" />
                            <span className="text-[10px] font-bold text-stone-600 uppercase">
                              {getPlayerCategory(player.role)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        disabled={isTeamLimitReached}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center border transition-all duration-150 ${isSelected
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-white/[0.04] border-white/[0.08] text-stone-600 hover:border-orange-500/30 hover:text-stone-400"
                          }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="hidden lg:flex flex-col w-[340px] bg-[oklch(0.10_0.007_38)]">
            <div className="px-4 py-3.5 border-b border-white/[0.04]">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.12em] text-stone-500 flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" /> Your Playing XII
              </h2>
            </div>
            <ScrollArea className="flex-1 p-3 h-0">
              {selectedPlayers.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                    <Swords className="w-5 h-5 text-stone-700" />
                  </div>
                  <p className="text-sm font-medium text-stone-600">Select 12 players</p>
                  <p className="text-xs text-stone-700">Choose from the list on the left</p>
                </div>
              ) : (
                <div className="space-y-1.5 pb-6">
                  {selectedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] group">
                      <div>
                        <span className="text-[12.5px] font-semibold text-stone-200 block">{player.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold uppercase text-stone-600">{getPlayerCategory(player.role)}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-stone-700" />
                          <span className={`text-[10px] font-bold uppercase ${player.teamId === match.teamAId ? "text-sky-400/70" : "text-emerald-400/70"
                            }`}>
                            {player.teamId === match.teamAId ? match.teamAShort : match.teamBShort}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => togglePlayer(player.id)}
                        className="p-1 text-stone-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="lg:hidden p-3 border-t border-white/[0.05] bg-[oklch(0.10_0.007_38)] shrink-0 z-10 pb-safe">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex gap-3">
              {[
                { label: match.teamAShort, count: teamACount, isLimit: teamACount === 7 },
                { label: match.teamBShort, count: teamBCount, isLimit: teamBCount === 7 },
              ].map((t) => (
                <div key={t.label} className="flex flex-col">
                  <span className="text-[9px] font-bold text-stone-600 uppercase">{t.label}</span>
                  <span className={`text-sm font-black font-mono ${t.isLimit ? "text-orange-400" : "text-stone-300"}`}>
                    {t.count}/7
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-bold text-stone-600 uppercase">Total</span>
              <span className={`text-xl font-black font-mono leading-tight ${isFull ? "text-orange-400" : "text-white"}`}>
                {selectedIds.length}<span className="text-stone-700 text-sm">/12</span>
              </span>
            </div>
          </div>

          <div className="flex gap-1.5">
            {roles.filter((r) => r !== "ALL").map((role) => {
              const count = roleCounts[role as keyof typeof roleCounts];
              const isError = count === 0 && isFull;
              return (
                <div
                  key={role}
                  className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-lg border transition-colors ${isError ? "bg-red-500/10 border-red-500/20" : "bg-white/[0.03] border-white/[0.05]"
                    }`}
                >
                  <span className={`text-[9px] font-bold uppercase ${isError ? "text-red-400" : "text-stone-600"}`}>{role}</span>
                  <span className={`text-[11px] font-black font-mono ${isError ? "text-red-400" : "text-stone-300"}`}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[oklch(0.12_0.01_38)] border border-white/[0.1] rounded-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[85vh] shadow-2xl">

            <div className="p-4 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.02] shrink-0">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-orange-500" /> Confirm Playing XII
              </h2>
              <button
                onClick={() => !isPending && setShowConfirmModal(false)}
                disabled={isPending}
                className="p-1 text-stone-500 hover:text-white hover:bg-white/[0.1] rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 w-full p-4 space-y-2">
              {selectedPlayers.map((player) => {
                const teamShort = player.teamId === match.teamAId ? match.teamAShort : match.teamBShort;
                return (
                  <div key={`confirm-${player.id}`} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.05] flex items-center justify-center overflow-hidden">
                        <Image
                          src={`/teams/${teamShort.toLowerCase()}.webp`}
                          alt={teamShort}
                          width={18}
                          height={18}
                          className="opacity-70 object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[13px] font-semibold text-stone-200 block">{player.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-bold uppercase ${player.teamId === match.teamAId ? "text-sky-400" : "text-emerald-400"
                            }`}>
                            {teamShort}
                          </span>
                          <span className="w-0.5 h-0.5 rounded-full bg-stone-700" />
                          <span className="text-[10px] font-bold text-stone-500 uppercase">{getPlayerCategory(player.role)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/[0.05] flex gap-3 bg-white/[0.01] shrink-0">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl border border-white/[0.1] text-stone-300 font-semibold text-sm hover:bg-white/[0.05] transition-all disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={isPending}
                className="flex-[2] py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-orange-500/20"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md">
            <button onClick={() => setShowRulesModal(false)} className="absolute -top-3 -right-3 z-10 p-2 bg-stone-800 rounded-full text-white">
              <X className="w-4 h-4" />
            </button>
            <ScoringRules />
          </div>
        </div>
      )}
    </>
  );
}