import { useEffect, useRef, useState, useCallback, memo } from "react";
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

// Memoized action item to prevent unnecessary re-renders
const ActionItem = memo(function ActionItem({
  idx,
  blockIndex,
  isChecked,
  initialLabel,
  onToggle,
  onLabelSync,
  inputRef,
}: {
  idx: number;
  blockIndex: number;
  isChecked: boolean;
  initialLabel: string;
  onToggle: (blockIndex: number, actionIndex: number) => void;
  onLabelSync: (blockIndex: number, actionIndex: number, label: string) => void;
  inputRef: (el: HTMLInputElement | null) => void;
}) {
  // Local state for immediate input responsiveness
  const [localValue, setLocalValue] = useState(initialLabel);

  // Sync local state when prop changes (e.g., switching blocks)
  useEffect(() => {
    setLocalValue(initialLabel);
  }, [initialLabel]);

  // Sync to global state on blur
  const handleBlur = useCallback(() => {
    if (localValue !== initialLabel) {
      onLabelSync(blockIndex, idx, localValue);
    }
  }, [localValue, initialLabel, blockIndex, idx, onLabelSync]);

  // Handle Enter key to move to next input or blur
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }, []);

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
        isChecked
          ? "bg-primary/10 border border-primary/30"
          : "bg-secondary/50 border border-border hover:border-muted-foreground/30"
      }`}
    >
      {/* Number badge */}
      <span
        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono ${
          isChecked
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {idx + 1}
      </span>

      {/* Input field with local state */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={`Action ${idx + 1}...`}
        className={`flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 ${
          isChecked ? "line-through text-muted-foreground" : "text-foreground"
        }`}
        maxLength={50}
      />

      {/* Checkbox */}
      <GoalCheckbox
        checked={isChecked}
        onChange={() => onToggle(blockIndex, idx)}
        label={localValue || `Action ${idx + 1}`}
      />
    </div>
  );
});

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
  }, [isOpen, blockIndex]); // Only re-run when sidebar opens or block changes

  const completedCount = actions.filter(Boolean).length;

  // Stable callback ref setter
  const setInputRef = useCallback((idx: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[idx] = el;
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[85vh] rounded-t-2xl" : "w-[380px] sm:w-[420px] border-l border-border/50 shadow-2xl"}
        hideOverlay
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
            <ActionItem
              key={`${blockIndex}-${idx}`}
              idx={idx}
              blockIndex={blockIndex}
              isChecked={actions[idx] ?? false}
              initialLabel={actionLabels[idx] ?? ""}
              onToggle={onToggle}
              onLabelSync={onActionLabelChange}
              inputRef={setInputRef(idx)}
            />
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
