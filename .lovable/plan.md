## Goal

Four refinements: PIXEL gets blush, swap DRIFT/RELIC order, redesign COMET as a racing-driver vibe, and rework SHIBA into a 4-legged sitting puppy in a spacesuit.

## Changes

1. **`src/assets/avatars/pixel.png`** — edit only:
   - Add small pink blush dots on both cheeks
   - Keep everything else (long hair, soft eyes, cat-like upturn, calm expression, outfit, black background) pixel-for-pixel identical

2. **`src/assets/avatars/index.ts`** — swap order of DRIFT and RELIC in the `AVATARS` array so RELIC comes before DRIFT. No other field changes (id/name/tagline/accent stay).

3. **`src/assets/avatars/comet.png`** — regenerate:
   - Pretty-boy K-pop face stays, but lean into a **professional racing driver** vibe
   - Wearing a proper red & white racing suit with sponsor-style stripes / number patch / collar zipper
   - Holding a racing helmet (red with white visor stripe) tucked under one arm at hip
   - Confident composed posture, faint cool smile
   - Same chunky pixel-art style, pure black background, same canvas framing

4. **`src/assets/avatars/corgi.png`** — regenerate:
   - Cute Shiba-like puppy **sitting on all four legs** (NOT bipedal anymore) — classic dog sitting pose, front paws on ground, back legs tucked
   - Wearing a small white-and-orange astronaut spacesuit fitted to a quadruped body (suit covers torso/legs)
   - Round bubble space helmet placed **on the ground next to the dog** (not worn, not held)
   - Keep the reference Shiba face: squinty smile, open pink mouth, blush, dark brow markings, perky ears
   - Short limbs, small chibi proportions, plenty of black negative space
   - Same chunky pixel-art style, pure black #000000 background

## Approach

- One `code--line_replace` for `index.ts` (swap two lines)
- Three `imagegen--edit_image` calls in parallel for the three avatar files
