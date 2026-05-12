## Goal

Three avatar refinements.

## Changes

1. **`src/assets/avatars/corgi.png`** — edit:
   - Make the Shiba puppy's body and legs noticeably SHORTER and chubbier-cute (stubby chibi proportions, small round body, very short paws)
   - Move the round bubble helmet to the RIGHT, fully separated from the body (currently overlapping the torso) — clear black gap between dog and helmet
   - Keep face, sitting pose, four legs, white-orange spacesuit, chunky pixel-art style, pure black background

2. **`src/assets/avatars/pixel.png`** — edit:
   - Subtly emphasize the chest/bust line on her outfit (light shading + slight curve so silhouette reads feminine) — tasteful, NOT exaggerated
   - Keep face, blush, long hair, outfit color, pose, pixel style, black background pixel-for-pixel otherwise identical

3. **`src/assets/avatars/ember.png`** — edit:
   - Add a clearly visible mouth (small calm smile fitting her existing lofi-chill personality)
   - Keep everything else (eyes, hair, headphones, outfit, pixel style, black background) identical

## Approach

Three `imagegen--edit_image` calls in parallel. No code changes.
