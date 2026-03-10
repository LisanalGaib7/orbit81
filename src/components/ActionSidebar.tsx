/**
 * ActionSidebar — Slide-out task drawer for editing a sub-goal's 8 actions.
 *
 * WHY: Provides a focused editing surface for naming and toggling individual
 * action items within a selected sub-goal block. Uses Sheet (Radix) to
 * support both mobile (bottom) and desktop (right) placement.
 */

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { GoalCheckbox } from "./GoalCheckbox";
import { useIsMobile } from "@/hooks/use-mobile";
import { generateActionId, getPrefix } from "@/lib/goalIds";
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
  focusActionIndex?: number | null;
}

/** Single action row — memoised to avoid re-renders across siblings. */
const ActionItem = memo(function ActionItem({
  idx,
  blockIndex,
  isChecked,
  initialLabel,
  actionId,
  onToggle,
  onLabelSync,
  inputRef,
  isHighlighted,
}: {
  idx: number;
  blockIndex: number;
  isChecked: boolean;
  initialLabel: string;
  actionId: string;
  onToggle: (blockIndex: number, actionIndex: number) => void;
  onLabelSync: (blockIndex: number, actionIndex: number, label: string) => void;
  inputRef: (el: HTMLInputElement | null) => void;
  isHighlighted: boolean;
}) {
  const [localValue, setLocalValue] = useState(initialLabel);

  useEffect(() => { setLocalValue(initialLabel); }, [initialLabel]);

  const handleBlur = useCallback(() => {
    if (localValue !== initialLabel) onLabelSync(blockIndex, idx, localValue);
  }, [localValue, initialLabel, blockIndex, idx, onLabelSync]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") e.currentTarget.blur();
  }, []);

  return (
    <div
      className={`flex items-center gap-3 p-3 pr-4 rounded-lg transition-all ${
        isHighlighted
          ? "ring-2 ring-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)] bg-primary/15 border border-primary/50"
          : isChecked
            ? "bg-primary/10 border border-primary/30"
            : "bg-secondary/50 border border-border hover:border-muted-foreground/30"
      }`}
    >
      {/* ID badge */}
      <span
        className="flex-shrink-0 min-w-[52px] px-1.5 py-0.5 rounded text-[11px] font-bold tracking-tight text-center"
        style={{
          fontFamily: "var(--font-data)",
          textShadow: "1px 1px 0px #000000",
          color: isChecked ? "hsl(var(--primary-foreground))" : "hsl(var(--primary))",
          background: isChecked ? "hsl(var(--primary))" : "hsl(var(--muted))",
        }}
      >
        {actionId}
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={`Action ${idx + 1}...`}
        className={`flex-1 min-w-0 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 ${
          isChecked ? "line-through text-muted-foreground" : "text-foreground"
        }`}
        style={{ fontFamily: "var(--font-body)" }}
        maxLength={50}
      />

      {/* Checkbox */}
      <div className="flex-shrink-0" style={{ minWidth: "24px" }}>
        <GoalCheckbox
          checked={isChecked}
          onChange={() => onToggle(blockIndex, idx)}
          label={localValue || `Action ${idx + 1}`}
        />
      </div>
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
  focusActionIndex = null,
}: ActionSidebarProps) {
  const isMobile = useIsMobile();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const prefix = getPrefix(label);

  useEffect(() => {
    if (isOpen) {
      const targetIdx = focusActionIndex ?? actionLabels.findIndex((l) => !l);
      const idx = targetIdx >= 0 ? targetIdx : 0;
      setTimeout(() => {
        inputRefs.current[idx]?.focus();
        inputRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
    }
  }, [isOpen, blockIndex, focusActionIndex]);

  const completedCount = actions.filter(Boolean).length;

  const setInputRef = useCallback(
    (idx: number) => (el: HTMLInputElement | null) => { inputRefs.current[idx] = el; },
    [],
  );

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()} modal={false}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={isMobile ? "h-[85vh] rounded-t-2xl" : "w-[380px] sm:w-[420px] border-l border-border/50 shadow-2xl"}
        hideOverlay
      >
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <span className="font-bold text-base text-primary" style={{ fontFamily: "var(--font-data)", textShadow: "1px 1px 0px #000000" }}>
              [{prefix}]
            </span>
            <span className="font-bold uppercase tracking-wider text-sm text-primary" style={{ fontFamily: "var(--font-header)" }}>
              {label}
            </span>
            <span className="text-muted-foreground font-normal text-xs" style={{ fontFamily: "var(--font-body)" }}>
              ({completedCount}/8)
            </span>
          </SheetTitle>
          <SheetDescription style={{ fontFamily: "var(--font-data)" }} className="text-xs">
            Mission Control — {prefix}-01 to {prefix}-08
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3 overflow-y-auto pb-16 pr-1" style={{ maxHeight: "calc(100% - 100px)" }}>
          {Array.from({ length: 8 }, (_, idx) => (
            <ActionItem
              key={`${blockIndex}-${idx}`}
              idx={idx}
              blockIndex={blockIndex}
              isChecked={actions[idx] ?? false}
              initialLabel={actionLabels[idx] ?? ""}
              actionId={generateActionId(label, idx)}
              onToggle={onToggle}
              onLabelSync={onActionLabelChange}
              inputRef={setInputRef(idx)}
              isHighlighted={focusActionIndex === idx}
            />
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent">
          <div className="flex justify-between items-center text-xs text-muted-foreground" style={{ fontFamily: "var(--font-data)" }}>
            <span>Progress: {Math.round((completedCount / 8) * 100)}%</span>
            <span className="text-primary">{completedCount}/8</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
