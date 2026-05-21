/**
 * Shared pixel-space geometry for the Orbit 81 rocket.
 * WHY: engine visuals must anchor to the nozzle, not the surrounding slot.
 */

export const ROCKET_PIXEL_SIZE = 4;
export const ROCKET_BODY_COLUMNS = 7;
export const ROCKET_BODY_ROWS = 10;

export const ROCKET_BODY_WIDTH = ROCKET_BODY_COLUMNS * ROCKET_PIXEL_SIZE;
export const ROCKET_BODY_HEIGHT = ROCKET_BODY_ROWS * ROCKET_PIXEL_SIZE;

/**
 * The engine nozzle is the single center pixel on the last row of the rocket.
 * These coordinates are measured from the rocket body's own 28x40px frame.
 */
export const ROCKET_NOZZLE_ANCHOR_STYLE = {
  left: `${ROCKET_BODY_WIDTH / 2}px`,
  top: `${ROCKET_BODY_HEIGHT - ROCKET_PIXEL_SIZE}px`,
} as const;
