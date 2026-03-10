/**
 * missionData.ts — Single source of truth for all Orbit 81 configuration.
 *
 * WHY: Centralises every magic string, template, milestone, and stage
 * description so that UI components stay thin and data changes only
 * happen in one place.
 */

// ─── Grid Dimensions ──────────────────────────────────────────────
/** Total sub-goal blocks surrounding the core */
export const SUB_GOAL_COUNT = 8;
/** Actions per sub-goal block */
export const ACTIONS_PER_BLOCK = 8;
/** Total actionable items across the matrix (8 × 8) */
export const TOTAL_ACTIONS = SUB_GOAL_COUNT * ACTIONS_PER_BLOCK;

// ─── Default Sub-Goal Labels ──────────────────────────────────────
export const DEFAULT_SUBGOALS: readonly string[] = [
  "Health",
  "Career",
  "Finance",
  "Learning",
  "Relationships",
  "Creativity",
  "Mindfulness",
  "Adventure",
] as const;

// ─── localStorage Keys ───────────────────────────────────────────
export const STORAGE_KEYS = {
  actions: "goalMatrix_actions",
  labels: "goalMatrix_labels",
  actionLabels: "goalMatrix_actionLabels",
} as const;

// ─── Templates ───────────────────────────────────────────────────
export interface Template {
  name: string;
  labels: string[];
}

export const TEMPLATES: readonly Template[] = [
  { name: "Solopreneur Startup", labels: ["Product", "Marketing", "Sales", "Finance", "Network", "Skills", "Systems", "Mindset"] },
  { name: "Wealth Building", labels: ["Income", "Savings", "Investing", "Assets", "Debt", "Budget", "Skills", "Network"] },
  { name: "Healthy Lifestyle", labels: ["Nutrition", "Exercise", "Sleep", "Mental", "Habits", "Social", "Medical", "Goals"] },
  { name: "Student Success", labels: ["Studies", "Projects", "Network", "Skills", "Health", "Finance", "Career", "Balance"] },
  { name: "Creative Career", labels: ["Craft", "Portfolio", "Clients", "Income", "Learning", "Network", "Brand", "Balance"] },
] as const;

// ─── Progress Milestones ─────────────────────────────────────────
/** Progress percentages where a milestone diamond is rendered on the bar */
export const MILESTONES = [15, 30, 45, 60, 80, 100] as const;

// ─── Pre-Launch Stage Definitions ────────────────────────────────
/**
 * The 6 pre-launch stages that map to progress ranges (0–99 %).
 * At 100 % the launch sequence takes over.
 */
export type PreLaunchStage =
  | "idle"           // 0–15 %: Static on launchpad, subtle rumble
  | "systems-on"     // 16–30 %: Gantry arms open, white pixel steam
  | "fueling"        // 31–45 %: Blue energy glow on hull
  | "engine-test"    // 46–60 %: Orange pixel sparks from nozzles
  | "power-up"       // 61–80 %: Screen shake, base smoke clouds
  | "high-tension";  // 81–99 %: Maximum smoke, rapid flickering, heavy vibration

export function getPreLaunchStage(progress: number): PreLaunchStage {
  if (progress <= 15) return "idle";
  if (progress <= 30) return "systems-on";
  if (progress <= 45) return "fueling";
  if (progress <= 60) return "engine-test";
  if (progress <= 80) return "power-up";
  return "high-tension";
}

// ─── Launch Phases (100 %) ───────────────────────────────────────
export type LaunchPhase = "idle" | "countdown" | "ignition" | "liftoff" | "ascending" | "exited";

// ─── Grid Layout Mapping ─────────────────────────────────────────
/**
 * Maps the 9-cell (3×3) visual grid to sub-goal indices.
 * -1 = centre cell (Core Goal).
 * Layout:  [0][1][2]
 *          [3][C][4]
 *          [5][6][7]
 */
export const GRID_POSITIONS = [0, 1, 2, 3, -1, 4, 5, 6, 7] as const;

/**
 * Within each sub-goal block the same 3×3 pattern is used
 * where -1 is the editable label cell.
 */
export const ACTION_POSITIONS = [0, 1, 2, 3, -1, 4, 5, 6, 7] as const;
