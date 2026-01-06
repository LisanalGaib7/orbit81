import { motion } from "framer-motion";

interface PixelRocketBodyProps {
  stage: "idle" | "ignition" | "liftoff" | "orbit" | "struggle" | "ascending";
  showExhaust?: boolean;
  exhaustIntensity?: number; // 0-1
}

export function PixelRocketBody({ 
  stage, 
  showExhaust = false,
  exhaustIntensity = 0.5 
}: PixelRocketBodyProps) {
  const isActive = stage === "ignition" || stage === "liftoff" || stage === "struggle" || stage === "ascending";
  const isOrbit = stage === "orbit";
  
  // Exhaust size based on intensity
  const exhaustHeight = 16 + exhaustIntensity * 32;
  const exhaustWidth = 6 + exhaustIntensity * 6;
  
  return (
    // Rocket-Assembly: Single parent container for strict alignment
    <div 
      className="relative"
      style={{ 
        imageRendering: "pixelated",
        // Fixed dimensions matching rocket structure
      }}
    >
      {/* Rocket Image - static relative element (z-index: 2) */}
      <div className="relative z-[2]">
      {/* Pixel Rocket Structure */}
      <div className="relative">
        {/* Nose cone - 3 rows of pixels */}
        <div className="flex flex-col items-center">
          <div className="w-1 h-1 bg-muted-foreground" />
          <div className="flex">
            <div className="w-1 h-1 bg-muted-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted-foreground" />
          </div>
          <div className="flex">
            <div className="w-1 h-1 bg-muted-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted-foreground" />
          </div>
        </div>
        
        {/* Body - main section */}
        <div className="flex flex-col items-center">
          {/* Body row 1 */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted" />
          </div>
          {/* Body row 2 - with window */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div 
              className="w-1 h-1"
              style={{ 
                backgroundColor: isOrbit ? "hsl(200, 100%, 60%)" : "hsl(var(--primary))",
                boxShadow: isOrbit ? "0 0 4px hsl(200, 100%, 60%)" : "none"
              }}
            />
            <div 
              className="w-1 h-1"
              style={{ 
                backgroundColor: isOrbit ? "hsl(200, 100%, 70%)" : "hsl(var(--primary))",
              }}
            />
            <div 
              className="w-1 h-1"
              style={{ 
                backgroundColor: isOrbit ? "hsl(200, 100%, 60%)" : "hsl(var(--primary))",
              }}
            />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted" />
          </div>
          {/* Body row 3 */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted" />
          </div>
          {/* Body row 4 - stripe */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-primary/50" />
            <div className="w-1 h-1 bg-primary/50" />
            <div className="w-1 h-1 bg-primary/50" />
            <div className="w-1 h-1 bg-primary/50" />
            <div className="w-1 h-1 bg-primary/50" />
            <div className="w-1 h-1 bg-muted" />
          </div>
          {/* Body row 5 */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted" />
          </div>
        </div>
        
        {/* Fins and engine section */}
        <div className="flex flex-col items-center">
          {/* Fin row 1 */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-secondary-foreground" />
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted" />
          </div>
        {/* Fin row 2 - nozzle */}
          <div className="flex">
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted-foreground" />
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted" />
            <div className="w-1 h-1 bg-muted" />
          </div>
        </div>
      </div>
      </div>
      
      {/* Flame/Exhaust Container - absolute positioned, z-index: 1, pinned to bottom */}
      {showExhaust && (
        <div 
          className="absolute z-[1] flex flex-col items-center"
          style={{ 
            imageRendering: "pixelated",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "-2px" // Tuck perfectly under nozzle
          }}
        >
          <motion.div
            className="flex flex-col items-center"
            animate={{ 
              scaleY: [1, 1.15, 0.95, 1.1, 1],
            }}
            transition={{ duration: 0.08, repeat: Infinity }}
          >
            {/* Fire core - white/yellow */}
            <div className="flex">
              <div className="w-1 h-1 bg-yellow-200" />
              <div className="w-1 h-1 bg-white" />
              <div className="w-1 h-1 bg-yellow-200" />
            </div>
            
            {/* Fire mid - yellow/orange */}
            {exhaustIntensity > 0.3 && (
              <>
                <div className="flex">
                  <div className="w-1 h-1 bg-yellow-300" />
                  <div className="w-1 h-1 bg-yellow-200" />
                  <div className="w-1 h-1 bg-white" />
                  <div className="w-1 h-1 bg-yellow-200" />
                  <div className="w-1 h-1 bg-yellow-300" />
                </div>
                <motion.div 
                  className="flex"
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 0.05, repeat: Infinity }}
                >
                  <div className="w-1 h-1 bg-orange-400" />
                  <div className="w-1 h-1 bg-yellow-300" />
                  <div className="w-1 h-1 bg-yellow-200" />
                  <div className="w-1 h-1 bg-yellow-300" />
                  <div className="w-1 h-1 bg-orange-400" />
                </motion.div>
              </>
            )}
            
            {/* Fire outer - orange/red */}
            {exhaustIntensity > 0.5 && (
              <>
                <motion.div 
                  className="flex"
                  animate={{ opacity: [1, 0.7, 0.9, 1] }}
                  transition={{ duration: 0.06, repeat: Infinity }}
                >
                  <div className="w-1 h-1 bg-orange-500" />
                  <div className="w-1 h-1 bg-orange-400" />
                  <div className="w-1 h-1 bg-yellow-400" />
                  <div className="w-1 h-1 bg-orange-400" />
                  <div className="w-1 h-1 bg-orange-500" />
                </motion.div>
                <motion.div 
                  className="flex"
                  animate={{ opacity: [0.9, 0.6, 0.8, 0.9] }}
                  transition={{ duration: 0.07, repeat: Infinity }}
                >
                  <div className="w-1 h-1 bg-red-500" />
                  <div className="w-1 h-1 bg-orange-500" />
                  <div className="w-1 h-1 bg-orange-400" />
                  <div className="w-1 h-1 bg-orange-500" />
                  <div className="w-1 h-1 bg-red-500" />
                </motion.div>
              </>
            )}
            
            {/* Fire tail - red (high intensity) */}
            {exhaustIntensity > 0.7 && (
              <>
                <motion.div 
                  className="flex"
                  animate={{ opacity: [0.8, 0.5, 0.7, 0.8] }}
                  transition={{ duration: 0.08, repeat: Infinity }}
                >
                  <div className="w-1 h-1 bg-red-600" />
                  <div className="w-1 h-1 bg-red-500" />
                  <div className="w-1 h-1 bg-orange-500" />
                  <div className="w-1 h-1 bg-red-500" />
                  <div className="w-1 h-1 bg-red-600" />
                </motion.div>
                <motion.div 
                  className="flex"
                  animate={{ opacity: [0.6, 0.3, 0.5, 0.6] }}
                  transition={{ duration: 0.1, repeat: Infinity }}
                >
                  <div className="w-1 h-1 bg-red-700/80" />
                  <div className="w-1 h-1 bg-red-600/80" />
                  <div className="w-1 h-1 bg-red-500/80" />
                  <div className="w-1 h-1 bg-red-600/80" />
                  <div className="w-1 h-1 bg-red-700/80" />
                </motion.div>
              </>
            )}
            
            {/* Maximum intensity - extended flame */}
            {exhaustIntensity > 0.9 && (
              <motion.div 
                className="flex"
                animate={{ opacity: [0.4, 0.2, 0.3, 0.4] }}
                transition={{ duration: 0.12, repeat: Infinity }}
              >
                <div className="w-1 h-1 bg-red-800/60" />
                <div className="w-1 h-1 bg-red-700/60" />
                <div className="w-1 h-1 bg-red-700/60" />
                <div className="w-1 h-1 bg-red-800/60" />
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}