import { useEffect, useRef } from "react";
import { GoalCheckbox } from "./GoalCheckbox";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface ActionSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  blockIndex: number;
  label: string;
  actions: boolean[];
  actionLabels: string[];
  onToggle: (blockIndex: number, actionIndex: number) => void;
  onActionLabelChange: (blockIndex: number, actionIndex: number, label: string) => void;
}

export function ActionSidebar({
  isOpen,
  onClose,
  blockIndex,
  label,
  actions,
  actionLabels,
  onToggle,
  onActionLabelChange,
}: ActionSidebarProps) {
  const isMobile = useIsMobile();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first empty input when opening
  useEffect(() => {
    if (isOpen) {
      const firstEmptyIdx = actionLabels.findIndex((l) => !l);
      const targetIdx = firstEmptyIdx >= 0 ? firstEmptyIdx : 0;
      setTimeout(() => {
        inputRefs.current[targetIdx]?.focus();
      }, 100);
    }
  }, [isOpen, actionLabels]);

  const completedCount = actions.filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[85vh] rounded-t-2xl" : "w-[380px] sm:w-[420px]"}
      >
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <span className="text-primary font-bold">{label}</span>
            <span className="text-muted-foreground font-normal text-sm">
              ({completedCount}/8 complete)
            </span>
          </SheetTitle>
          <SheetDescription>
            Define your 8 action items for this sub-goal
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3 overflow-y-auto max-h-[calc(100%-100px)] pr-2">
          {Array.from({ length: 8 }, (_, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                actions[idx]
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-secondary/50 border border-border hover:border-muted-foreground/30"
              }`}
            >
              {/* Number badge */}
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
                  actions[idx]
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </span>

              {/* Input field */}
              <input
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                value={actionLabels[idx] || ""}
                onChange={(e) =>
                  onActionLabelChange(blockIndex, idx, e.target.value)
                }
                placeholder={`Action ${idx + 1}...`}
                className={`flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 ${
                  actions[idx] ? "line-through text-muted-foreground" : "text-foreground"
                }`}
                maxLength={50}
              />

              {/* Checkbox */}
              <GoalCheckbox
                checked={actions[idx]}
                onChange={() => onToggle(blockIndex, idx)}
                label={actionLabels[idx] || `Action ${idx + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Quick stats footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Progress: {Math.round((completedCount / 8) * 100)}%</span>
            <span className="font-mono text-primary">{completedCount}/8</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
