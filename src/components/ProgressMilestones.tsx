/**
 * ProgressMilestones — Diamond markers at key progress thresholds.
 *
 * WHY: Visual feedback showing which milestone stages have been cleared.
 * Milestone values are sourced from constants/missionData.ts.
 */

import { cn } from "@/lib/utils";
import { MILESTONES } from "@/constants/missionData";

interface ProgressMilestonesProps {
  progress: number;
  className?: string;
}

export function ProgressMilestones({ progress, className }: ProgressMilestonesProps) {
  return (
    <div className={cn("relative w-full h-10 mt-2", className)}>
      {MILESTONES.map((milestone) => {
        const isActive = progress >= milestone;
        return (
          <div
            key={milestone}
            className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5"
            style={{ left: `${milestone}%` }}
          >
            <div
              className={cn(
                "w-3 h-3 transition-all duration-500",
                isActive ? "milestone-dot-active" : "milestone-dot-inactive",
              )}
              style={{
                imageRendering: "pixelated",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              }}
            />
            <span
              className={cn(
                "font-pixel-mono text-base transition-all duration-500",
                isActive ? "milestone-label-active" : "milestone-label-inactive",
              )}
              style={{ imageRendering: "pixelated" }}
            >
              {milestone}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
