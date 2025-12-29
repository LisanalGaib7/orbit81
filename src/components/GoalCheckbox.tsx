import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function GoalCheckbox({ checked, onChange, label }: GoalCheckboxProps) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "checkbox-goal flex items-center justify-center",
        checked && "checked animate-check"
      )}
      aria-label={label || "Toggle action item"}
    >
      {checked && (
        <Check className="w-3 h-3 text-primary-foreground animate-scale-in" strokeWidth={3} />
      )}
    </button>
  );
}
