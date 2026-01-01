import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MissionManual() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pixel-button flex items-center justify-center gap-1.5 font-pixel text-[8px] sm:text-[10px] text-muted-foreground hover:text-foreground ${isOpen ? 'pressed' : ''}`}
        style={{ imageRendering: 'pixelated' }}
      >
        <HelpCircle className="w-3.5 h-3.5" style={{ imageRendering: 'pixelated' }} />
        <span className="hidden sm:inline">?</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-12 z-50 w-80 sm:w-96 rounded-lg border-2 border-border bg-card p-4 shadow-xl"
            style={{ 
              imageRendering: 'pixelated',
              boxShadow: 'inset -2px -2px 0 hsl(220 15% 8%), inset 2px 2px 0 hsl(220 15% 20%), 4px 4px 0 hsl(0 0% 0% / 0.3)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-pixel text-[10px] text-primary">Mission Manual</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors pixel-button p-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground font-pixel-mono">
              <div>
                <h4 className="font-pixel text-[8px] text-foreground mb-1">The 81-Square Method</h4>
                <p className="text-base leading-relaxed">
                  Break down your core goal into 8 sub-goals, each with 8 actionable steps. 
                  That's 64 actions orbiting your central mission.
                </p>
              </div>
              
              <div>
                <h4 className="font-pixel text-[8px] text-foreground mb-1">How to Use</h4>
                <ul className="list-disc list-inside space-y-1 text-base">
                  <li>Click any sub-goal block to expand and edit actions</li>
                  <li>Double-click labels to rename goals</li>
                  <li>Check off completed actions to fuel your rocket</li>
                  <li>Use templates to jumpstart your journey</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-pixel text-[8px] text-foreground mb-1">Launch Sequence</h4>
                <p className="text-base leading-relaxed">
                  Watch your rocket power up as you complete actions. 
                  At 100%, witness the grand liftoff celebration!
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}