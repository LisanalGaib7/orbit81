import { cn } from "@/lib/utils";

interface ProgressMilestonesProps {
  progress: number;
  className?: string;
}

// Exact milestones as specified: 15%, 30%, 45%, 60%, 80%, 100%
const MILESTONES = [15, 30, 45, 60, 80, 100];

export function ProgressMilestones({ progress, className }: ProgressMilestonesProps) {
  return (
    <div className={cn("relative w-full h-10 mt-2", className)}>
      {/* Milestone markers */}
      {MILESTONES.map((milestone) => {
        const isActive = progress >= milestone;
        return (
          <div
            key={milestone}
            className="absolute -translate-x-1/2 flex flex-col items-center gap-0.5"
            style={{ left: `${milestone}%` }}
          >
            {/* Tick mark / Diamond Dot */}
            <div
              className={cn(
                "w-3 h-3 transition-all duration-500",
                isActive ? "milestone-dot-active" : "milestone-dot-inactive"
              )}
              style={{ 
                imageRendering: "pixelated",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
              }}
            />
            {/* Percentage Label */}
            <span
              className={cn(
                "font-pixel-mono text-base transition-all duration-500",
                isActive ? "milestone-label-active" : "milestone-label-inactive"
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