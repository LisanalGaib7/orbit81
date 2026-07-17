import { useCallback, useMemo, useEffect, useState, useRef, useLayoutEffect } from "react";
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
  onCloseSidebar: () => void;
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
  onCloseSidebar,
  onActionClick,
  globalProgress = 0,
}: MobileCategoryTabsProps) {
  const [selectedTab, setSelectedTab] = useState<number>(() => {
    if (typeof window === "undefined") return -1;
    const saved = sessionStorage.getItem("orbit81_mobile_tab");
    const n = saved !== null ? parseInt(saved, 10) : -1;
    return Number.isFinite(n) && n >= -1 && n <= 7 ? n : -1;
  });

  const tabs = useMemo(() => {
    const items: { idx: number; label: string; prefix: string }[] = [
      { idx: -1, label: "CORE", prefix: "⊕" },
    ];
    subGoalLabels.forEach((label, i) => {
      items.push({ idx: i, label: label.toUpperCase(), prefix: getPrefix(label) });
    });
    return items;
  }, [subGoalLabels]);

  const completedCount = (blockIdx: number) =>
    actions[blockIdx]?.filter(Boolean).length ?? 0;

  const selectTab = useCallback(
    (idx: number) => {
      try {
        sessionStorage.setItem("orbit81_mobile_tab", String(idx));
      } catch {}
      setSelectedTab((prev) => (prev === idx ? prev : idx));
      onCloseSidebar();
    },
    [onCloseSidebar],
  );

  useEffect(() => {
    try {
      sessionStorage.setItem("orbit81_mobile_tab", String(selectedTab));
    } catch {}
  }, [selectedTab]);

  // The 3×3 grid must be a square that fits within the space actually left
  // over below the rocket/progress hero. CSS aspect-ratio inside a flex column
  // is unreliable on iOS Safari (it fails to shrink, so the bottom row gets
  // clipped), so we measure the real available box and size the square in JS.
  const contentRef = useRef<HTMLDivElement>(null);
  const [squareSize, setSquareSize] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const size = Math.floor(Math.min(rect.width, rect.height));
      setSquareSize(size > 0 ? size : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  const selectFromEventTarget = useCallback(
    (target: EventTarget | null) => {
      const element = target instanceof HTMLElement ? target : null;
      const tabElement = element?.closest<HTMLElement>("[data-mobile-tab]");
      if (!tabElement) return;

      const nextTab = Number(tabElement.dataset.mobileTab);
      if (!Number.isFinite(nextTab) || nextTab < -1 || nextTab > 7) return;

      selectTab(nextTab);
    },
    [selectTab],
  );

  const makeTabHandlers = useCallback(
    (idx: number) => ({
      onPointerDown: () => {
        selectTab(idx);
      },
      onMouseDown: () => {
        selectTab(idx);
      },
      onTouchStart: () => {
        selectTab(idx);
      },
      onPointerUp: () => selectTab(idx),
      onClick: () => selectTab(idx),
    }),
    [selectTab],
  );

  return (
    <div
      className="relative w-full flex-1 min-h-0 flex flex-col"
      onPointerDownCapture={(event) => selectFromEventTarget(event.target)}
      onMouseDownCapture={(event) => selectFromEventTarget(event.target)}
      onTouchStartCapture={(event) => selectFromEventTarget(event.target)}
      style={{ zIndex: 200 }}
    >
      {/* Tab bar - horizontally scrollable */}
      <div
        className="relative z-10 flex gap-1 overflow-x-auto pb-1 mb-2 no-scrollbar shrink-0"
        style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-x" }}
      >
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.idx;
          const progress = tab.idx === -1 ? null : Math.round(subGoalProgress[tab.idx]);

          return (
            <button
              key={tab.idx}
              type="button"
              data-mobile-tab={tab.idx}
              {...makeTabHandlers(tab.idx)}
              aria-pressed={isActive}
              data-active={isActive ? "true" : "false"}
              className={`relative z-10 flex min-h-[36px] min-w-[60px] flex-shrink-0 items-center justify-center rounded border px-2 py-1 text-[10px] font-bold tracking-wider transition-all ${
                isActive
                  ? "border-primary/60 bg-primary/15 shadow-[0_0_8px_rgba(234,179,8,0.2)]"
                  : "border-border/50 bg-secondary/30 hover:border-muted-foreground/30"
              }`}
              style={{
                fontFamily: "var(--font-data)",
                textShadow: "1px 1px 0px #000000",
                color: isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                touchAction: "manipulation",
              }}
            >
              <span>{tab.prefix}</span>
              {progress !== null && (
                <span className="ml-1 text-[8px] opacity-50">{progress}%</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content area — stable wrapper measured for square sizing (see useLayoutEffect) */}
      <div ref={contentRef} className="flex-1 min-h-0 flex flex-col">
      <div key={selectedTab} className="flex-1 min-h-0 flex flex-col">
        {selectedTab === -1 ? (
          <div className="space-y-3 h-full overflow-y-auto no-scrollbar">
            <div className="aspect-square w-full mx-auto [&>*]:h-full [&>*]:w-full">
              <CoreGoalBlock
                subGoalProgress={subGoalProgress}
                subGoalLabels={subGoalLabels}
                coreProgress={globalProgress}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {subGoalLabels.map((label, idx) => {
                const completed = completedCount(idx);
                const progress = Math.round(subGoalProgress[idx]);
                return (
                  <button
                    key={idx}
                    type="button"
                    data-mobile-tab={idx}
                    {...makeTabHandlers(idx)}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-secondary/30 hover:border-primary/30 transition-all min-h-[48px]"
                    style={{ touchAction: "manipulation" }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold"
                        style={{
                          fontFamily: "var(--font-data)",
                          color: "hsl(var(--primary))",
                          textShadow: "1px 1px 0px #000000",
                        }}
                      >
                        {getPrefix(label)}
                      </span>
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider text-foreground"
                        style={{ fontFamily: "var(--font-header)" }}
                      >
                        {label}
                      </span>
                    </div>
                    <span
                      className="text-[10px]"
                      style={{
                        fontFamily: "var(--font-data)",
                        color: progress === 100 ? "hsl(120, 60%, 50%)" : "hsl(var(--primary))",
                        textShadow: "1px 1px 0px #000000",
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
          <div
            className={`mx-auto [&>*]:h-full [&>*]:w-full ${squareSize ? "" : "w-full aspect-square"}`}
            style={squareSize ? { width: squareSize, height: squareSize } : undefined}
          >
            <SubGoalBlock
              blockIndex={selectedTab}
              actions={actions[selectedTab]}
              actionLabels={actionLabels[selectedTab]}
              onToggle={onToggle}
              label={subGoalLabels[selectedTab]}
              onLabelChange={onLabelChange}
              showConfetti={completedSubGoals.has(selectedTab)}
              onConfettiComplete={onConfettiComplete}
              isActive={activeBlockIndex === selectedTab}
              onBlockClick={onBlockClick}
              onActionClick={onActionClick}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
