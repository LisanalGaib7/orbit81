/**
 * useMissionProgress — Core state machine for the Orbit 81 matrix.
 *
 * WHY: Composes useMatrixStorage (persistence) + useMissionComplete (finale)
 * so this hook stays focused on matrix business logic only.
 * GoalMatrix remains a thin rendering shell calling this single hook.
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  DEFAULT_SUBGOALS,
  SUB_GOAL_COUNT,
  ACTIONS_PER_BLOCK,
  TOTAL_ACTIONS,
} from "@/constants/missionData";
import { getEvolutionStage, type EvolutionStage } from "@/constants/evolutionData";
import { useMatrixStorage, make2D } from "@/hooks/useMatrixStorage";
import { useMissionComplete } from "@/hooks/useMissionComplete";

export function useMissionProgress() {
  // ── Persistence layer ────────────────────────────────────────────
  const {
    actions, setActions,
    subGoalLabels, setSubGoalLabels,
    actionLabels, setActionLabels,
    keys,
  } = useMatrixStorage();

  // ── UI state ────────────────────────────────────────────────────
  const [completedSubGoals, setCompletedSubGoals] = useState<Set<number>>(new Set());
  const prevCompletedRef = useRef<Set<number>>(new Set());
  const [ignitionBurst, setIgnitionBurst] = useState(0);
  const [canRevert, setCanRevert] = useState(false);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [focusActionIndex, setFocusActionIndex] = useState<number | null>(null);

  // ── Derived values ───────────────────────────────────────────────
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

  // ── Mission completion (extracted) ──────────────────────────────
  const {
    showMissionComplete,
    showMissionModal,
    showFireworks,
    handleLaunchComplete,
    dismissMission,
  } = useMissionComplete(globalProgress);

  // ── Track newly completed sub-goals (confetti) ──────────────────
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

  // ── Callbacks ────────────────────────────────────────────────────
  const toggleAction = useCallback((blockIndex: number, actionIndex: number) => {
    setActions((prev) => {
      // 변경된 블록만 새 배열로 교체 → 나머지 블록은 참조 유지
      // → React.memo SubGoalBlock이 변경된 블록만 리렌더
      const changedBlock = [...prev[blockIndex]];
      const wasChecked = changedBlock[actionIndex];
      changedBlock[actionIndex] = !wasChecked;
      if (!wasChecked) setIgnitionBurst((c) => c + 1);
      const next = [...prev];
      next[blockIndex] = changedBlock;
      return next;
    });
  }, [setActions]);

  const updateLabel = useCallback((index: number, newLabel: string) => {
    setSubGoalLabels((prev) => {
      const next = [...prev];
      next[index] = newLabel;
      return next;
    });
  }, [setSubGoalLabels]);

  const updateActionLabel = useCallback((blockIndex: number, actionIndex: number, label: string) => {
    setActionLabels((prev) => {
      // 변경된 블록만 새 배열로 교체
      const changedBlock = [...prev[blockIndex]];
      changedBlock[actionIndex] = label;
      const next = [...prev];
      next[blockIndex] = changedBlock;
      return next;
    });
  }, [setActionLabels]);

  const applyTemplate = useCallback((labels: string[]) => {
    setSubGoalLabels(labels);
  }, [setSubGoalLabels]);

  const resetSession = useCallback(() => {
    localStorage.setItem(keys.backupActions,      JSON.stringify(actions));
    localStorage.setItem(keys.backupLabels,       JSON.stringify(subGoalLabels));
    localStorage.setItem(keys.backupActionLabels, JSON.stringify(actionLabels));
    setActions(make2D(false));
    setSubGoalLabels([...DEFAULT_SUBGOALS]);
    setActionLabels(make2D(""));
    setActiveBlockIndex(null);
    setFocusActionIndex(null);
    setCanRevert(true);
  }, [actions, subGoalLabels, actionLabels, keys, setActions, setSubGoalLabels, setActionLabels]);

  const revertReset = useCallback(() => {
    const backupActions      = localStorage.getItem(keys.backupActions);
    const backupLabels       = localStorage.getItem(keys.backupLabels);
    const backupActionLabels = localStorage.getItem(keys.backupActionLabels);
    if (backupActions)      setActions(JSON.parse(backupActions));
    if (backupLabels)       setSubGoalLabels(JSON.parse(backupLabels));
    if (backupActionLabels) setActionLabels(JSON.parse(backupActionLabels));
    setCanRevert(false);
  }, [keys, setActions, setSubGoalLabels, setActionLabels]);

  const handleActionSlotClick = useCallback((blockIndex: number, actionIndex: number) => {
    setActiveBlockIndex(blockIndex);
    setFocusActionIndex(actionIndex);
  }, []);

  const clearConfetti = useCallback((idx: number) => {
    setCompletedSubGoals((prev) => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
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
    revertReset,
    handleActionSlotClick,
    clearConfetti,
    handleLaunchComplete,
    dismissMission,
    setActiveBlockIndex,
    setFocusActionIndex,
  };
}
