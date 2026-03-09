import { GoalCheckbox } from "./GoalCheckbox";
import { EditableLabel } from "./EditableLabel";
import { PixelConfetti } from "./PixelConfetti";
import { generateActionId, getPrefix } from "@/lib/goalIds";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onBlockClick?: () => void;
  onActionClick?: (blockIndex: number, actionIndex: number) => void;
}

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
  onBlockClick,
  onActionClick,
}: SubGoalBlockProps) {
  const actionPositions = [0, 1, 2, 3, -1, 4, 5, 6, 7];
  const safeActions = actions ?? DEFAULT_ACTIONS;
  const safeActionLabels = actionLabels ?? DEFAULT_ACTION_LABELS;

  const handleBlockClick = (e: React.MouseEvent) => {
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

  const handleActionSlotClick = (actionIdx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onActionClick?.(blockIndex, actionIdx);
  };

  if (!Array.isArray(safeActions) || safeActions.length < 8) {
    return (
      <div className="goal-block goal-block-sub p-2 flex items-center justify-center">
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div 
        className={`goal-block goal-block-sub p-2 relative cursor-pointer transition-all duration-300 ${
          isActive 
            ? "ring-2 ring-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] scale-[1.02]" 
            : "hover:ring-1 hover:ring-primary/30"
        }`}
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
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="relative w-full h-full flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-primary/10 rounded transition-colors"
                      onClick={(e) => handleActionSlotClick(actionIdx, e)}
                    >
                      {/* ID Code - monospaced terminal style */}
                      <span 
                        className={`font-mono text-[7px] sm:text-[9px] font-bold tracking-tight leading-none ${
                          safeActions[actionIdx] 
                            ? "text-primary/50 line-through" 
                            : "text-[#FFD700]"
                        }`}
                        style={{ 
                          textShadow: '1px 1px 0px #000000',
                          imageRendering: 'auto' as any 
                        }}
                      >
                        {generateActionId(label, actionIdx)}
                      </span>
                      
                      <GoalCheckbox
                        checked={Boolean(safeActions[actionIdx])}
                        onChange={() => onToggle(blockIndex, actionIdx)}
                        label={safeActionLabels[actionIdx] || `Action ${actionIdx + 1} for ${label}`}
                        size="sm"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="max-w-[200px] text-xs font-mono"
                    sideOffset={5}
                  >
                    <span className="text-[#FFD700] font-bold">[{generateActionId(label, actionIdx)}]</span>{" "}
                    {safeActionLabels[actionIdx] || "Click to define action"}
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
