import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubGoalBlock } from "./SubGoalBlock";
import { CoreGoalBlock } from "./CoreGoalBlock";
import { getPrefix } from "@/lib/goalIds";

interface MobileCategoryTabsProps {
  actions: boolean[][];
  actionLabels: string[][];
  subGoalLabels: string[];
  subGoalProgress: number[];
  onToggle: (blockIndex: number, actionIndex: number) => void;
  onLabelChange: (index: number, newLabel: string) => void;
  completedSubGoals: Set<number>;
  onConfettiComplete: (idx: number) => void;
  activeBlockIndex: number | null;
  onBlockClick: (idx: number) => void;
  onActionClick: (blockIndex: number, actionIndex: number) => void;
  globalProgress?: number;
}

export function MobileCategoryTabs({
  actions,
  actionLabels,
  subGoalLabels,
  subGoalProgress,
  onToggle,
  onLabelChange,
  completedSubGoals,
  onConfettiComplete,
  activeBlockIndex,
  onBlockClick,
  onActionClick,
  globalProgress = 0,
}: MobileCategoryTabsProps) {
  // Persist selected tab in sessionStorage so re-renders/remounts don't reset it
  const [selectedTab, setSelectedTab] = useState<number>(() => {
    if (typeof window === "undefined") return -1;
    const saved = sessionStorage.getItem("orbit81_mobile_tab");
    const n = saved !== null ? parseInt(saved, 10) : -1;
    return Number.isFinite(n) && n >= -1 && n <= 7 ? n : -1;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("orbit81_mobile_tab", String(selectedTab));
    } catch {}
  }, [selectedTab]);

  const tabs = useMemo(() => {
    const items: { idx: number; label: string; prefix: string }[] = [
      { idx: -1, label: "CORE", prefix: "⊕" },
    ];
    subGoalLabels.forEach((label, i) => {
      items.push({ idx: i, label: label.toUpperCase(), prefix: getPrefix(label) });
    });
    return items;
  }, [subGoalLabels]);

  const completedCount = (blockIdx: number) => {
    return actions[blockIdx]?.filter(Boolean).length ?? 0;
  };

  return (
    <div className="w-full" style={{ zIndex: 50 }}>
      {/* Tab bar - horizontally scrollable */}
      <div 
        className="flex gap-1 overflow-x-auto pb-2 mb-3 no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.idx;
          const progress = tab.idx === -1 ? null : Math.round(subGoalProgress[tab.idx]);
          
          return (
            <button
              key={tab.idx}
              onClick={() => setSelectedTab(tab.idx)}
              className={`flex-shrink-0 px-2.5 py-1.5 rounded text-[10px] font-bold tracking-wider transition-all border ${
                isActive 
                  ? "border-primary/60 bg-primary/15 shadow-[0_0_8px_rgba(234,179,8,0.2)]" 
                  : "border-border bg-secondary/50 hover:border-muted-foreground/30"
              }`}
              style={{ 
                fontFamily: 'var(--font-data)',
                textShadow: '1px 1px 0px #000000',
                color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
              }}
            >
              <span>{tab.prefix}</span>
              {progress !== null && (
                <span className="ml-1 text-[8px] opacity-60">{progress}%</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {selectedTab === -1 ? (
            /* Core overview - show all 8 categories as a summary */
            <div className="space-y-3">
              <CoreGoalBlock 
                subGoalProgress={subGoalProgress}
                subGoalLabels={subGoalLabels}
                coreProgress={globalProgress}
              />
              {/* Category summary list */}
              <div className="grid grid-cols-2 gap-2">
                {subGoalLabels.map((label, idx) => {
                  const completed = completedCount(idx);
                  const progress = Math.round(subGoalProgress[idx]);
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedTab(idx)}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[10px] font-bold"
                          style={{ 
                            fontFamily: 'var(--font-data)', 
                            color: 'hsl(var(--primary))',
                            textShadow: '1px 1px 0px #000000',
                          }}
                        >
                          {getPrefix(label)}
                        </span>
                        <span 
                          className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                          style={{ fontFamily: 'var(--font-header)' }}
                        >
                          {label}
                        </span>
                      </div>
                      <span 
                        className="text-[10px]"
                        style={{ 
                          fontFamily: 'var(--font-data)',
                          color: progress === 100 ? 'hsl(120, 60%, 50%)' : 'hsl(var(--primary))',
                          textShadow: '1px 1px 0px #000000',
                        }}
                      >
                        {completed}/8
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Single category 3x3 grid */
            <div className="max-w-[280px] mx-auto">
              <SubGoalBlock
                blockIndex={selectedTab}
                actions={actions[selectedTab]}
                actionLabels={actionLabels[selectedTab]}
                onToggle={onToggle}
                label={subGoalLabels[selectedTab]}
                onLabelChange={(newLabel) => onLabelChange(selectedTab, newLabel)}
                showConfetti={completedSubGoals.has(selectedTab)}
                onConfettiComplete={() => onConfettiComplete(selectedTab)}
                isActive={activeBlockIndex === selectedTab}
                onBlockClick={() => onBlockClick(selectedTab)}
                onActionClick={onActionClick}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
