## Goal

Refine COMET (less greasy, more soft pretty-boy / 미소년) and SHIBA (slimmer, cuter chibi).

## Changes

1. **`src/assets/avatars/comet.png`** — regenerate:
   - Soft pretty-boy (미소년) vibe: youthful, clean, slightly cool — NOT smug or greasy
   - Slimmer face, softer jawline, gentle calm expression (faint smile, not a smirk)
   - Larger clear eyes, lighter eyebrows
   - New hairstyle: clean modern K-pop style red hair — soft fringe falling over the forehead, neat but slightly textured (no more spiky/messy windblown look)
   - Keep red racing/pilot suit, chunky pixel-art style, pure black background, same canvas framing

2. **`src/assets/avatars/corgi.png`** — regenerate:
   - Slimmer, smaller chibi proportions — currently the body looks too chunky/round
   - Reduce overall body width, narrower torso, daintier limbs
   - Keep the reference Shiba face (squinty smile, open mouth, blush, dark brow markings)
   - Two human-like legs, simple white+orange spacesuit
   - Even smaller character on the canvas — more black negative space around it
   - Same chunky pixel-art style, pure black background

## Approach

Use `imagegen--edit_image` on each existing file in parallel with style-matching prompts. No code changes.
