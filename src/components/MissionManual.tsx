import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MissionManual() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Trigger Button - Pixel style with custom "?" icon */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`pixel-button flex items-center justify-center gap-1.5 font-pixel text-[10px] sm:text-[12px] text-muted-foreground hover:text-foreground ${isOpen ? 'pressed' : ''}`}
        style={{ imageRendering: 'pixelated', minWidth: '36px', minHeight: '36px' }}
        aria-label="Open Mission Manual"
      >
        {/* Custom Pixel "?" Icon */}
        <svg 
          width="14" 
          height="14" 
          viewBox="0 0 8 8" 
          fill="currentColor"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Pixel question mark */}
          <rect x="2" y="0" width="1" height="1" />
          <rect x="3" y="0" width="1" height="1" />
          <rect x="4" y="0" width="1" height="1" />
          <rect x="5" y="0" width="1" height="1" />
          <rect x="1" y="1" width="1" height="1" />
          <rect x="5" y="1" width="1" height="1" />
          <rect x="5" y="2" width="1" height="1" />
          <rect x="4" y="3" width="1" height="1" />
          <rect x="3" y="4" width="1" height="1" />
          <rect x="3" y="6" width="1" height="1" />
        </svg>
      </button>

      {/* Popover Content - Anchored below button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 z-[1000] w-[85vw] max-w-sm rounded-lg border-2 border-border bg-card/95 backdrop-blur-sm p-4 shadow-2xl"
            style={{ 
              imageRendering: 'pixelated',
              boxShadow: 'inset -2px -2px 0 hsl(220 15% 8%), inset 2px 2px 0 hsl(220 15% 22%), 4px 4px 0 hsl(0 0% 0% / 0.5)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-pixel text-[11px] text-primary">Mission Manual</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors pixel-button p-1"
                aria-label="Close Mission Manual"
              >
                <X className="w-3.5 h-3.5" style={{ imageRendering: 'pixelated' }} />
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-muted-foreground font-pixel-mono">
              <div>
                <h4 className="font-pixel text-[8px] text-foreground mb-1">The 81-Square Method</h4>
                <p className="text-[11px] leading-relaxed">
                  Break down your core goal into 8 sub-goals, each with 8 actionable steps.
                </p>
              </div>
              
              <div>
                <h4 className="font-pixel text-[8px] text-foreground mb-1">How to Use</h4>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>Click any sub-goal block to expand</li>
                  <li>Double-click labels to rename</li>
                  <li>Check off actions to fuel your rocket</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-pixel text-[8px] text-foreground mb-1">Launch Sequence</h4>
                <p className="text-[11px] leading-relaxed">
                  At 100%, witness the grand liftoff!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}