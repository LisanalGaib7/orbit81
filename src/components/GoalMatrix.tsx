import { useState, useCallback, useMemo } from "react";
import { SubGoalBlock } from "./SubGoalBlock";
import { CoreGoalBlock } from "./CoreGoalBlock";
import { ProgressBar } from "./ProgressBar";

// Default sub-goal labels
const DEFAULT_SUBGOALS = [
  "Health",
  "Career",
  "Finance",
  "Learning",
  "Relationships",
  "Creativity",
  "Mindfulness",
  "Adventure",
];

export function GoalMatrix() {
  // State: 8 sub-goal blocks, each with 8 actions
  const [actions, setActions] = useState<boolean[][]>(
    Array(8).fill(null).map(() => Array(8).fill(false))
  );

  const [subGoalLabels] = useState(DEFAULT_SUBGOALS);

  // Toggle a specific action
  const toggleAction = useCallback((blockIndex: number, actionIndex: number) => {
    setActions(prev => {
      const newActions = prev.map(block => [...block]);
      newActions[blockIndex][actionIndex] = !newActions[blockIndex][actionIndex];
      return newActions;
    });
  }, []);

  // Calculate progress for each sub-goal
  const subGoalProgress = useMemo(() => {
    return actions.map(block => {
      const completed = block.filter(Boolean).length;
      return (completed / 8) * 100;
    });
  }, [actions]);

  // Calculate global progress
  const globalProgress = useMemo(() => {
    const totalCompleted = actions.flat().filter(Boolean).length;
    return (totalCompleted / 64) * 100;
  }, [actions]);

  const completedCount = actions.flat().filter(Boolean).length;

  // Grid positions: 0-7 are sub-goals, 4 is center (core goal)
  // Layout: [0][1][2] / [3][C][4] / [5][6][7]
  const gridPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7];

  return (
    <div className="flex flex-col items-center gap-6 p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Goal Matrix <span className="text-primary">Engine</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Break down your core goal into 8 sub-goals, each with 8 actionable steps
        </p>
      </div>

      {/* Global Progress */}
      <div className="w-full max-w-md space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Progress</span>
          <span className="font-mono text-primary font-semibold">
            {completedCount}/64 <span className="text-muted-foreground">({Math.round(globalProgress)}%)</span>
          </span>
        </div>
        <ProgressBar progress={globalProgress} className="h-2" />
      </div>

      {/* Matrix Grid */}
      <div className="goal-grid w-full aspect-square max-w-2xl">
        {gridPositions.map((subIdx, gridIdx) => (
          <div key={gridIdx} className="aspect-square">
            {subIdx === -1 ? (
              <CoreGoalBlock 
                subGoalProgress={subGoalProgress}
                subGoalLabels={subGoalLabels}
              />
            ) : (
              <SubGoalBlock
                blockIndex={subIdx}
                actions={actions[subIdx]}
                onToggle={toggleAction}
                label={subGoalLabels[subIdx]}
              />
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
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
  );
}
