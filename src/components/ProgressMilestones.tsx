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
                "w-2.5 h-2.5 rounded-full transition-all duration-500 border-2",
                isActive
                  ? "bg-primary border-primary shadow-[0_0_10px_hsl(var(--primary)/0.7)]"
                  : "bg-transparent border-muted-foreground/40"
              )}
              style={{ imageRendering: "pixelated" }}
            />
            {/* Percentage Label */}
            <span
              className={cn(
                "text-[9px] font-pixel transition-colors duration-500",
                isActive ? "text-primary" : "text-muted-foreground/40"
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
