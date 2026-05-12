import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { AVATARS, type AvatarId } from "@/assets/avatars";
import { PilotAvatar } from "./PilotAvatar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PilotProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarId: AvatarId | null;
  currentCallSign: string;
  onSave: (next: { avatar_id: AvatarId; call_sign: string }) => Promise<{ error: string | null }>;
}

const MAX_CALLSIGN = 16;
const CALLSIGN_RE = /^[A-Za-z0-9 _-]*$/;

export function PilotProfilePanel({
  isOpen,
  onClose,
  currentAvatarId,
  currentCallSign,
  onSave,
}: PilotProfilePanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<AvatarId | null>(currentAvatarId);
  const [callSign, setCallSign] = useState<string>(
    currentCallSign === "Pilot" ? "" : currentCallSign,
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelected(currentAvatarId);
      setCallSign(currentCallSign === "Pilot" ? "" : currentCallSign);
    }
  }, [isOpen, currentAvatarId, currentCallSign]);

  if (!isOpen) return null;

  const trimmed = callSign.trim();
  const canSave = !!selected && trimmed.length >= 2 && !saving;

  const handleNameChange = (v: string) => {
    if (v.length > MAX_CALLSIGN) return;
    if (!CALLSIGN_RE.test(v)) return;
    setCallSign(v);
  };

  const handleSave = async () => {
    if (!selected || trimmed.length < 2) return;
    setSaving(true);
    const { error } = await onSave({ avatar_id: selected, call_sign: trimmed });
    setSaving(false);
    if (error) {
      toast({ title: "SAVE FAILED", description: error, variant: "destructive" });
      return;
    }
    toast({ title: "PILOT PROFILE UPDATED" });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-auto flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-background/95 shadow-2xl backdrop-blur-md"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-primary/10 bg-background/90 px-4 py-3 backdrop-blur-sm">
            <h3
              className="text-sm font-bold text-primary"
              style={{ fontFamily: "var(--font-header)", textShadow: "1px 1px 0 #000" }}
            >
              Pilot Profile
            </h3>
            <button
              onClick={onClose}
              className="flex min-h-[36px] min-w-[36px] items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div>
              <div
                className="mb-2 text-[10px] tracking-[0.3em] text-primary/80"
                style={{ fontFamily: "var(--font-data)" }}
              >
                AVATAR
              </div>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map((a) => {
                  const active = a.id === selected;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelected(a.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-md border p-1.5 transition-colors",
                        active
                          ? "border-primary bg-primary/5"
                          : "border-primary/15 hover:border-primary/40",
                      )}
                      style={{
                        boxShadow: active ? `0 0 12px ${a.accent}55` : undefined,
                      }}
                      aria-pressed={active}
                      aria-label={a.name}
                    >
                      <PilotAvatar id={a.id} size={56} glow={active} />
                      <span
                        className="text-[8px] tracking-[0.2em]"
                        style={{
                          fontFamily: "var(--font-data)",
                          color: active ? a.accent : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {a.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
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
                  className="w-full rounded-md border border-primary/30 bg-background/60 px-3 py-2 text-foreground outline-none focus:border-primary"
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
            </div>
          </div>

          <div className="sticky bottom-0 border-t border-primary/10 bg-background/90 p-3 backdrop-blur-sm">
            <button
              type="button"
              onClick={handleSave}
              disabled={!canSave}
              className={cn(
                "w-full rounded-md border px-4 py-2 text-[11px] tracking-[0.3em] transition-all",
                canSave
                  ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                  : "cursor-not-allowed border-primary/15 text-primary/30",
              )}
              style={{ fontFamily: "var(--font-data)" }}
            >
              {saving ? "SAVING…" : "[ SAVE PROFILE ]"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}
