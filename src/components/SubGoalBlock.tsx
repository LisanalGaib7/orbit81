import { GoalCheckbox } from "./GoalCheckbox";

interface SubGoalBlockProps {
  blockIndex: number;
  actions: boolean[];
  onToggle: (blockIndex: number, actionIndex: number) => void;
  label: string;
}

export function SubGoalBlock({ blockIndex, actions, onToggle, label }: SubGoalBlockProps) {
  // Create a 3x3 grid where center is the label
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7]; // -1 is center (label)

  return (
    <div className="goal-block goal-block-sub p-2">
      <div className="grid grid-cols-3 gap-1">
        {actionPositions.map((actionIdx, gridIdx) => (
          <div
            key={gridIdx}
            className="tile-cell aspect-square flex items-center justify-center"
          >
            {actionIdx === -1 ? (
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground text-center leading-tight px-0.5">
                {label}
              </span>
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
