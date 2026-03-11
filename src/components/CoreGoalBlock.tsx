import { Target } from "lucide-react";

interface CoreGoalBlockProps {
  subGoalProgress: number[];
  subGoalLabels: string[];
}

export function CoreGoalBlock({ subGoalProgress, subGoalLabels }: CoreGoalBlockProps) {
  // Positions match the visual layout of sub-goal blocks around the center
  // 0=top-left, 1=top-center, 2=top-right, 3=middle-left, 4=middle-right, 5=bottom-left, 6=bottom-center, 7=bottom-right
  const positions = [0, 1, 2, 3, -1, 4, 5, 6, 7];

  return (
    <div className="goal-block goal-block-core p-2">
      <div className="grid grid-cols-3 gap-1">
        {positions.map((subIdx, gridIdx) => (
          <div
            key={gridIdx}
            className="tile-cell aspect-square flex flex-col items-center justify-center gap-1"
          >
            {subIdx === -1 ? (
              <div className="flex flex-col items-center gap-1">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary glow-text" />
                <span className="text-[9px] sm:text-[10px] font-semibold text-primary uppercase tracking-wider">
                  Core
                </span>
              </div>
            ) : (
              <>
                <span className="text-[8px] sm:text-[9px] text-muted-foreground text-center leading-tight line-clamp-2 px-0.5">
                  {subGoalLabels[subIdx]}
                </span>
                <ProgressBar progress={subGoalProgress[subIdx]} className="w-full" />
                <span className="text-[9px] sm:text-[10px] font-mono text-primary font-medium">
                  {Math.round(subGoalProgress[subIdx])}%
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
