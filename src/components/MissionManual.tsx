import { useState } from "react";
import { Book, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function MissionManual() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-pixel text-xs"
      >
        <Book className="w-4 h-4" />
        <span className="hidden sm:inline">Mission Manual</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-lg border border-border bg-card p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-pixel text-sm text-primary">Mission Manual</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-1">The 81-Square Method</h4>
                <p>
                  Break down your core goal into 8 sub-goals, each with 8 actionable steps. 
                  That's 64 actions orbiting your central mission.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-1">How to Use</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Click any sub-goal block to expand and edit actions</li>
                  <li>Double-click labels to rename goals</li>
                  <li>Check off completed actions to fuel your rocket</li>
                  <li>Use templates to jumpstart your journey</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-1">Launch Sequence</h4>
                <p className="text-xs">
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
