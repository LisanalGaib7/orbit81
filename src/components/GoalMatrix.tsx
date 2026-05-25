/**
 * GoalMatrix — Root orchestrator for the Orbit 81 mission dashboard.
 */

import { lazy, Suspense } from "react";
import { SubGoalBlock } from "./SubGoalBlock";
import { CoreGoalBlock } from "./CoreGoalBlock";
import { ProgressBar } from "./ProgressBar";
import { ProgressMilestones } from "./ProgressMilestones";
import { RocketLaunchSequence } from "./RocketLaunchSequence";
import { LaunchStructure } from "./LaunchStructure";
import { Starfield } from "./Starfield";
import { ActionSidebar } from "./ActionSidebar";
import { TypewriterText } from "./TypewriterText";
import { MobileCategoryTabs } from "./MobileCategoryTabs";
import { HeaderBar } from "./HeaderBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMissionProgress } from "@/hooks/useMissionProgress";
import { GRID_POSITIONS, TOTAL_ACTIONS } from "@/constants/missionData";

// 100% 달성 시에만 표시되는 무거운 컴포넌트 — 초기 번들에서 분리
const DeepSpaceFireworks = lazy(() => import("./DeepSpaceFireworks").then(m => ({ default: m.DeepSpaceFireworks })));
const MissionAccomplished = lazy(() => import("./MissionAccomplished").then(m => ({ default: m.MissionAccomplished })));

export function GoalMatrix() {
  const {
    actions,
    subGoalLabels,
    actionLabels,
    activeBlockIndex,
    focusActionIndex,
    ignitionBurst,
    subGoalProgress,
    globalProgress,
    completedCount,
    completedSubGoals,
    currentStage,
    showMissionComplete,
    showMissionModal,
    showFireworks,
    toggleAction,
    updateLabel,
    updateActionLabel,
    applyTemplate,
    resetSession,
    revertReset,
    canRevert,
    handleActionSlotClick,
    clearConfetti,
    handleLaunchComplete,
    dismissMission,
    setActiveBlockIndex,
    setFocusActionIndex,
  } = useMissionProgress();

  const isMobile = useIsMobile();

  return (
    <>
      <Starfield progress={globalProgress} />

      {/* HUD utility icons — rendered via portal to document.body */}
      <HeaderBar onApplyTemplate={applyTemplate} onReset={resetSession} canRevert={canRevert} onRevert={revertReset} />

      <div className="relative z-10 flex flex-col items-center gap-6 p-4 sm:p-6 pt-24 sm:pt-6 max-w-3xl mx-auto">
        {/* SECTION 1: Brand */}
        <div className="text-center pt-2">
          <h1
            className="text-lg sm:text-2xl md:text-3xl font-bold tracking-wide pixel-title-3d whitespace-nowrap"
            style={{ imageRendering: "pixelated" }}
          >
            <span className="text-primary">Orbit</span>{" "}
            <span className="text-foreground">81</span>
          </h1>
          <p
            className="font-pixel text-[6px] sm:text-[7px] text-muted-foreground mt-2 whitespace-nowrap"
            style={{ imageRendering: "pixelated" }}
          >
            <TypewriterText text="Writing the greatest chapter yet" typingSpeed={60} />
          </p>
        </div>

        {/* SECTION 2: Rocket + Launch Structure + Progress */}
        <div className="w-full flex flex-col items-center gap-6 pointer-events-none" style={{ zIndex: 100 }}>
          <div className="relative" style={{ minHeight: "160px", width: "120px" }}>
            {/* Mechazilla launch structure behind rocket */}
            <LaunchStructure stage={currentStage} />
            <RocketLaunchSequence
              progress={globalProgress}
              onLaunchStart={handleLaunchComplete}
              ignitionBurst={ignitionBurst}
            />
          </div>

          <div className="w-full max-w-md space-y-1">
            {/* Mission Readout */}
            <div className="text-center mb-2">
              <span
                className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] uppercase"
                style={{
                  color: "hsl(45 100% 50%)",
                  textShadow: "1px 1px 0px #000000, 0 0 8px hsl(45 100% 50% / 0.3)",
                  imageRendering: "pixelated",
                }}
              >
                [ MISSION PROGRESS: {completedCount}/{TOTAL_ACTIONS} ({Math.round(globalProgress)}%) ]
              </span>
            </div>

            {/* Evolution Stage HUD */}
            <div className="text-center mb-1">
              <span
                className="font-mono text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-primary"
                style={{ textShadow: "1px 1px 0px #000000", imageRendering: "pixelated" }}
              >
                STATUS: {currentStage.name}
              </span>
            </div>

            <ProgressBar progress={globalProgress} />
          </div>
        </div>

        {/* SECTION 3: Matrix Grid */}
        {isMobile ? (
          <MobileCategoryTabs
            actions={actions}
            actionLabels={actionLabels}
            subGoalLabels={subGoalLabels}
            subGoalProgress={subGoalProgress}
            onToggle={toggleAction}
            onLabelChange={updateLabel}
            completedSubGoals={completedSubGoals}
            onConfettiComplete={clearConfetti}
            activeBlockIndex={activeBlockIndex}
            onBlockClick={(idx) => { setActiveBlockIndex(idx); setFocusActionIndex(null); }}
            onActionClick={handleActionSlotClick}
            globalProgress={globalProgress}
          />
        ) : (
          <div className="goal-grid w-full aspect-square max-w-2xl" style={{ zIndex: 50 }}>
            {GRID_POSITIONS.map((subIdx, gridIdx) => (
              <div key={gridIdx} className="aspect-square">
                {subIdx === -1 ? (
                  <CoreGoalBlock subGoalProgress={subGoalProgress} subGoalLabels={subGoalLabels} coreProgress={globalProgress} />
                ) : (
                  <SubGoalBlock
                    blockIndex={subIdx}
                    actions={actions[subIdx]}
                    actionLabels={actionLabels[subIdx]}
                    onToggle={toggleAction}
                    label={subGoalLabels[subIdx]}
                    onLabelChange={(newLabel) => updateLabel(subIdx, newLabel)}
                    showConfetti={completedSubGoals.has(subIdx)}
                    onConfettiComplete={() => clearConfetti(subIdx)}
                    isActive={activeBlockIndex === subIdx}
                    onBlockClick={() => { setActiveBlockIndex(subIdx); setFocusActionIndex(null); }}
                    onActionClick={handleActionSlotClick}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* SECTION 4: Legend */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-goal-core border border-border" />
            <span>Core Goal (Center)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-goal-sub border border-border" />
            <span>Sub Goals (8 blocks)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="checkbox-goal checked w-3 h-3 !border" />
            <span>Completed Action</span>
          </div>
        </div>
      </div>

      {/* Action Sidebar (Task Drawer) */}
      {activeBlockIndex !== null && (
        <ActionSidebar
          isOpen={activeBlockIndex !== null}
          onClose={() => { setActiveBlockIndex(null); setFocusActionIndex(null); }}
          blockIndex={activeBlockIndex}
          label={subGoalLabels[activeBlockIndex]}
          actions={actions[activeBlockIndex]}
          actionLabels={actionLabels[activeBlockIndex]}
          onToggle={toggleAction}
          onActionLabelChange={updateActionLabel}
          focusActionIndex={focusActionIndex}
        />
      )}

      <Suspense fallback={null}>
        <DeepSpaceFireworks active={showFireworks} />
      </Suspense>

      <Suspense fallback={null}>
        <MissionAccomplished
          isOpen={showMissionComplete}
          onClose={dismissMission}
          showModal={showMissionModal}
        />
      </Suspense>
    </>
  );
}
