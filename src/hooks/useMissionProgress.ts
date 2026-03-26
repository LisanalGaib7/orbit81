/**
 * useMissionProgress — Core state machine for the Orbit 81 matrix.
 *
 * WHY: Keeps all matrix state (actions, labels, progress, mission-complete
 * triggers) in one hook so that the GoalMatrix component stays a thin
 * rendering shell. Any new feature that reads or writes matrix data
 * should go through this hook.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  DEFAULT_SUBGOALS,
  STORAGE_KEYS,
  SUB_GOAL_COUNT,
  ACTIONS_PER_BLOCK,
  TOTAL_ACTIONS,
} from "@/constants/missionData";
import { getEvolutionStage, type EvolutionStage } from "@/constants/evolutionData";

// ─── Array helpers ───────────────────────────────────────────────

function ensureArraySize<T>(arr: T[] | undefined, size: number, defaultValue: T): T[] {
  if (!Array.isArray(arr) || arr.length < size) {
    return Array(size).fill(defaultValue);
  }
  return arr;
}

function ensure2DArraySize<T>(
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

// ─── Safe localStorage reader ────────────────────────────────────

function readStorage<T>(key: string, fallback: T, validate: (v: unknown) => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return validate(JSON.parse(raw));
  } catch {
    console.warn(`Failed to parse ${key}, using defaults`);
  }
  return fallback;
}

// ─── Hook ────────────────────────────────────────────────────────

export function useMissionProgress() {
  // --- Core matrix state ---
  const [actions, setActions] = useState<boolean[][]>(() =>
    readStorage(STORAGE_KEYS.actions, make2D(false), (v) =>
      ensure2DArraySize(v as boolean[][], SUB_GOAL_COUNT, ACTIONS_PER_BLOCK, false),
    ),
  );

  const [subGoalLabels, setSubGoalLabels] = useState<string[]>(() =>
    readStorage(STORAGE_KEYS.labels, [...DEFAULT_SUBGOALS], (v) =>
      ensureArraySize(v as string[], SUB_GOAL_COUNT, "Goal"),
    ),
  );

  const [actionLabels, setActionLabels] = useState<string[][]>(() =>
    readStorage(STORAGE_KEYS.actionLabels, make2D(""), (v) =>
      ensure2DArraySize(v as string[][], SUB_GOAL_COUNT, ACTIONS_PER_BLOCK, ""),
    ),
  );

  // --- Mission completion state ---
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [completedSubGoals, setCompletedSubGoals] = useState<Set<number>>(new Set());
  const prevCompletedRef = useRef<Set<number>>(new Set());
  const missionTriggeredRef = useRef(false);
  const [ignitionBurst, setIgnitionBurst] = useState(0);
  const [canRevert, setCanRevert] = useState(false);

  // --- Sidebar / focus state ---
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [focusActionIndex, setFocusActionIndex] = useState<number | null>(null);

  // --- Derived values ---
  const subGoalProgress = useMemo(
    () => actions.map((block) => (block.filter(Boolean).length / ACTIONS_PER_BLOCK) * 100),
    [actions],
  );

  const globalProgress = useMemo(
    () => (actions.flat().filter(Boolean).length / TOTAL_ACTIONS) * 100,
    [actions],
  );

  const completedCount = useMemo(() => actions.flat().filter(Boolean).length, [actions]);

  const currentStage: EvolutionStage = useMemo(
    () => getEvolutionStage(globalProgress),
    [globalProgress],
  );

  // --- Persist to localStorage ---
  useEffect(() => localStorage.setItem(STORAGE_KEYS.actions, JSON.stringify(actions)), [actions]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.labels, JSON.stringify(subGoalLabels)), [subGoalLabels]);
  useEffect(() => localStorage.setItem(STORAGE_KEYS.actionLabels, JSON.stringify(actionLabels)), [actionLabels]);

  // --- Callbacks ---
  const toggleAction = useCallback((blockIndex: number, actionIndex: number) => {
    setActions((prev) => {
      const next = prev.map((block) => [...block]);
      const wasChecked = next[blockIndex][actionIndex];
      next[blockIndex][actionIndex] = !wasChecked;
      if (!wasChecked) setIgnitionBurst((c) => c + 1);
      return next;
    });
  }, []);

  const updateLabel = useCallback((index: number, newLabel: string) => {
    setSubGoalLabels((prev) => {
      const next = [...prev];
      next[index] = newLabel;
      return next;
    });
  }, []);

  const updateActionLabel = useCallback((blockIndex: number, actionIndex: number, label: string) => {
    setActionLabels((prev) => {
      const next = prev.map((block) => [...block]);
      next[blockIndex][actionIndex] = label;
      return next;
    });
  }, []);

  const applyTemplate = useCallback((labels: string[]) => {
    setSubGoalLabels(labels);
  }, []);

  const resetSession = useCallback(() => {
    // Backup current state before resetting
    localStorage.setItem('orbit81_backup_actions', JSON.stringify(actions));
    localStorage.setItem('orbit81_backup_labels', JSON.stringify(subGoalLabels));
    localStorage.setItem('orbit81_backup_actionLabels', JSON.stringify(actionLabels));
    setActions(make2D(false));
    setSubGoalLabels([...DEFAULT_SUBGOALS]);
    setActionLabels(make2D(""));
    setActiveBlockIndex(null);
    setFocusActionIndex(null);
    setCanRevert(true);
  }, [actions, subGoalLabels, actionLabels]);

  const revertReset = useCallback(() => {
    const backupActions = localStorage.getItem('orbit81_backup_actions');
    const backupLabels = localStorage.getItem('orbit81_backup_labels');
    const backupActionLabels = localStorage.getItem('orbit81_backup_actionLabels');
    if (backupActions) setActions(JSON.parse(backupActions));
    if (backupLabels) setSubGoalLabels(JSON.parse(backupLabels));
    if (backupActionLabels) setActionLabels(JSON.parse(backupActionLabels));
    setCanRevert(false);
  }, []);

  const handleActionSlotClick = useCallback((blockIndex: number, actionIndex: number) => {
    setActiveBlockIndex(blockIndex);
    setFocusActionIndex(actionIndex);
  }, []);

  // --- Track newly completed sub-goals (confetti) ---
  useEffect(() => {
    const newCompleted = new Set<number>();
    subGoalProgress.forEach((p, idx) => {
      if (p === 100) newCompleted.add(idx);
    });
    newCompleted.forEach((idx) => {
      if (!prevCompletedRef.current.has(idx)) {
        setCompletedSubGoals((prev) => new Set(prev).add(idx));
      }
    });
    prevCompletedRef.current = newCompleted;
  }, [subGoalProgress]);

  const clearConfetti = useCallback((idx: number) => {
    setCompletedSubGoals((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  }, []);

  // --- Launch sequence callback ---
  const handleLaunchComplete = useCallback(() => {
    setShowFireworks(true);
    setTimeout(() => setShowMissionModal(true), 1000);
  }, []);

  // --- Grand finale trigger ---
  useEffect(() => {
    if (globalProgress === 100 && !missionTriggeredRef.current) {
      missionTriggeredRef.current = true;
      setShowMissionComplete(true);
    }
  }, [globalProgress]);

  const dismissMission = useCallback(() => {
    setShowMissionComplete(false);
    setShowMissionModal(false);
    setShowFireworks(false);
    missionTriggeredRef.current = false;
  }, []);

  return {
    // State
    actions,
    subGoalLabels,
    actionLabels,
    activeBlockIndex,
    focusActionIndex,
    ignitionBurst,
    canRevert,

    // Derived
    subGoalProgress,
    globalProgress,
    completedCount,
    completedSubGoals,
    currentStage,

    // Mission state
    showMissionComplete,
    showMissionModal,
    showFireworks,

    // Actions
    toggleAction,
    updateLabel,
    updateActionLabel,
    applyTemplate,
    resetSession,
    handleActionSlotClick,
    clearConfetti,
    handleLaunchComplete,
    dismissMission,
    setActiveBlockIndex,
    setFocusActionIndex,
  };
}

// ─── Utility ─────────────────────────────────────────────────────

function make2D<T>(value: T): T[][] {
  return Array(SUB_GOAL_COUNT)
    .fill(null)
    .map(() => Array(ACTIONS_PER_BLOCK).fill(value));
}
