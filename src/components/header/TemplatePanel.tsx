/**
 * TemplatePanel — goal-template picker launched from the HeaderBar hub.
 *
 * WHY: Self-contained. Renders a centered portal modal on mobile and an
 * inline fly-out (positioned by its HeaderBar parent's `relative` wrapper)
 * on desktop. Extracted from HeaderBar.tsx. Props: open state, onClose,
 * and onSelect(labels) to apply a template.
 */

import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TEMPLATES } from "@/constants/missionData";
import { useIsMobile } from "@/hooks/use-mobile";

export function TemplatePanel({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (labels: string[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
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

  if (isMobile) {
    if (!isOpen) return null;
    return createPortal(
      <div className="fixed inset-0 z-[100001]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-auto w-full max-w-xs rounded-xl bg-background/95 backdrop-blur-md shadow-2xl overflow-hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
              <h3 className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-header)", textShadow: "1px 1px 0px #000" }}>
                Templates
              </h3>
              <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-1 max-h-[60vh] overflow-y-auto">
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => { onSelect(t.labels); onClose(); }}
                  className="w-full text-left px-3 py-3 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded min-h-[48px]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-full top-0 mr-3 z-[1000] w-56 rounded-lg bg-background/80 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          <div className="p-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => { onSelect(t.labels); onClose(); }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
