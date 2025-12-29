import { GoalCheckbox } from "./GoalCheckbox";
import { EditableLabel } from "./EditableLabel";
import { PixelConfetti } from "./PixelConfetti";
import { Plus } from "lucide-react";

interface SubGoalBlockProps {
  blockIndex: number;
  actions?: boolean[];
  actionLabels?: string[];
  onToggle: (blockIndex: number, actionIndex: number) => void;
  label: string;
  onLabelChange: (newLabel: string) => void;
  showConfetti?: boolean;
  onConfettiComplete?: () => void;
  isActive?: boolean;
  isDimmed?: boolean;
  onBlockClick?: () => void;
}

// Default arrays for fallback
const DEFAULT_ACTIONS = Array(8).fill(false);
const DEFAULT_ACTION_LABELS = Array(8).fill("");

export function SubGoalBlock({ 
  blockIndex, 
  actions = DEFAULT_ACTIONS,
  actionLabels = DEFAULT_ACTION_LABELS,
  onToggle, 
  label = "Goal", 
  onLabelChange,
  showConfetti = false,
  onConfettiComplete,
  isActive = false,
  isDimmed = false,
  onBlockClick,
}: SubGoalBlockProps) {
  // Create a 3x3 grid where center is the label
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1 is center (label)

  // Ensure arrays are valid with defensive fallbacks
  const safeActions = actions ?? DEFAULT_ACTIONS;
  const safeActionLabels = actionLabels ?? DEFAULT_ACTION_LABELS;

  const handleBlockClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on checkbox or editable label
    const target = e.target as HTMLElement;
    if (
      target.closest('.checkbox-goal') || 
      target.closest('input') || 
      target.closest('button')
    ) {
      return;
    }
    onBlockClick?.();
  };

  // Fallback UI if data is completely missing
  if (!Array.isArray(safeActions) || safeActions.length < 8) {
    return (
      <div className="goal-block goal-block-sub p-2 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div 
      className={`goal-block goal-block-sub p-2 relative cursor-pointer transition-all duration-300 ${
        isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
      } ${isDimmed ? "opacity-40 scale-[0.98]" : ""}`}
      onClick={handleBlockClick}
    >
      <PixelConfetti trigger={showConfetti} onComplete={onConfettiComplete} />
      
      <div className="grid grid-cols-3 gap-1">
        {actionPositions.map((actionIdx, gridIdx) => (
          <div
            key={gridIdx}
            className="tile-cell aspect-square flex items-center justify-center overflow-hidden"
          >
            {actionIdx === -1 ? (
              <EditableLabel
                value={label || "Goal"}
                onChange={onLabelChange}
                className="text-[10px] sm:text-xs font-medium leading-tight px-0.5 w-full"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center gap-0.5">
                {/* Action label keyword */}
                {safeActionLabels[actionIdx] ? (
                  <span 
                    className={`text-[7px] sm:text-[8px] text-center leading-tight px-0.5 truncate w-full ${
                      safeActions[actionIdx] ? "text-primary line-through opacity-60" : "text-muted-foreground"
                    }`}
                    title={safeActionLabels[actionIdx]}
                  >
                    {safeActionLabels[actionIdx]}
                  </span>
                ) : (
                  <Plus className="w-2.5 h-2.5 text-muted-foreground/40" />
                )}
                
                <GoalCheckbox
                  checked={Boolean(safeActions[actionIdx])}
                  onChange={() => onToggle(blockIndex, actionIdx)}
                  label={safeActionLabels[actionIdx] || `Action ${actionIdx + 1} for ${label}`}
                  size="sm"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
