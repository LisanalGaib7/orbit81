/**
 * useMatrixStorage — Persistence layer for the Orbit 81 matrix.
 *
 * WHY: Separates localStorage read/write logic from business logic in
 * useMissionProgress. Handles user-isolated keys and one-time migration
 * from legacy generic keys.
 */

import { useState, useEffect, useMemo } from "react";
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
  const { user, isGuest } = useAuth();
  const userId = user?.id ?? (isGuest ? "guest" : "anonymous");

  // User-isolated localStorage keys (memoized to prevent key churn on re-render)
  const keys = useMemo(() => ({
    actions:            `goalMatrix_actions_${userId}`,
    labels:             `goalMatrix_labels_${userId}`,
    actionLabels:       `goalMatrix_actionLabels_${userId}`,
    backupActions:      `orbit81_backup_actions_${userId}`,
    backupLabels:       `orbit81_backup_labels_${userId}`,
    backupActionLabels: `orbit81_backup_actionLabels_${userId}`,
  }), [userId]);

  // State initialised from storage
  const [actions, setActions] = useState<boolean[][]>(() =>
    readStorage(keys.actions, make2D(false), (v) =>
      ensure2DArraySize(v as boolean[][], SUB_GOAL_COUNT, ACTIONS_PER_BLOCK, false),
    ),
  );

  const [subGoalLabels, setSubGoalLabels] = useState<string[]>(() =>
    readStorage(keys.labels, [...DEFAULT_SUBGOALS], (v) =>
      ensureArraySize(v as string[], SUB_GOAL_COUNT, "Goal"),
    ),
  );

  const [actionLabels, setActionLabels] = useState<string[][]>(() =>
    readStorage(keys.actionLabels, make2D(""), (v) =>
      ensure2DArraySize(v as string[][], SUB_GOAL_COUNT, ACTIONS_PER_BLOCK, ""),
    ),
  );

  // One-time migration: move data from legacy generic keys → user-specific keys
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

  // Auto-persist on every change
  useEffect(() => localStorage.setItem(keys.actions,      JSON.stringify(actions)),      [actions,      keys.actions]);
  useEffect(() => localStorage.setItem(keys.labels,       JSON.stringify(subGoalLabels)), [subGoalLabels, keys.labels]);
  useEffect(() => localStorage.setItem(keys.actionLabels, JSON.stringify(actionLabels)), [actionLabels,  keys.actionLabels]);

  return {
    actions, setActions,
    subGoalLabels, setSubGoalLabels,
    actionLabels, setActionLabels,
    keys,
  };
}
