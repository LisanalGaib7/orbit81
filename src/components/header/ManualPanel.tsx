/**
 * ManualPanel — "Mission Manual" modal launched from the HeaderBar hub.
 *
 * WHY: Self-contained portal modal. Extracted from HeaderBar.tsx to keep the
 * settings hub focused on menu orchestration. Props: open state + onClose.
 */

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export function ManualPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const justOpened = useRef(false);

  useEffect(() => {
    if (isOpen) {
      justOpened.current = true;
      // double-rAF: 모바일에서 단일 rAF가 너무 빨리 클리어되는 문제 방지
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { justOpened.current = false; });
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: PointerEvent) => {
      if (justOpened.current) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100001]">
      {/* Backdrop — closes on tap */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Centered modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-auto w-full max-w-md max-h-[85vh] rounded-xl bg-background/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Sticky header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-background/90 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-header)", textShadow: "1px 1px 0px #000" }}>
              Mission Manual
            </h3>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            <div>
              <h4 className="font-bold text-foreground mb-1.5 text-xs" style={{ fontFamily: "var(--font-data)" }}>
                The 81-Square Method
              </h4>
              <p className="text-sm leading-relaxed">
                Break down your core goal into 8 sub-goals, each with 8 actionable steps.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1.5 text-xs" style={{ fontFamily: "var(--font-data)" }}>
                How to Use
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click any sub-goal block to expand</li>
                <li>Double-click labels to rename</li>
                <li>Check off actions to fuel your rocket</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1.5 text-xs" style={{ fontFamily: "var(--font-data)" }}>
                Launch Sequence
              </h4>
              <p className="text-sm leading-relaxed">At 100%, witness the grand liftoff!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
