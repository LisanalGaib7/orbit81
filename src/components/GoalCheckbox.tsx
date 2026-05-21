import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface GoalCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: "sm" | "md";
}

export const GoalCheckbox = memo(function GoalCheckbox({ checked, onChange, label, size = "md" }: GoalCheckboxProps) {
  const sizeClasses = size === "sm"
    ? "w-5 h-5 sm:w-4 sm:h-4"
    : "w-6 h-6 sm:w-5 sm:h-5";

  const iconSize = size === "sm" ? "w-3 h-3 sm:w-2.5 sm:h-2.5" : "w-3.5 h-3.5 sm:w-3 sm:h-3";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange();
  };

  return (
    // wrapper div 전체가 터치 타겟 — 버튼 밖 클릭도 올바르게 toggle
    <div
      className="relative flex items-center justify-center min-w-[48px] min-h-[48px] sm:min-w-0 sm:min-h-0"
      onClick={handleClick}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={handleClick}
        className={cn(
          "checkbox-goal flex items-center justify-center",
          sizeClasses,
          checked && "checked animate-check"
        )}
        aria-label={label || "Toggle action item"}
      >
        {checked && (
          <Check className={cn(iconSize, "text-primary-foreground animate-scale-in")} strokeWidth={3} />
        )}
      </button>
    </div>
  );
});
