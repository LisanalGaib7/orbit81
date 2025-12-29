import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  size?: "sm" | "md";
}

export function GoalCheckbox({ checked, onChange, label, size = "md" }: GoalCheckboxProps) {
  const sizeClasses = size === "sm" 
    ? "w-3.5 h-3.5 sm:w-4 sm:h-4" 
    : "w-5 h-5";
  
  const iconSize = size === "sm" ? "w-2 h-2 sm:w-2.5 sm:h-2.5" : "w-3 h-3";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
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
  );
}
