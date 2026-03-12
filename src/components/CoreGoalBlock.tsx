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
    <div className="goal-block goal-block-core p-2">
      <div className="grid grid-cols-3 gap-1">
        {positions.map((subIdx, gridIdx) => (
          <div
            key={gridIdx}
            className="tile-cell aspect-square flex flex-col items-center justify-center gap-1"
          >
            {subIdx === -1 ? (
              <div className="flex flex-col items-center justify-center gap-1.5 w-full h-full">
                <Target className="w-6 h-6 sm:w-7 sm:h-7 text-primary glow-text animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-semibold text-primary uppercase tracking-wider">
                  Core
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-between w-full h-full py-1">
                <span className="text-[8px] sm:text-[9px] text-muted-foreground text-center leading-tight line-clamp-2 px-0.5 flex-1 flex items-center">
                  {subGoalLabels[subIdx]}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-primary font-medium mb-1">
                  {Math.round(subGoalProgress[subIdx])}%
                </span>
                <ProgressBar progress={subGoalProgress[subIdx]} className="w-[90%] mb-0.5" showTicks={false} slim />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
