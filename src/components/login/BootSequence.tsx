/**
 * BootSequence — Ground-control boot overlay shown on the Login screen.
 *
 * WHY: Self-contained timed terminal-boot animation. Extracted from Login.tsx
 * to keep the page component focused on auth. Calls onComplete when finished.
 */

import { useState, useEffect } from "react";

const BOOT_LINES = [
  "[INIT] ORBIT 81 GROUND CONTROL v1.0",
  "[OK] Core systems ................ ONLINE",
  "[OK] Navigation matrix ........... LOADED",
  "[OK] Mission database ............ SYNCED",
  "[OK] Pilot auth module ........... READY",
  "[OK] Telemetry link .............. ACTIVE",
  "[OK] Storage subsystem ........... MOUNTED",
  "[OK] CPU Core allocation ......... 98%",
  "[OK] Display adapter ............. PIXELATED",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "WELCOME, PILOT. MISSION CONTROL ONLINE.",
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines(prev => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => { setDone(true); setTimeout(onComplete, 400); }, 600);
      }
    }, 120);
    return () => clearInterval(id);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-400 ${done ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col gap-1">
          {lines.map((line, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-data)',
              fontSize: 10,
              color: line.startsWith('[OK]') ? '#34A853' : line.startsWith('━') ? '#FF9D00' : '#FF9D00',
              letterSpacing: '0.05em',
              opacity: line.startsWith('WELCOME') ? 1 : 0.7,
              textShadow: line.startsWith('WELCOME') ? '0 0 10px #FF9D0060' : undefined,
            }}>
              {line}
            </div>
          ))}
          {!done && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#FF9D00', opacity: 0.5 }}>
                LOADING...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
