"use client";

import { useState } from "react";
import { 
  Swords, 
  Target, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Trophy,
  Zap
} from "lucide-react";
import scoringConfig from "@/data/scoringConfig.json";

type Tab = "batting" | "bowling" | "fielding";

export function ScoringRules() {
  const [activeTab, setActiveTab] = useState<Tab>("batting");

  const PointBadge = ({ points }: { points: number }) => {
    const isPositive = points > 0;
    return (
      <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-md ${
        isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
      }`}>
        {isPositive ? "+" : ""}{points} pts
      </span>
    );
  };

  const RuleCard = ({ title, icon: Icon, children }: any) => (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
      <h3 className="text-[13px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-orange-400" /> {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const RuleRow = ({ label, points, subtext }: any) => (
    <div className="flex items-center justify-between pb-3 border-b border-white/[0.03] last:border-0 last:pb-0">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-stone-200">{label}</span>
        {subtext && <span className="text-[11px] text-stone-500 font-medium mt-0.5">{subtext}</span>}
      </div>
      <PointBadge points={points} />
    </div>
  );

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh] w-full bg-[oklch(0.12_0.01_38)] rounded-2xl border border-white/[0.05] overflow-hidden">   
      <div className="p-5 border-b border-white/[0.05] bg-white/[0.01] shrink-0">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-orange-500" /> Fantasy Scoring System
        </h2>
        <p className="text-xs text-stone-400 mt-1">Points calculation rules for T20 matches</p>
      </div>

      <div className="flex p-3 gap-2 border-b border-white/[0.05] shrink-0">
        {[
          { id: "batting", label: "Batting", icon: Swords },
          { id: "bowling", label: "Bowling", icon: Target },
          { id: "fielding", label: "Fielding", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                isActive 
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                  : "bg-white/[0.03] text-stone-400 hover:bg-white/[0.06] hover:text-stone-200"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 p-4">
        <div className="space-y-4">
          
          {activeTab === "batting" && (
            <>
              <RuleCard title="Base Points" icon={Zap}>
                <RuleRow label="Every Run Scored" points={scoringConfig.batting.basePoints.run} />
                <RuleRow label="Boundary Bonus" points={scoringConfig.batting.basePoints.fourBonus} subtext="Added to run points" />
                <RuleRow label="Six Bonus" points={scoringConfig.batting.basePoints.sixBonus} subtext="Added to run points" />
              </RuleCard>

              <RuleCard title="Milestone Bonuses" icon={Trophy}>
                <RuleRow label="30 Run Bonus" points={scoringConfig.batting.milestoneBonuses.thirtyRuns} />
                <RuleRow label="Half-Century Bonus" points={scoringConfig.batting.milestoneBonuses.halfCentury} subtext="50+ runs" />
                <RuleRow label="Century Bonus" points={scoringConfig.batting.milestoneBonuses.century} subtext="100+ runs" />
              </RuleCard>

              <RuleCard title="Strike Rate" icon={TrendingUp}>
                <div className="mb-3 text-[11px] text-orange-400/80 bg-orange-500/10 p-2 rounded-lg font-medium">
                  Applicable only for players facing minimum {scoringConfig.batting.strikeRate.minimumBallsFaced} balls.
                </div>
                {scoringConfig.batting.strikeRate.modifiers.map((mod, i) => (
                  <RuleRow 
                    key={i} 
                    label={`Strike Rate ${mod.condition.replace('>', 'Above').replace('<', 'Below').replace('=', 'or equal to')}`} 
                    points={mod.points} 
                  />
                ))}
              </RuleCard>

              <RuleCard title="Penalties" icon={AlertCircle}>
                <RuleRow 
                  label="Dismissal for a Duck" 
                  points={scoringConfig.batting.penalties.duck.points} 
                  subtext="Must face at least 1 ball" 
                />
              </RuleCard>
            </>
          )}

          {activeTab === "bowling" && (
            <>
              <RuleCard title="Base Points" icon={Zap}>
                <RuleRow label="Every Wicket" points={scoringConfig.bowling.basePoints.wicket} subtext="Excludes run-outs" />
                <RuleRow label="Maiden Over" points={scoringConfig.bowling.basePoints.maiden} />
              </RuleCard>

              <RuleCard title="Milestone Bonuses" icon={Trophy}>
                <RuleRow label="3 Wicket Haul" points={scoringConfig.bowling.milestoneBonuses.threeWickets} />
                <RuleRow label="4 Wicket Haul" points={scoringConfig.bowling.milestoneBonuses.fourWickets} />
                <RuleRow label="5 Wicket Haul" points={scoringConfig.bowling.milestoneBonuses.fiveWickets} />
              </RuleCard>

              <RuleCard title="Economy Rate" icon={TrendingDown}>
                <div className="mb-3 text-[11px] text-orange-400/80 bg-orange-500/10 p-2 rounded-lg font-medium">
                  Applicable only for bowlers bowling minimum {scoringConfig.bowling.economyRate.minimumOversBowled} overs.
                </div>
                {scoringConfig.bowling.economyRate.modifiers.map((mod, i) => (
                  <RuleRow 
                    key={i} 
                    label={`Economy ${mod.condition.replace('>', 'Above').replace('<', 'Below').replace('=', 'or equal to')} runs/over`} 
                    points={mod.points} 
                  />
                ))}
              </RuleCard>
            </>
          )}

          {activeTab === "fielding" && (
            <>
              <RuleCard title="Base Points" icon={Zap}>
                <RuleRow label="Catch" points={scoringConfig.fielding.basePoints.catch} />
              </RuleCard>

              <RuleCard title="Milestone Bonuses" icon={Trophy}>
                <RuleRow label="3 Catches Bonus" points={scoringConfig.fielding.milestoneBonuses.threeCatches} />
              </RuleCard>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
}