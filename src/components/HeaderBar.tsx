/**
 * HeaderBar — "Command Settings" HUD hub.
 *
 * WHY: Consolidates Manual / Templates / Reset behind a single Cog icon
 * to keep the top-right corner clean. Renders via portal to document.body
 * so it stays viewport-fixed regardless of scroll/transform contexts.
 */

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Settings, BookOpen, Wrench, Power, RotateCcw, Undo2, X, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TEMPLATES } from "@/constants/missionData";
import { usePilotProfile } from "@/hooks/usePilotProfile";
import { PilotAvatar } from "./PilotAvatar";
import { PilotProfilePanel } from "./PilotProfilePanel";

// ─── Sub-icon button ─────────────────────────────────────────────

function SubIcon({
  icon: Icon,
  label,
  onClick,
  isActive = false,
  index,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  index: number;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={onClick}
          className="relative p-2.5 rounded-lg text-primary transition-colors hover:bg-primary/10"
          style={{
            filter: isActive ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))" : undefined,
          }}
          initial={{ opacity: 0, y: -8, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.8 }}
          transition={{ duration: 0.15, delay: index * 0.05 }}
          aria-label={label}
        >
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className="text-[10px] font-bold border-primary/30 text-primary"
        style={{ fontFamily: "var(--font-data)", textShadow: "1px 1px 0px #000000" }}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Manual Panel ────────────────────────────────────────────────

function ManualPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const justOpened = useRef(false);

  useEffect(() => {
    if (isOpen) {
      justOpened.current = true;
      requestAnimationFrame(() => { justOpened.current = false; });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (justOpened.current) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop — closes on tap */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Centered modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-auto w-full max-w-md max-h-[85vh] rounded-xl bg-background/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          {/* Sticky header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-background/90 backdrop-blur-sm">
            <h3 className="text-sm font-bold text-primary" style={{ fontFamily: "var(--font-header)", textShadow: "1px 1px 0px #000" }}>
              Mission Manual
            </h3>
            <button onClick={onClose} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 text-muted-foreground" style={{ fontFamily: "var(--font-body)" }}>
            <div>
              <h4 className="font-bold text-foreground mb-1.5 text-xs" style={{ fontFamily: "var(--font-data)" }}>
                The 81-Square Method
              </h4>
              <p className="text-sm leading-relaxed">
                Break down your core goal into 8 sub-goals, each with 8 actionable steps.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1.5 text-xs" style={{ fontFamily: "var(--font-data)" }}>
                How to Use
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Click any sub-goal block to expand</li>
                <li>Double-click labels to rename</li>
                <li>Check off actions to fuel your rocket</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1.5 text-xs" style={{ fontFamily: "var(--font-data)" }}>
                Launch Sequence
              </h4>
              <p className="text-sm leading-relaxed">At 100%, witness the grand liftoff!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}

// ─── Template Panel ──────────────────────────────────────────────

function TemplatePanel({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (labels: string[]) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-full top-0 mr-3 z-[1000] w-56 rounded-lg bg-background/80 backdrop-blur-md shadow-2xl overflow-hidden"
        >
          <div className="p-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => { onSelect(t.labels); onClose(); }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {t.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Command Settings Hub ───────────────────────────────────

interface HeaderBarProps {
  onApplyTemplate: (labels: string[]) => void;
  onReset: () => void;
  canRevert?: boolean;
  onRevert?: () => void;
}

export function HeaderBar({ onApplyTemplate, onReset, canRevert, onRevert }: HeaderBarProps) {
  const { signOut, user } = useAuth();
  const profile = usePilotProfile();
  const [hubOpen, setHubOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!hubOpen) return;
    const handler = (e: MouseEvent) => {
      if (manualOpen || templateOpen || profileOpen) return;
      if (hubRef.current && !hubRef.current.contains(e.target as Node)) {
        setHubOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [hubOpen, manualOpen, templateOpen, profileOpen]);

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
      setHubOpen(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const handleLogout = () => {
    if (confirmLogout) {
      signOut();
      setConfirmLogout(false);
      setHubOpen(false);
    } else {
      setConfirmLogout(true);
      setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  const closeSubPanels = () => { setManualOpen(false); setTemplateOpen(false); };

  if (!mounted) return null;

  return (
    <>
      {/* Pilot identity chip — top-left, anchored to page top (scrolls away) */}
      {user && profile.avatar_id && (
        <div
          className="absolute top-8 left-8 z-50 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-background/50 pl-1.5 pr-3 py-1 backdrop-blur-md max-md:top-4 max-md:left-4"
          style={{ boxShadow: "0 0 12px hsl(var(--primary) / 0.18)" }}
        >
          <PilotAvatar
            id={profile.avatar_id}
            size={44}
            crop="face"
            bordered={false}
            transparent
          />
          <span
            className="text-[12px] tracking-[0.25em] text-primary/90 whitespace-nowrap"
            style={{ fontFamily: "var(--font-data)", textShadow: "1px 1px 0 #000" }}
          >
            {profile.call_sign?.toUpperCase()}
          </span>
        </div>
      )}

      <div
        ref={hubRef}
        className="!fixed top-8 right-8 z-[9999] max-md:top-4 max-md:right-4"
      >
      {/* Cog master toggle — hide when modal is open */}
      {!manualOpen && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              onClick={() => { setHubOpen(!hubOpen); if (hubOpen) closeSubPanels(); }}
              className="relative p-2.5 rounded-xl text-primary transition-colors"
              style={{
                background: hubOpen ? "hsl(var(--background) / 0.6)" : "transparent",
                backdropFilter: hubOpen ? "blur(8px)" : undefined,
              }}
              animate={{ rotate: hubOpen ? 90 : 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              aria-label="Command Settings"
            >
              <Settings className="w-5 h-5" strokeWidth={1.5} />
            </motion.button>
          </TooltipTrigger>
          {!hubOpen && (
            <TooltipContent
              side="left"
              className="text-[10px] font-bold border-primary/30 text-primary"
              style={{ fontFamily: "var(--font-data)", textShadow: "1px 1px 0px #000000" }}
            >
              Settings
            </TooltipContent>
          )}
        </Tooltip>
      )}

      {/* Sub-menu fly-out */}
      <AnimatePresence>
        {hubOpen && !manualOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 flex flex-col items-center gap-1 rounded-xl py-2 px-1"
            style={{
              background: "hsl(var(--background) / 0.5)",
              backdropFilter: "blur(12px)",
            }}
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <SubIcon
                icon={BookOpen}
                label="Manual"
                onClick={() => { setManualOpen(!manualOpen); setTemplateOpen(false); }}
                isActive={manualOpen}
                index={0}
              />
              <ManualPanel isOpen={manualOpen} onClose={() => setManualOpen(false)} />
            </div>

            <div className="relative">
              <SubIcon
                icon={Wrench}
                label="Templates"
                onClick={() => { setTemplateOpen(!templateOpen); setManualOpen(false); }}
                isActive={templateOpen}
                index={1}
              />
              <TemplatePanel isOpen={templateOpen} onClose={() => setTemplateOpen(false)} onSelect={onApplyTemplate} />
            </div>

            {user && profile.avatar_id && (
              <SubIcon
                icon={User}
                label="Pilot Profile"
                onClick={() => { setProfileOpen(true); setManualOpen(false); setTemplateOpen(false); }}
                isActive={profileOpen}
                index={1.5}
              />
            )}

            <div className="w-6 h-px bg-primary/20 my-0.5" />

            <SubIcon
              icon={RotateCcw}
              label={confirmReset ? "Confirm?" : "Reset"}
              onClick={handleReset}
              isActive={confirmReset}
              index={2}
            />

            {canRevert && (
              <SubIcon
                icon={Undo2}
                label="Revert"
                onClick={() => { onRevert?.(); setHubOpen(false); }}
                isActive={true}
                index={2.5}
              />
            )}

            <SubIcon
              icon={Power}
              label={confirmLogout ? "Confirm?" : "Logout"}
              onClick={handleLogout}
              isActive={confirmLogout}
              index={3}
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <PilotProfilePanel
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentAvatarId={profile.avatar_id}
        currentCallSign={profile.call_sign}
        onSave={async (next) => {
          const result = await profile.saveProfile(next);
          if (!result.error) setHubOpen(false);
          return result;
        }}
      />
    </>,
    document.body,
  );
}
