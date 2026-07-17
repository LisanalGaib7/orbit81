import { useEffect, useRef } from "react";

/**
 * useClickOutside — closes a panel/modal when a pointerdown lands outside `ref`.
 *
 * WHY: ManualPanel and TemplatePanel both duplicated this exact pattern:
 * a `justOpened` guard (cleared via double-rAF) so the same pointerdown/click
 * that opened the panel doesn't immediately close it again (matters most on
 * mobile), plus a pointerdown listener registered only while `enabled`.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  onOutside: () => void,
  enabled: boolean,
): void {
  const justOpened = useRef(false);

  useEffect(() => {
    if (enabled) {
      justOpened.current = true;
      // double-rAF: 모바일에서 단일 rAF가 너무 빨리 클리어되는 문제 방지
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { justOpened.current = false; });
      });
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handler = (e: PointerEvent) => {
      if (justOpened.current) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [enabled, onOutside, ref]);
}
