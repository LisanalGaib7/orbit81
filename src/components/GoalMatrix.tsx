import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { SubGoalBlock } from "./SubGoalBlock";
import { CoreGoalBlock } from "./CoreGoalBlock";
import { ProgressBar } from "./ProgressBar";
import { PixelRocket } from "./PixelRocket";
import { Starfield } from "./Starfield";
import { TemplateDropdown } from "./TemplateDropdown";
import { MissionAccomplished } from "./MissionAccomplished";
import { ActionSidebar } from "./ActionSidebar";

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

// localStorage keys
const STORAGE_KEYS = {
  actions: "goalMatrix_actions",
  labels: "goalMatrix_labels",
  actionLabels: "goalMatrix_actionLabels",
};

// Helper to ensure arrays are properly sized
const ensureArraySize = <T,>(arr: T[] | undefined, size: number, defaultValue: T): T[] => {
  if (!Array.isArray(arr) || arr.length < size) {
    return Array(size).fill(defaultValue);
  }
  return arr;
};

const ensure2DArraySize = <T,>(arr: T[][] | undefined, outerSize: number, innerSize: number, defaultValue: T): T[][] => {
  if (!Array.isArray(arr) || arr.length < outerSize) {
    return Array(outerSize).fill(null).map(() => Array(innerSize).fill(defaultValue));
  }
  return arr.map(inner => ensureArraySize(inner, innerSize, defaultValue));
};

export function GoalMatrix() {
  // State: 8 sub-goal blocks, each with 8 actions
  const [actions, setActions] = useState<boolean[][]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.actions);
      if (saved) {
        const parsed = JSON.parse(saved);
        return ensure2DArraySize(parsed, 8, 8, false);
      }
    } catch (e) {
      console.warn("Failed to parse saved actions, using defaults");
    }
    return Array(8).fill(null).map(() => Array(8).fill(false));
  });

  const [subGoalLabels, setSubGoalLabels] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.labels);
      if (saved) {
        const parsed = JSON.parse(saved);
        return ensureArraySize(parsed, 8, "Goal");
      }
    } catch (e) {
      console.warn("Failed to parse saved labels, using defaults");
    }
    return [...DEFAULT_SUBGOALS];
  });

  // Action item labels: 8 sub-goals × 8 actions
  const [actionLabels, setActionLabels] = useState<string[][]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.actionLabels);
      if (saved) {
        const parsed = JSON.parse(saved);
        return ensure2DArraySize(parsed, 8, 8, "");
      }
    } catch (e) {
      console.warn("Failed to parse saved action labels, using defaults");
    }
    return Array(8).fill(null).map(() => Array(8).fill(""));
  });

  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [completedSubGoals, setCompletedSubGoals] = useState<Set<number>>(new Set());
  const prevCompletedRef = useRef<Set<number>>(new Set());

  // Active block for sidebar
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.labels, JSON.stringify(subGoalLabels));
  }, [subGoalLabels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.actionLabels, JSON.stringify(actionLabels));
  }, [actionLabels]);

  // Toggle a specific action
  const toggleAction = useCallback((blockIndex: number, actionIndex: number) => {
    setActions(prev => {
      const newActions = prev.map(block => [...block]);
      newActions[blockIndex][actionIndex] = !newActions[blockIndex][actionIndex];
      return newActions;
    });
  }, []);

  // Update a sub-goal label
  const updateLabel = useCallback((index: number, newLabel: string) => {
    setSubGoalLabels(prev => {
      const newLabels = [...prev];
      newLabels[index] = newLabel;
      return newLabels;
    });
  }, []);

  // Update an action label
  const updateActionLabel = useCallback((blockIndex: number, actionIndex: number, label: string) => {
    setActionLabels(prev => {
      const newLabels = prev.map(block => [...block]);
      newLabels[blockIndex][actionIndex] = label;
      return newLabels;
    });
  }, []);

  // Apply template
  const applyTemplate = useCallback((labels: string[]) => {
    setSubGoalLabels(labels);
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

  // Track newly completed sub-goals for confetti
  useEffect(() => {
    const newCompleted = new Set<number>();
    subGoalProgress.forEach((progress, idx) => {
      if (progress === 100) newCompleted.add(idx);
    });

    // Find newly completed
    newCompleted.forEach(idx => {
      if (!prevCompletedRef.current.has(idx)) {
        setCompletedSubGoals(prev => new Set(prev).add(idx));
      }
    });

    prevCompletedRef.current = newCompleted;
  }, [subGoalProgress]);

  // Clear confetti after animation
  const clearConfetti = useCallback((idx: number) => {
    setCompletedSubGoals(prev => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  }, []);

  // Check for mission complete
  useEffect(() => {
    if (globalProgress === 100) {
      setShowMissionComplete(true);
    }
  }, [globalProgress]);

  const completedCount = actions.flat().filter(Boolean).length;

  // Grid positions: 0-7 are sub-goals, 4 is center (core goal)
  // Layout: [0][1][2] / [3][C][4] / [5][6][7]
  const gridPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7];

  return (
    <>
      <Starfield progress={globalProgress} />
      
      <div className="relative z-10 flex flex-col items-center gap-6 p-4 sm:p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Goal Matrix <span className="text-primary">Engine</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Break down your core goal into 8 sub-goals, each with 8 actionable steps
          </p>
        </div>

        {/* Template Button */}
        <TemplateDropdown onSelect={applyTemplate} />

        {/* Global Progress with Rocket */}
        <div className="w-full max-w-md space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Progress</span>
            <span className="font-mono text-primary font-semibold">
              {completedCount}/64 <span className="text-muted-foreground">({Math.round(globalProgress)}%)</span>
            </span>
          </div>
          
          {/* Rocket above progress bar */}
          <div className="flex justify-center pb-2">
            <PixelRocket progress={globalProgress} />
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
                  actionLabels={actionLabels[subIdx]}
                  onToggle={toggleAction}
                  label={subGoalLabels[subIdx]}
                  onLabelChange={(newLabel) => updateLabel(subIdx, newLabel)}
                  showConfetti={completedSubGoals.has(subIdx)}
                  onConfettiComplete={() => clearConfetti(subIdx)}
                  isActive={activeBlockIndex === subIdx}
                  isDimmed={activeBlockIndex !== null && activeBlockIndex !== subIdx}
                  onBlockClick={() => setActiveBlockIndex(subIdx)}
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

      {/* Action Sidebar */}
      {activeBlockIndex !== null && (
        <ActionSidebar
          isOpen={activeBlockIndex !== null}
          onClose={() => setActiveBlockIndex(null)}
          blockIndex={activeBlockIndex}
          label={subGoalLabels[activeBlockIndex]}
          actions={actions[activeBlockIndex]}
          actionLabels={actionLabels[activeBlockIndex]}
          onToggle={toggleAction}
          onActionLabelChange={updateActionLabel}
        />
      )}

      <MissionAccomplished 
        isOpen={showMissionComplete} 
        onClose={() => setShowMissionComplete(false)} 
      />
    </>
  );
}
