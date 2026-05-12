## Goal

Replace `src/assets/avatars/corgi.png` so SHIBA matches the chunky low-res pixel-art style of the other 8 pilots (NOVA, EMBER, etc.) — instead of the current high-detail cartoon illustration.

## Reference

- Style anchor: existing avatars (NOVA, PIXEL, COMET) — small chibi character centered on a large pure black canvas, blocky low-res pixels with visible square pixel grain, simple shading.
- Subject anchor: the user-uploaded Shiba face pixel art (round head, squinty smiling eyes `^_^`, pink cheek dots, tiny smirk, perky ears).

## Changes

1. Regenerate `src/assets/avatars/corgi.png`:
   - True chunky pixel-art (visibly low resolution, square pixels, no anti-aliased illustration look)
   - Small Shiba pilot occupying only the center ~40-50% of the frame (rest is pure black `#000000`)
   - Standing upright on **2 human-like legs**, tiny chibi proportions, big round head / tiny body
   - Face directly inspired by the reference: orange + white fur, squinty `^_^` smiling eyes, pink blush cheeks, small smirk, perky triangular ears
   - Simple white-and-orange spacesuit (kept minimal so pixel style reads cleanly)
   - No white sticker outline — only natural dark pixel outline
   - Pure black background, no white halo

2. No code changes — `index.ts` already labels it SHIBA.

## Approach

Use `imagegen--generate_image` (not edit) with strong style-matching prompt referencing the chunky pixel-art look of the other pilots, then visually QA against NOVA/PIXEL to confirm style match. Iterate if the output drifts back to high-detail illustration.
