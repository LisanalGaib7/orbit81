

## Plan: Dramatic Launch Structure Evolution (Stages 1–10)

### Problem
The current tower structure has minimal visual differentiation between stages. The tower height only changes across 4 brackets (20→50→65→80px), many stages share no unique visual elements, and atmospheric effects only appear at stage 8+. Result: stages feel sampled rather than progressively built.

### Approach
Rewrite `LaunchStructure.tsx` so **every single stage** introduces a visually distinct, noticeable new element with dramatic entrance animations. The tower should feel like it's being *constructed piece by piece*.

### Stage-by-Stage Visual Breakdown

| Stage | New Visual Element |
|-------|-------------------|
| **1 FOUNDATION** | Wider concrete ground pad + 4 support pylons rising from ground with dust particles |
| **2 CORE TOWER** | Main vertical beam grows to ~40px, cross-lattice bars animate in, welding spark particles at joints |
| **3 POWER LINE** | Glowing blue power cables snake up the tower, electric arc flicker effect between cable endpoints |
| **4 FUEL ARM** | Horizontal fuel arm extends from tower mid-point with frost/ice crystals forming at the tip, cold-blue ambient glow |
| **5 STRUCTURE UP** | Upper service platform appears at top of tower, navigation lights (white strobes) blink at platform corners, tower grows to ~60px |
| **6 CATCHING ARM** | Two Mechazilla chopstick arms swing into position (dramatic rotation animation), hydraulic steam puffs at pivot points |
| **7 COMM SYSTEM** | Antenna mast extends above tower top, radar dish with rotating sweep animation, green status light pulses |
| **8 FULL SUPPORT** | Red warning lights cascade down the tower (alternating blink pattern), ground-level smoke particles begin, tower fully lit |
| **9 PRE-FLIGHT** | Chopstick arms begin opening outward, golden flood light from base illuminates everything, ignition sparks + steam vents at base |
| **10 FINAL T-MINUS** | Tower retracts/leans away, intense ground fire glow, exhaust plume particles, rapid red strobes, screen-edge fire-orange ambient light |

### Technical Changes

**File: `src/components/LaunchStructure.tsx`** — Full rewrite

1. **Progressive tower height**: 10→25→40→50→60→70→75→80→85→90px (each stage adds height)
2. **FoundationLayer**: Stage 1 gets wider base pad with 4 animated pylons + floating dust motes. Stage 3+ adds animated cable lines with electric glow.
3. **TowerLayer**: 
   - Stage 2: beam + animated cross-lattice with welding spark dots
   - Stage 4: frost-tipped fuel arm with icy particle drip
   - Stage 5: upper platform shelf + nav strobe lights
   - Stage 6: two chopstick arms with spring animations + steam puffs
   - Stage 7: antenna mast + rotating radar sweep + green beacon
   - Stage 8: 4 cascading red warning lights along tower height
4. **AtmosphereLayer**: Start effects earlier (stage 4 gets subtle frost mist, stage 6 gets hydraulic steam), escalate density through stages 8-10 with fire glow and exhaust plumes
5. **Ambient glow layer**: Per-stage colored radial gradient behind the entire structure matching the evolution theme color (amber → blue → cold-blue → white → orange → green → red → gold → fire)

All animations use `framer-motion` with staggered delays for a "construction happening" feel.

