import { cn } from "@/lib/utils";

interface ProgressMilestonesProps {
  progress: number;
  className?: string;
}

const MILESTONES = [15, 30, 45, 60, 75, 90];

export function ProgressMilestones({ progress, className }: ProgressMilestonesProps) {
  return (
    <div className={cn("relative w-full h-4 flex items-center", className)}>
      {/* Track line */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border/50" />
      
      {/* Milestone markers */}
      {MILESTONES.map((milestone) => {
        const isActive = progress >= milestone;
        return (
          <div
            key={milestone}
            className="absolute -translate-x-1/2 flex flex-col items-center gap-1"
            style={{ left: `${milestone}%` }}
          >
            {/* Tick mark */}
            <div
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-500",
                isActive
                  ? "bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
                  : "bg-muted-foreground/30"
              )}
            />
            {/* Label */}
            <span
              className={cn(
                "text-[10px] font-mono transition-colors duration-500",
                isActive ? "text-primary" : "text-muted-foreground/50"
              )}
            >
              {milestone}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
