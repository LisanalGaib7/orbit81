import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AVATARS, type AvatarId } from "@/assets/avatars";
import { PilotAvatar } from "./PilotAvatar";
import { Starfield } from "./Starfield";
import { cn } from "@/lib/utils";

interface PilotOnboardingProps {
  initialCallSign?: string;
  initialAvatarId?: AvatarId | null;
  onComplete: (next: { avatar_id: AvatarId; call_sign: string }) => Promise<{ error: string | null }>;
}

const MAX_CALLSIGN = 16;
const CALLSIGN_RE = /^[A-Za-z0-9 _-]*$/;

export function PilotOnboarding({ initialCallSign, initialAvatarId, onComplete }: PilotOnboardingProps) {
  const [selected, setSelected] = useState<AvatarId | null>(initialAvatarId ?? null);
  const initialName = (initialCallSign ?? "").replace(/^Pilot$/i, "");
  const [callSign, setCallSign] = useState<string>(initialName);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedDef = AVATARS.find((a) => a.id === selected) ?? null;
  const trimmedName = callSign.trim();
  const canDeploy = !!selected && trimmedName.length >= 2 && !submitting;

  const handleNameChange = (v: string) => {
    if (v.length > MAX_CALLSIGN) return;
    if (!CALLSIGN_RE.test(v)) return;
    setCallSign(v);
  };

  const handleDeploy = async () => {
    if (!selected || trimmedName.length < 2) return;
    setSubmitting(true);
    setError(null);
    const { error } = await onComplete({ avatar_id: selected, call_sign: trimmedName });
    if (error) {
      setError(error);
      setSubmitting(false);
    }
    // success → parent will unmount this component
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-background overflow-y-auto">
      <Starfield progress={0} />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-start gap-6 px-4 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center">
          <div
            className="text-[9px] sm:text-[10px] tracking-[0.3em] text-primary/70"
            style={{ fontFamily: "var(--font-data)", textShadow: "1px 1px 0 #000" }}
          >
            [ ORBIT 81 // GROUND CONTROL ]
          </div>
          <h1
            className="mt-2 text-base sm:text-xl font-bold tracking-wider text-foreground"
            style={{ fontFamily: "var(--font-header)", textShadow: "1px 1px 0 #000" }}
          >
            PILOT REGISTRATION TERMINAL
          </h1>
          <p
            className="mt-2 text-[10px] sm:text-xs text-muted-foreground"
            style={{ fontFamily: "var(--font-data)" }}
          >
            Select your suit. Lock in your call sign. Then we light the engines.
          </p>
        </div>

        {/* Selected preview */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div
            className="relative"
            style={{
              filter: selectedDef
                ? `drop-shadow(0 0 18px ${selectedDef.accent}90)`
                : "drop-shadow(0 0 12px hsl(var(--primary) / 0.3))",
            }}
          >
            {selected ? (
              <PilotAvatar id={selected} size={140} glow />
            ) : (
              <div
                className="flex items-center justify-center rounded-md border border-dashed border-primary/30 text-primary/40"
                style={{
                  width: 140,
                  height: 140,
                  fontFamily: "var(--font-data)",
                  fontSize: 10,
                  letterSpacing: "0.2em",
                }}
              >
                NO PILOT
              </div>
            )}
          </div>
          <div
            className="h-5 text-center text-[11px] tracking-[0.3em]"
            style={{
              fontFamily: "var(--font-data)",
              color: selectedDef?.accent ?? "hsl(var(--muted-foreground))",
            }}
          >
            {selectedDef ? selectedDef.name : "— SELECT A PILOT —"}
          </div>
          <div
            className="h-5 text-center text-[11px] text-primary/80"
            style={{
              fontFamily: "var(--font-data)",
              textShadow: "0 0 6px hsl(var(--primary) / 0.4), 1px 1px 0 #000",
              letterSpacing: "0.15em",
            }}
          >
            {selectedDef?.tagline ?? ""}
          </div>
        </div>

        {/* Avatar grid */}
        <div className="grid w-full grid-cols-3 gap-3">
          {AVATARS.map((a) => {
            const active = a.id === selected;
            return (
              <motion.button
                key={a.id}
                type="button"
                onClick={() => setSelected(a.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "group relative flex flex-col items-center gap-2 rounded-md border p-2 transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-primary/15 bg-background/40 hover:border-primary/40",
                )}
                style={{
                  boxShadow: active
                    ? `0 0 16px ${a.accent}55, inset 0 0 8px ${a.accent}25`
                    : undefined,
                }}
                aria-pressed={active}
                aria-label={`Select ${a.name}`}
              >
                <PilotAvatar id={a.id} size={88} glow={active} />
                <div
                  className="text-center text-[10px] tracking-[0.25em]"
                  style={{
                    fontFamily: "var(--font-data)",
                    color: active ? a.accent : "hsl(var(--muted-foreground))",
                    textShadow: active ? `0 0 6px ${a.accent}80` : undefined,
                  }}
                >
                  {a.name}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Callsign input */}
        <div className="w-full max-w-sm">
          <label
            className="mb-1 block text-[10px] tracking-[0.3em] text-primary/80"
            style={{ fontFamily: "var(--font-data)" }}
          >
            CALL SIGN
          </label>
          <div className="relative">
            <input
              type="text"
              value={callSign}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="ENTER PILOT NAME"
              maxLength={MAX_CALLSIGN}
              className="w-full rounded-md border border-primary/30 bg-background/60 px-3 py-2 text-foreground outline-none transition-colors focus:border-primary"
              style={{
                fontFamily: "var(--font-data)",
                letterSpacing: "0.1em",
                fontSize: 14,
              }}
              autoComplete="off"
              spellCheck={false}
            />
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground"
              style={{ fontFamily: "var(--font-data)" }}
            >
              {callSign.length}/{MAX_CALLSIGN}
            </span>
          </div>
          <div
            className="mt-1 text-[9px] text-muted-foreground"
            style={{ fontFamily: "var(--font-data)" }}
          >
            A–Z, 0–9, space, dash, underscore. Min 2 chars.
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] text-red-400"
              style={{ fontFamily: "var(--font-data)" }}
            >
              ERROR: {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          type="button"
          onClick={handleDeploy}
          disabled={!canDeploy}
          whileHover={canDeploy ? { scale: 1.02 } : undefined}
          whileTap={canDeploy ? { scale: 0.98 } : undefined}
          className={cn(
            "mt-2 rounded-md border px-6 py-3 text-[12px] tracking-[0.3em] transition-all",
            canDeploy
              ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
              : "cursor-not-allowed border-primary/15 text-primary/30",
          )}
          style={{
            fontFamily: "var(--font-data)",
            textShadow: canDeploy ? "0 0 8px hsl(var(--primary) / 0.6)" : undefined,
            boxShadow: canDeploy ? "0 0 18px hsl(var(--primary) / 0.25)" : undefined,
          }}
        >
          {submitting ? "DEPLOYING…" : "[ DEPLOY TO ORBIT → ]"}
        </motion.button>

        <div className="h-6" />
      </div>
    </div>
  );
}
