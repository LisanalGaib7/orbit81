## Pilot Chip — Tighten Spacing & Drop Inner Border

### `src/components/PilotAvatar.tsx`
Add a `bordered` prop (default `true`) so the chip can opt out of the inner ring cleanly. Apply via conditional class instead of relying on tailwind-merge:
```
"relative shrink-0 overflow-hidden rounded-md bg-background"
+ (bordered ? " border border-primary/30" : "")
```

### `src/components/HeaderBar.tsx` chip
- Avatar: pass `bordered={false}` so only the outer chip border shows.
- Outer box: `pl-1.5 pr-3 py-1`, `gap-2`, `inline-flex` (force shrink-to-fit just in case).
- Call sign: keep `text-[12px] tracking-[0.25em]`, remove `whitespace-nowrap`? keep it — short string, no wrap.
- Result: tight chip that hugs `[face][CALL SIGN]` with even left/right breathing room.

### Out of scope
Onboarding/profile-panel grids untouched (they keep the visible border on each tile).
