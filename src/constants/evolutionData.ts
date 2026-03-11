/**
 * evolutionData — 11-stage Grand Evolution Engine for Orbit 81.
 *
 * Each stage maps a progress range to rocket state, launch-structure
 * state, particle triggers, and lighting effects.
 */

export interface EvolutionStage {
  id: number;
  name: string;
  range: [number, number];
  rocketState: string;
  structureState: string;
  particleTriggers: string[];
  lightingEffects: string[];
}

export const EVOLUTION_STAGES: EvolutionStage[] = [
  {
    id: 1,
    name: "FOUNDATION",
    range: [0, 9],
    rocketState: "ground-construction",
    structureState: "raw-materials",
    particleTriggers: ["dust"],
    lightingEffects: ["dim-amber"],
  },
  {
    id: 2,
    name: "CORE TOWER",
    range: [10, 19],
    rocketState: "vertical-skeleton",
    structureState: "engine-components",
    particleTriggers: ["welding-sparks"],
    lightingEffects: ["amber-pulse"],
  },
  {
    id: 3,
    name: "POWER LINE",
    range: [20, 29],
    rocketState: "data-cables",
    structureState: "vibration-checks",
    particleTriggers: ["electric-arcs"],
    lightingEffects: ["blue-flicker"],
  },
  {
    id: 4,
    name: "FUEL ARM",
    range: [30, 39],
    rocketState: "fuel-arms-attached",
    structureState: "frost-effects",
    particleTriggers: ["frost-mist"],
    lightingEffects: ["cold-blue"],
  },
  {
    id: 5,
    name: "STRUCTURE UP",
    range: [40, 49],
    rocketState: "upper-platforms",
    structureState: "navigation-lights",
    particleTriggers: ["nav-blink"],
    lightingEffects: ["strobe-white"],
  },
  {
    id: 6,
    name: "CATCHING ARM",
    range: [50, 59],
    rocketState: "mechazilla-secured",
    structureState: "lower-supports-clear",
    particleTriggers: ["hydraulic-steam"],
    lightingEffects: ["orange-glow"],
  },
  {
    id: 7,
    name: "COMM SYSTEM",
    range: [60, 69],
    rocketState: "radar-operational",
    structureState: "antenna-active",
    particleTriggers: ["spark-tests"],
    lightingEffects: ["green-blink"],
  },
  {
    id: 8,
    name: "FULL SUPPORT",
    range: [71, 80],
    rocketState: "warning-lights",
    structureState: "atmospheric-smoke",
    particleTriggers: ["ground-smoke"],
    lightingEffects: ["red-warning"],
  },
  {
    id: 9,
    name: "PRE-FLIGHT",
    range: [81, 90],
    rocketState: "arms-opening",
    structureState: "ignition-prep",
    particleTriggers: ["ignition-sparks", "steam-vents"],
    lightingEffects: ["golden-flood"],
  },
  {
    id: 10,
    name: "FINAL T-MINUS",
    range: [91, 99],
    rocketState: "tower-retracted",
    structureState: "ground-fire",
    particleTriggers: ["ground-fire", "exhaust-plume"],
    lightingEffects: ["fire-orange", "strobe-red"],
  },
  {
    id: 11,
    name: "LIFTOFF",
    range: [100, 100],
    rocketState: "ascending",
    structureState: "launch-clear",
    particleTriggers: ["full-exhaust", "shockwave"],
    lightingEffects: ["blinding-white", "golden-aureole"],
  },
];

/**
 * Returns the current evolution stage for a given progress percentage.
 */
export function getEvolutionStage(progress: number): EvolutionStage {
  const clamped = Math.min(100, Math.max(0, Math.round(progress)));
  for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
    if (clamped >= EVOLUTION_STAGES[i].range[0]) {
      return EVOLUTION_STAGES[i];
    }
  }
  return EVOLUTION_STAGES[0];
}
