/**
 * useAvatarSelection — shared avatar + call-sign editing state.
 *
 * WHY: PilotOnboarding (first-run) and PilotProfilePanel (settings) both let
 * the user pick an avatar and a call sign with identical validation rules.
 * Centralising the rules (max length, allowed chars, "Pilot" normalisation,
 * min-length check) here keeps them in one place so the two screens can't
 * drift apart.
 */

import { useState } from "react";
import type { AvatarId } from "@/assets/avatars";

export const MAX_CALLSIGN = 16;
const CALLSIGN_RE = /^[A-Za-z0-9 _-]*$/;

/** The DB default call sign "Pilot" is shown as an empty field for editing. */
export function normalizeCallSign(raw: string | null | undefined): string {
  return (raw ?? "").replace(/^Pilot$/i, "");
}

export function useAvatarSelection(
  initialAvatarId: AvatarId | null,
  initialCallSign?: string,
) {
  const [selected, setSelected] = useState<AvatarId | null>(initialAvatarId);
  const [callSign, setCallSign] = useState<string>(() => normalizeCallSign(initialCallSign));

  /** Guards length + allowed characters before committing the input. */
  const handleNameChange = (v: string) => {
    if (v.length > MAX_CALLSIGN) return;
    if (!CALLSIGN_RE.test(v)) return;
    setCallSign(v);
  };

  const trimmedName = callSign.trim();
  const isValid = !!selected && trimmedName.length >= 2;

  return {
    selected,
    setSelected,
    callSign,
    setCallSign,
    handleNameChange,
    trimmedName,
    isValid,
  };
}
