/**
 * HeaderBar — "Command Settings" HUD hub.
 *
 * WHY: Consolidates Manual / Templates / Reset behind a single Cog icon
 * to keep the top-right corner clean. Renders via portal to document.body
 * so it stays viewport-fixed regardless of scroll/transform contexts.
 */

import { useState, useRef, useEffect } from "react";
import { Settings, BookOpen, Wrench, Power, RotateCcw, Undo2, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePilotProfile } from "@/hooks/usePilotProfile";
import { useIsMobile } from "@/hooks/use-mobile";
import { PilotAvatar } from "./PilotAvatar";
import { PilotProfilePanel } from "./PilotProfilePanel";
import { ManualPanel } from "./header/ManualPanel";
import { TemplatePanel } from "./header/TemplatePanel";

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
  const isMobile = useIsMobile();

  const button = (
    <motion.button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-primary transition-colors hover:bg-primary/10"
      style={{
        filter: isActive ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))" : undefined,
        touchAction: "manipulation",
      }}
      initial={{ opacity: 0, y: -8, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.8 }}
      transition={{ duration: 0.15, delay: index * 0.05 }}
      aria-label={label}
    >
      <Icon className="w-4 h-4" strokeWidth={1.5} />
    </motion.button>
  );


  // On mobile, skip Tooltip wrapper — Radix Tooltip swallows the first tap on
  // touch devices, preventing onClick from firing.
  if (isMobile) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
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

// ─── Main Command Settings Hub ───────────────────────────────────

interface HeaderBarProps {
  onApplyTemplate: (labels: string[]) => void;
  onReset: () => void;
  canRevert?: boolean;
  onRevert?: () => void;
  sidebarOpen?: boolean;
}

export function HeaderBar({ onApplyTemplate, onReset, canRevert, onRevert, sidebarOpen = false }: HeaderBarProps) {
  const { signOut, user } = useAuth();
  const profile = usePilotProfile();
  const isMobile = useIsMobile();
  const [hubOpen, setHubOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hubRef = useRef<HTMLDivElement>(null);
  const justOpenedHub = useRef(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hubOpen) return;
    const handler = (e: MouseEvent) => {
      if (justOpenedHub.current) return;
      if (manualOpen || templateOpen || profileOpen) return;
      if (hubRef.current && !hubRef.current.contains(e.target as Node)) {
        setHubOpen(false);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [hubOpen, manualOpen, templateOpen, profileOpen]);

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
      setHubOpen(false);
    } else {
      setConfirmReset(true);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  const handleLogout = () => {
    if (confirmLogout) {
      signOut();
      setConfirmLogout(false);
      setHubOpen(false);
    } else {
      setConfirmLogout(true);
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(() => setConfirmLogout(false), 3000);
    }
  };

  const closeSubPanels = () => { setManualOpen(false); setTemplateOpen(false); setProfileOpen(false); };

  if (!mounted) return null;

  const handleCogClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHubOpen((open) => {
      const next = !open;
      if (open) closeSubPanels();
      if (next) {
        justOpenedHub.current = true;
        requestAnimationFrame(() => { justOpenedHub.current = false; });
      }
      return next;
    });
  };

  const cogButton = (
    <motion.button
      type="button"
      onClick={handleCogClick}
      className="relative flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl p-2.5 text-primary transition-colors"
      style={{
        background: hubOpen ? "hsl(var(--background) / 0.6)" : "transparent",
        backdropFilter: hubOpen ? "blur(8px)" : undefined,
        touchAction: "manipulation",
      }}
      animate={{ rotate: hubOpen ? 90 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      aria-label="Command Settings"
    >
      <Settings className="w-5 h-5" strokeWidth={1.5} />
    </motion.button>
  );


  return (
    <>
      {/* Pilot identity chip — top-left, anchored to page top (scrolls away) */}
      {user && profile.avatar_id && !sidebarOpen && (
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
        className={`fixed right-8 top-8 z-[100000] max-md:right-4 max-md:top-4 transition-opacity duration-200 ${
          sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
      {/* Cog master toggle — Tooltip skipped on mobile to avoid first-tap swallow */}
      {isMobile ? cogButton : (
        <Tooltip>
          <TooltipTrigger asChild>{cogButton}</TooltipTrigger>
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
        {hubOpen && (
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
            <SubIcon
              icon={BookOpen}
              label="Manual"
              onClick={() => { setManualOpen(!manualOpen); setTemplateOpen(false); }}
              isActive={manualOpen}
              index={0}
            />

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

      <ManualPanel isOpen={manualOpen} onClose={() => setManualOpen(false)} />
    </>
  );
}
