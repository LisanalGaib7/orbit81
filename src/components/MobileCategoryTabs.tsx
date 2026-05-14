import { useCallback, useMemo, useEffect, useRef, useState } from "react";
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

  const rootRef = useRef<HTMLDivElement>(null);
  const lastHandledRef = useRef<number>(0);

  const selectedIndex = selectedTab >= 0 ? selectedTab : activeBlockIndex;

  const selectTab = useCallback((idx: number) => {
    setSelectedTab(idx);
    if (idx >= 0) onBlockClick(idx);
  }, [onBlockClick]);

  // Native capture listeners on window — guarantees tab switching even if any
  // parent layer (rocket animation, framer-motion, overlays) intercepts events.
  useEffect(() => {
    const handleNativePress = (event: Event) => {
      const target = event.target as Element | null;
      if (!target || typeof (target as Element).closest !== "function") return;
      const button = (target as Element).closest<HTMLElement>("[data-mobile-tab-idx]");
      if (!button) return;
      const root = rootRef.current;
      if (!root || !root.contains(button)) return;

      // Debounce: a single tap fires pointerdown + touchstart + click. Only act once per ~400ms.
      const now = Date.now();
      if (now - lastHandledRef.current < 400) {
        if (event.cancelable) event.preventDefault();
        return;
      }
      lastHandledRef.current = now;

      if (event.cancelable) event.preventDefault();
      const idx = Number(button.dataset.mobileTabIdx);
      if (Number.isFinite(idx)) selectTab(idx);
    };

    window.addEventListener("pointerdown", handleNativePress, true);
    window.addEventListener("touchstart", handleNativePress, { capture: true, passive: false });
    window.addEventListener("mousedown", handleNativePress, true);
    return () => {
      window.removeEventListener("pointerdown", handleNativePress, true);
      window.removeEventListener("touchstart", handleNativePress, true);
      window.removeEventListener("mousedown", handleNativePress, true);
    };
  }, [selectTab]);

  // React fallback (covers environments where native window capture is blocked).
  const handleTabClick = (idx: number, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const now = Date.now();
    if (now - lastHandledRef.current < 400) return;
    lastHandledRef.current = now;
    selectTab(idx);
  };

  return (
    <div ref={rootRef} className="relative w-full" style={{ zIndex: 200 }}>
      {/* Tab bar - horizontally scrollable */}
      <div 
        className="relative z-10 flex gap-1 overflow-x-auto pb-2 mb-3 no-scrollbar"
        style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.idx === -1 ? selectedTab === -1 : selectedIndex === tab.idx;
          const progress = tab.idx === -1 ? null : Math.round(subGoalProgress[tab.idx]);
          
          return (
            <button
              key={tab.idx}
              type="button"
              onClick={(event) => handleTabClick(tab.idx, event)}
              aria-pressed={isActive}
              data-active={isActive ? "true" : "false"}
              data-mobile-tab-idx={tab.idx}
              className={`relative z-10 flex min-h-[48px] flex-shrink-0 items-center justify-center rounded border px-3 py-2 text-[10px] font-bold tracking-wider transition-all ${
                isActive
                  ? "border-primary/60 bg-primary/15 shadow-[0_0_8px_rgba(234,179,8,0.2)]"
                  : "border-border bg-secondary/50 hover:border-muted-foreground/30"
              }`}
              style={{
                fontFamily: 'var(--font-data)',
                textShadow: '1px 1px 0px #000000',
                color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))',
                touchAction: 'manipulation',
                pointerEvents: 'auto',
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
      <div key={selectedTab}>
          {selectedIndex === null || selectedTab === -1 ? (
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
                      type="button"
              onClick={(event) => handleTabClick(idx, event)}
                      aria-pressed={selectedTab === idx}
                      data-active={selectedTab === idx ? "true" : "false"}
                      data-mobile-tab-idx={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30 hover:border-primary/30 transition-all min-h-[48px]"
                      style={{ touchAction: 'manipulation', pointerEvents: 'auto' }}
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
                blockIndex={selectedIndex}
                actions={actions[selectedIndex]}
                actionLabels={actionLabels[selectedIndex]}
                onToggle={onToggle}
                label={subGoalLabels[selectedIndex]}
                onLabelChange={(newLabel) => onLabelChange(selectedIndex, newLabel)}
                showConfetti={completedSubGoals.has(selectedIndex)}
                onConfettiComplete={() => onConfettiComplete(selectedIndex)}
                isActive={activeBlockIndex === selectedIndex}
                onBlockClick={() => onBlockClick(selectedIndex)}
                onActionClick={onActionClick}
              />
            </div>
          )}
      </div>
    </div>
  );
}
