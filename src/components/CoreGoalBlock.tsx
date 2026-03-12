import { ProgressBar } from "./ProgressBar";
import { Target } from "lucide-react";

interface CoreGoalBlockProps {
  subGoalProgress: number[];
  subGoalLabels: string[];
  coreProgress?: number;
}

export function CoreGoalBlock({ subGoalProgress, subGoalLabels, coreProgress = 0 }: CoreGoalBlockProps) {
  const positions = [0, 1, 2, 3, -1, 4, 5, 6, 7];

  return (
    <div className="goal-block goal-block-core p-2 aspect-square flex flex-col justify-center">
      <div className="grid grid-cols-3 gap-2 sm:gap-1 w-full h-full">
        {positions.map((subIdx, gridIdx) => (
          <div
            key={gridIdx}
            className="tile-cell aspect-square flex flex-col items-center justify-evenly overflow-hidden px-0.5"
          >
            {subIdx === -1 ? (
              <div className="flex flex-col items-center justify-center gap-1.5 w-full h-full">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-primary glow-text animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Core
                </span>
              </div>
            ) : (
              <>
                <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground text-center leading-tight line-clamp-2 px-0.5">
                  {subGoalLabels[subIdx]}
                </span>
                <ProgressBar progress={subGoalProgress[subIdx]} className="w-3/4" showTicks={false} barHeight="h-3" />
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
