import { GoalCheckbox } from "./GoalCheckbox";
import { EditableLabel } from "./EditableLabel";
import { PixelConfetti } from "./PixelConfetti";

interface SubGoalBlockProps {
  blockIndex: number;
  actions: boolean[];
  onToggle: (blockIndex: number, actionIndex: number) => void;
  label: string;
  onLabelChange: (newLabel: string) => void;
  showConfetti?: boolean;
  onConfettiComplete?: () => void;
}

export function SubGoalBlock({ 
  blockIndex, 
  actions, 
  onToggle, 
  label, 
  onLabelChange,
  showConfetti = false,
  onConfettiComplete,
}: SubGoalBlockProps) {
  // Create a 3x3 grid where center is the label
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1 is center (label)

  return (
    <div className="goal-block goal-block-sub p-2 relative">
      <PixelConfetti trigger={showConfetti} onComplete={onConfettiComplete} />
      
      <div className="grid grid-cols-3 gap-1">
        {actionPositions.map((actionIdx, gridIdx) => (
          <div
            key={gridIdx}
            className="tile-cell aspect-square flex items-center justify-center"
          >
            {actionIdx === -1 ? (
              <EditableLabel
                value={label}
                onChange={onLabelChange}
                className="text-[10px] sm:text-xs font-medium leading-tight px-0.5 w-full"
              />
            ) : (
              <GoalCheckbox
                checked={actions[actionIdx]}
                onChange={() => onToggle(blockIndex, actionIdx)}
                label={`Action ${actionIdx + 1} for ${label}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
