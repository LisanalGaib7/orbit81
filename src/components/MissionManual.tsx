import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MissionManual() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button - Pixel style with custom "?" icon */}
      <button
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

      {/* Modal Overlay + Content - Fixed position, high z-index */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - Dims background and blocks interaction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-[1000]"
              onClick={() => setIsOpen(false)}
              style={{ imageRendering: 'pixelated' }}
            />
            
            {/* Modal Content - Centered, fixed position */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001] w-[90vw] max-w-md rounded-lg border-2 border-border bg-card p-5 shadow-2xl"
              style={{ 
                imageRendering: 'pixelated',
                boxShadow: 'inset -3px -3px 0 hsl(220 15% 8%), inset 3px 3px 0 hsl(220 15% 22%), 6px 6px 0 hsl(0 0% 0% / 0.4)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-[12px] text-primary">Mission Manual</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors pixel-button p-1.5"
                  aria-label="Close Mission Manual"
                >
                  <X className="w-4 h-4" style={{ imageRendering: 'pixelated' }} />
                </button>
              </div>
              
              <div className="space-y-4 text-sm text-muted-foreground font-pixel-mono">
                <div>
                  <h4 className="font-pixel text-[9px] text-foreground mb-1.5">The 81-Square Method</h4>
                  <p className="text-base leading-relaxed">
                    Break down your core goal into 8 sub-goals, each with 8 actionable steps. 
                    That's 64 actions orbiting your central mission.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-pixel text-[9px] text-foreground mb-1.5">How to Use</h4>
                  <ul className="list-disc list-inside space-y-1 text-base">
                    <li>Click any sub-goal block to expand and edit actions</li>
                    <li>Double-click labels to rename goals</li>
                    <li>Check off completed actions to fuel your rocket</li>
                    <li>Use templates to jumpstart your journey</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-pixel text-[9px] text-foreground mb-1.5">Launch Sequence</h4>
                  <p className="text-base leading-relaxed">
                    Watch your rocket power up as you complete actions. 
                    At 100%, witness the grand liftoff celebration!
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}