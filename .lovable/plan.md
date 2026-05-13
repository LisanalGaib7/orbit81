## Pilot Chip — Single Box, Bigger Face

`src/components/HeaderBar.tsx` chip (lines ~266–287):

- Remove inner divider and inner padded cell (`PilotAvatar` no longer wrapped in its own padded box).
- Single outer box: rounded border, padded `pl-1 pr-3 py-1`, `gap-2.5`.
- Avatar size: 32 → **44px** (`crop="face"`); pass `className="border-0"` so it shares the outer box border instead of double-bordering.
- Call sign: 11px → **12px**, still tracking `0.25em`, primary/90.
- Always visible on mobile.

`src/components/PilotAvatar.tsx`: no API change needed — inner border is already `border border-primary/30`. To allow the chip to drop the inner border cleanly, make the border conditional via `className` override (already supported through `cn(..., className)`); pass `className="border-transparent"` from HeaderBar.

### Out of scope
- Onboarding / profile-panel grids unchanged.
- No DB / auth changes.
