import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { BookOpen, Wrench, Power, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Reusable icon button with golden glow hover
function UtilityIcon({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive = false 
}: { 
  icon: React.ElementType; 
  label: string; 
  onClick: () => void; 
  isActive?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={onClick}
          className={`relative p-2 rounded-md text-primary transition-colors hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.7)] ${
            isActive ? "" : "hover:text-primary"
          }`}
          style={{
            filter: isActive ? "drop-shadow(0 0 6px hsl(var(--primary) / 0.7))" : undefined,
          }}
          aria-label={label}
        >
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
        </motion.button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className="text-[10px] font-bold border-primary/30"
        style={{ 
          fontFamily: 'var(--font-data)',
          textShadow: '1px 1px 0px #000000',
          color: '#FFD700',
        }}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

// --- Manual Panel ---
function ManualPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 z-[1000] w-[85vw] max-w-sm rounded-lg border-2 border-border bg-card/95 backdrop-blur-sm p-4 shadow-2xl"
          style={{
            boxShadow: 'inset -2px -2px 0 hsl(220 15% 8%), inset 2px 2px 0 hsl(220 15% 22%), 4px 4px 0 hsl(0 0% 0% / 0.5)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 
              className="text-xs font-bold text-primary"
              style={{ fontFamily: 'var(--font-header)' }}
            >
              Mission Manual
            </h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Close">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
              <h4 className="font-bold text-foreground mb-1 text-[10px]" style={{ fontFamily: 'var(--font-data)' }}>The 81-Square Method</h4>
              <p className="text-[11px] leading-relaxed">Break down your core goal into 8 sub-goals, each with 8 actionable steps.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1 text-[10px]" style={{ fontFamily: 'var(--font-data)' }}>How to Use</h4>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li>Click any sub-goal block to expand</li>
                <li>Double-click labels to rename</li>
                <li>Check off actions to fuel your rocket</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1 text-[10px]" style={{ fontFamily: 'var(--font-data)' }}>Launch Sequence</h4>
              <p className="text-[11px] leading-relaxed">At 100%, witness the grand liftoff!</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --- Template Panel ---
interface Template {
  name: string;
  labels: string[];
}

const TEMPLATES: Template[] = [
  { name: "Solopreneur Startup", labels: ["Product", "Marketing", "Sales", "Finance", "Network", "Skills", "Systems", "Mindset"] },
  { name: "Wealth Building", labels: ["Income", "Savings", "Investing", "Assets", "Debt", "Budget", "Skills", "Network"] },
  { name: "Healthy Lifestyle", labels: ["Nutrition", "Exercise", "Sleep", "Mental", "Habits", "Social", "Medical", "Goals"] },
  { name: "Student Success", labels: ["Studies", "Projects", "Network", "Skills", "Health", "Finance", "Career", "Balance"] },
  { name: "Creative Career", labels: ["Craft", "Portfolio", "Clients", "Income", "Learning", "Network", "Brand", "Balance"] },
];

function TemplatePanel({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (labels: string[]) => void }) {
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
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 top-full mt-2 z-[1000] w-56 rounded-lg border-2 border-border bg-card/95 backdrop-blur-sm shadow-2xl overflow-hidden"
          style={{
            boxShadow: 'inset -2px -2px 0 hsl(220 15% 8%), inset 2px 2px 0 hsl(220 15% 20%), 4px 4px 0 hsl(0 0% 0% / 0.3)',
          }}
        >
          <div className="p-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => { onSelect(t.labels); onClose(); }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors rounded"
                style={{ fontFamily: 'var(--font-body)' }}
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

// --- Main Header Bar ---
interface HeaderBarProps {
  onApplyTemplate: (labels: string[]) => void;
  onReset: () => void;
}

export function HeaderBar({ onApplyTemplate, onReset }: HeaderBarProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div className="!fixed top-8 right-10 z-[9999] flex items-center gap-6 max-md:top-4 max-md:right-4 max-md:scale-[0.85] max-md:origin-top-right">
      <div className="relative flex items-center gap-6 bg-transparent border-0 shadow-none outline-none">
        <UtilityIcon
          icon={BookOpen}
          label="Manual"
          onClick={() => { setManualOpen(!manualOpen); setTemplateOpen(false); }}
          isActive={manualOpen}
        />
        <UtilityIcon
          icon={Wrench}
          label="Templates"
          onClick={() => { setTemplateOpen(!templateOpen); setManualOpen(false); }}
          isActive={templateOpen}
        />
        <UtilityIcon
          icon={Power}
          label={confirmReset ? "Confirm Reset?" : "Reset Session"}
          onClick={handleReset}
          isActive={confirmReset}
        />

        <ManualPanel isOpen={manualOpen} onClose={() => setManualOpen(false)} />
        <TemplatePanel isOpen={templateOpen} onClose={() => setTemplateOpen(false)} onSelect={onApplyTemplate} />
      </div>
    </div>,
    document.body
  );
}
