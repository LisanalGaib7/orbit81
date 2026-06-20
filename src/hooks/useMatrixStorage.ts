/**
 * useMatrixStorage — Persistence layer for the Orbit 81 matrix.
 *
 * WHY: Separates localStorage read/write logic from business logic in
 * useMissionProgress. Handles user-isolated keys and one-time migration
 * from legacy generic keys.
 *
 * KEY DESIGN: persist effects depend ONLY on data (not on keys).
 * Keys are accessed via ref so they're always current without being
 * listed as deps — this prevents persist effects from firing when
 * userId changes and overwriting good data with stale state.
 */

import { useState, useEffect, useMemo, useRef } from "react";
import {
  DEFAULT_SUBGOALS,
  STORAGE_KEYS,
  SUB_GOAL_COUNT,
  ACTIONS_PER_BLOCK,
} from "@/constants/missionData";
import { useAuth } from "@/contexts/AuthContext";

// ─── Array helpers ────────────────────────────────────────────────

export function ensureArraySize<T>(arr: T[] | undefined, size: number, defaultValue: T): T[] {
  if (!Array.isArray(arr) || arr.length < size) {
    return Array(size).fill(defaultValue);
  }
  return arr;
}

export function ensure2DArraySize<T>(
  arr: T[][] | undefined,
  outerSize: number,
  innerSize: number,
  defaultValue: T,
): T[][] {
  if (!Array.isArray(arr) || arr.length < outerSize) {
    return Array(outerSize)
      .fill(null)
      .map(() => Array(innerSize).fill(defaultValue));
  }
  return arr.map((inner) => ensureArraySize(inner, innerSize, defaultValue));
}

export function make2D<T>(value: T): T[][] {
  return Array(SUB_GOAL_COUNT)
    .fill(null)
    .map(() => Array(ACTIONS_PER_BLOCK).fill(value));
}

// ─── Safe localStorage reader ─────────────────────────────────────

export function readStorage<T>(key: string, fallback: T, validate: (v: unknown) => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return validate(JSON.parse(raw));
  } catch {
    console.warn(`Failed to parse ${key}, using defaults`);
  }
  return fallback;
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useMatrixStorage() {
  const { user, isGuest, loading } = useAuth();
  const userId = user?.id ?? (isGuest ? "guest" : "anonymous");

  // Always-current refs — updated every render, no effect needed
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  // User-isolated localStorage keys (memoized)
  const keys = useMemo(() => ({
    actions:            `goalMatrix_actions_${userId}`,
    labels:             `goalMatrix_labels_${userId}`,
    actionLabels:       `goalMatrix_actionLabels_${userId}`,
    backupActions:      `orbit81_backup_actions_${userId}`,
    backupLabels:       `orbit81_backup_labels_${userId}`,
    backupActionLabels: `orbit81_backup_actionLabels_${userId}`,
  }), [userId]);

  // Keep a ref to keys so persist effects can always access current key
  // without listing keys as a dependency (which would cause overwrite race)
  const keysRef = useRef(keys);
  keysRef.current = keys;

  // Start with defaults — real data loaded by effect below
  const [actions, setActions] = useState<boolean[][]>(make2D(false));
  const [subGoalLabels, setSubGoalLabels] = useState<string[]>([...DEFAULT_SUBGOALS]);
  const [actionLabels, setActionLabels] = useState<string[][]>(make2D(""));

  // ── Load from storage once auth resolves (or userId changes) ──────
  // Deps: [userId, loading] — fires when auth resolves OR user switches.
  // Does NOT include keys to avoid circular dependency.
  useEffect(() => {
    if (loading) return; // wait for auth to settle
    const k = keysRef.current;
    setActions(readStorage(k.actions, make2D(false), (v) =>
      ensure2DArraySize(v as boolean[][], SUB_GOAL_COUNT, ACTIONS_PER_BLOCK, false),
    ));
    setSubGoalLabels(readStorage(k.labels, [...DEFAULT_SUBGOALS], (v) =>
      ensureArraySize(v as string[], SUB_GOAL_COUNT, "Goal"),
    ));
    setActionLabels(readStorage(k.actionLabels, make2D(""), (v) =>
      ensure2DArraySize(v as string[][], SUB_GOAL_COUNT, ACTIONS_PER_BLOCK, ""),
    ));
  }, [userId, loading]);

  // ── Persist on data change — key via ref, NOT dep ─────────────────
  // This ensures persist effects only fire when data changes,
  // never when only the key changes (prevents stale-state overwrite).
  useEffect(() => {
    if (loadingRef.current) return;
    localStorage.setItem(keysRef.current.actions, JSON.stringify(actions));
  }, [actions]);

  useEffect(() => {
    if (loadingRef.current) return;
    localStorage.setItem(keysRef.current.labels, JSON.stringify(subGoalLabels));
  }, [subGoalLabels]);

  useEffect(() => {
    if (loadingRef.current) return;
    localStorage.setItem(keysRef.current.actionLabels, JSON.stringify(actionLabels));
  }, [actionLabels]);

  // ── One-time migration: legacy generic keys → user-specific keys ──
  useEffect(() => {
    if (!user?.id) return;
    const migrate = (oldKey: string, newKey: string) => {
      const oldData = localStorage.getItem(oldKey);
      const newData = localStorage.getItem(newKey);
      if (oldData && !newData) {
        localStorage.setItem(newKey, oldData);
        localStorage.removeItem(oldKey);
      }
    };
    migrate(STORAGE_KEYS.actions,      keys.actions);
    migrate(STORAGE_KEYS.labels,       keys.labels);
    migrate(STORAGE_KEYS.actionLabels, keys.actionLabels);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return {
    actions, setActions,
    subGoalLabels, setSubGoalLabels,
    actionLabels, setActionLabels,
    keys,
  };
}
