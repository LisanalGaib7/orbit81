/**
 * ProgressBar — Engineering gauge with 10% increment tick marks,
 * mission readout, and intensifying golden glow fill.
 */

import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
  showTicks?: boolean;
  barHeight?: string;
}

export function ProgressBar({ progress, className, showLabel = false, showTicks = true, barHeight = "h-5" }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Glow intensity increases at each 10% mark
  const glowIntensity = useMemo(() => {
    const tier = Math.floor(clampedProgress / 10);
    return 0.2 + tier * 0.08;
  }, [clampedProgress]);

  return (
    <div className={cn("w-full", className)}>
      {/* Engineering Gauge Bar */}
      <div className="relative">
        <div
          className={`progress-bar-3d ${barHeight} relative rounded-full overflow-hidden`}
          style={{ imageRendering: "pixelated" }}
        >
          {/* Fill with dynamic glow */}
          <div
            className="progress-fill-3d h-full"
            style={{
              width: `${clampedProgress}%`,
              imageRendering: "pixelated",
              boxShadow: `
                inset 0 1px 0 hsl(45 100% 70% / 0.6),
                inset 0 -1px 2px hsl(25 100% 30% / 0.5),
                0 0 ${12 + glowIntensity * 20}px hsl(38 100% 50% / ${glowIntensity})
              `,
            }}
          />

          {/* 10% Tick Marks */}
          {showTicks && Array.from({ length: 9 }, (_, i) => {
            const pct = (i + 1) * 10;
            const isReached = clampedProgress >= pct;
            return (
              <div
                key={pct}
                className="absolute top-0 bottom-0 w-px"
                style={{
                  left: `${pct}%`,
                  background: isReached
                    ? "hsl(45 100% 50% / 0.5)"
                    : "hsl(220 15% 30% / 0.6)",
                  zIndex: 2,
                }}
              >
                <div
                  className="absolute -top-px w-px h-1.5"
                  style={{
                    background: isReached
                      ? "hsl(45 100% 55%)"
                      : "hsl(220 10% 35%)",
                  }}
                />
                <div
                  className="absolute -bottom-px w-px h-1.5"
                  style={{
                    background: isReached
                      ? "hsl(45 100% 55%)"
                      : "hsl(220 10% 35%)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Tick labels below */}
        {showTicks && (
          <div className="relative w-full h-3 mt-0.5">
            {[0, 50, 100].map((pct) => (
              <span
                key={pct}
                className="absolute font-mono text-[7px] -translate-x-1/2"
                style={{
                  left: `${pct}%`,
                  color: clampedProgress >= pct
                    ? "hsl(45 100% 50%)"
                    : "hsl(220 10% 40%)",
                  textShadow: "1px 1px 0px #000000",
                  imageRendering: "pixelated",
                }}
              >
                {pct}
              </span>
            ))}
          </div>
        )}
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
