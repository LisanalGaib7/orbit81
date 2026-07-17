/**
 * useMissionComplete — Mission completion state machine.
 *
 * WHY: Isolates the grand-finale trigger logic (fireworks, modal, dismissal)
 * so useMissionProgress stays focused on matrix data.
 */

import { useState, useCallback, useEffect, useRef } from "react";

export function useMissionComplete(globalProgress: number) {
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const missionTriggeredRef = useRef(false);

  // Grand finale trigger — fires once when progress hits 100.
  // The "already triggered" latch self-resets as soon as progress leaves 100
  // (reset, revert, or un-checking an action), so re-completing re-arms the
  // finale without depending on the modal being dismissed first.
  useEffect(() => {
    if (globalProgress === 100 && !missionTriggeredRef.current) {
      missionTriggeredRef.current = true;
      setShowMissionComplete(true);
    } else if (globalProgress < 100) {
      missionTriggeredRef.current = false;
    }
  }, [globalProgress]);

  const handleLaunchComplete = useCallback(() => {
    setShowFireworks(true);
    setTimeout(() => setShowMissionModal(true), 1000);
  }, []);

  const dismissMission = useCallback(() => {
    setShowMissionComplete(false);
    setShowMissionModal(false);
    setShowFireworks(false);
    missionTriggeredRef.current = false;
  }, []);

  return {
    showMissionComplete,
    showMissionModal,
    showFireworks,
    handleLaunchComplete,
    dismissMission,
  };
}
