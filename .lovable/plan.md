## Pilot Identity Chip — Refinement Plan

### 1. Split chip into two regions (avatar / call sign)
In `src/components/HeaderBar.tsx` (lines ~266–279), restyle the existing chip so it reads as a single bordered box visually divided into two halves:

- Left cell: avatar thumbnail (face only)
- Vertical divider line (`border-l border-primary/20`)
- Right cell: call sign label (orange, JetBrains Mono)

Adjust padding and gap so both cells feel balanced. Keep call sign visible on mobile too (it's currently `hidden sm:inline` — change to always visible, just smaller).

### 2. Show face only (head crop) instead of full body
Add a `crop` prop to `src/components/PilotAvatar.tsx`:

```
<PilotAvatar id={...} size={32} crop="face" />
```

Implementation: when `crop="face"`, the inner `<img>` gets a `transform: scale(2.4) translateY(22%)` inside the existing `overflow-hidden` container. Because every avatar PNG is composed identically (character centered, head in the upper third on a black background), one transform works for all 9 avatars.

Use the new `crop="face"` only in the HeaderBar chip. The onboarding/profile-panel grids keep the full-body view (no `crop` prop).

### 3. Can the avatar be changed after first selection? — Yes
No code change needed; just confirm in chat: the user can tap the **Settings cog** (top-right) → **Pilot Profile** sub-icon → reopens `PilotProfilePanel` where they can pick a new avatar and rename their call sign. This already works.

### Out of scope
- No change to the onboarding screen
- No change to call-sign validation rules
- No DB / RLS change

### Files touched
- `src/components/PilotAvatar.tsx` — add `crop` prop
- `src/components/HeaderBar.tsx` — split chip layout, pass `crop="face"`
