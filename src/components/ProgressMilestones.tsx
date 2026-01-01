import { cn } from "@/lib/utils";

interface ProgressMilestonesProps {
  progress: number;
  className?: string;
}

// Exact milestones as specified: 15%, 30%, 45%, 60%, 80%, 100%
const MILESTONES = [15, 30, 45, 60, 80, 100];

export function ProgressMilestones({ progress, className }: ProgressMilestonesProps) {
  return (
    <div className={cn("relative w-full h-8 mt-3", className)}>
      {/* Milestone markers */}
      {MILESTONES.map((milestone) => {
        const isActive = progress >= milestone;
        return (
          <div
            key={milestone}
            className="absolute -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ left: `${milestone}%` }}
          >
            {/* Tick mark / Dot */}
            <div
              className={cn(
                "w-2.5 h-2.5 milestone-dot transition-all duration-500",
                isActive ? "active" : "inactive"
              )}
              style={{ 
                imageRendering: "pixelated",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" // Diamond shape for pixel look
              }}
            />
            {/* Percentage Label */}
            <span
              className={cn(
                "font-pixel-mono text-sm milestone-marker transition-colors duration-500",
                isActive ? "active" : "inactive"
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