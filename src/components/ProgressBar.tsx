import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, className, showLabel = false }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="progress-bar-3d h-4"
        style={{ imageRendering: 'pixelated' }}
      >
        <div
          className="progress-fill-3d h-full"
          style={{ 
            width: `${clampedProgress}%`,
            imageRendering: 'pixelated'
          }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-right">
          <span className="pixel-gold-stat text-lg">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
}