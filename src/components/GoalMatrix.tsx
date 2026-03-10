/**
 * GoalMatrix — Root orchestrator for the Orbit 81 mission dashboard.
 *
 * WHY: This component wires together the visual shell (starfield, rocket,
 * grid, sidebar, fireworks) with the state machine provided by
 * useMissionProgress. It owns no business logic itself.
 */

import { SubGoalBlock } from "./SubGoalBlock";
import { CoreGoalBlock } from "./CoreGoalBlock";
import { ProgressBar } from "./ProgressBar";
import { ProgressMilestones } from "./ProgressMilestones";
import { RocketLaunchSequence } from "./RocketLaunchSequence";
import { Starfield } from "./Starfield";
import { MissionAccomplished } from "./MissionAccomplished";
import { DeepSpaceFireworks } from "./DeepSpaceFireworks";
import { ActionSidebar } from "./ActionSidebar";
import { TypewriterText } from "./TypewriterText";
import { MobileCategoryTabs } from "./MobileCategoryTabs";
import { HeaderBar } from "./HeaderBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMissionProgress } from "@/hooks/useMissionProgress";
import { GRID_POSITIONS, TOTAL_ACTIONS } from "@/constants/missionData";

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
    showMissionComplete,
    showMissionModal,
    showFireworks,
    toggleAction,
    updateLabel,
    updateActionLabel,
    applyTemplate,
    resetSession,
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
      <HeaderBar onApplyTemplate={applyTemplate} onReset={resetSession} />

      <div className="relative z-10 flex flex-col items-center gap-6 p-4 sm:p-6 max-w-3xl mx-auto">
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

        {/* SECTION 2: Rocket + Progress */}
        <div className="w-full flex flex-col items-center gap-6" style={{ zIndex: 100 }}>
          <div className="relative" style={{ minHeight: "140px" }}>
            <RocketLaunchSequence
              progress={globalProgress}
              onLaunchStart={handleLaunchComplete}
              ignitionBurst={ignitionBurst}
            />
          </div>

          <div className="w-full max-w-md space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[8px] text-muted-foreground" style={{ imageRendering: "pixelated" }}>
                Total Progress
              </span>
              <span className="pixel-gold-stat-outlined text-xl">
                {completedCount}/{TOTAL_ACTIONS} ({Math.round(globalProgress)}%)
              </span>
            </div>
            <ProgressBar progress={globalProgress} />
            <ProgressMilestones progress={globalProgress} />
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
          />
        ) : (
          <div className="goal-grid w-full aspect-square max-w-2xl" style={{ zIndex: 50 }}>
            {GRID_POSITIONS.map((subIdx, gridIdx) => (
              <div key={gridIdx} className="aspect-square">
                {subIdx === -1 ? (
                  <CoreGoalBlock subGoalProgress={subGoalProgress} subGoalLabels={subGoalLabels} />
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

      <DeepSpaceFireworks active={showFireworks} />

      <MissionAccomplished
        isOpen={showMissionComplete}
        onClose={dismissMission}
        showModal={showMissionModal}
      />
    </>
  );
}
