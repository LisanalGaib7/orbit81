import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   DECORATIVE SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Pixel Google "G" ─────────────────────────────────────────── */
const PIXEL_G: [number, number, string][] = [
  [0,2,'#4285F4'],[0,3,'#4285F4'],[0,4,'#4285F4'],[0,5,'#4285F4'],
  [1,1,'#EA4335'],[1,6,'#4285F4'],
  [2,0,'#EA4335'],[2,7,'#4285F4'],
  [3,0,'#EA4335'],
  [4,0,'#FBBC05'],[4,4,'#4285F4'],[4,5,'#4285F4'],[4,6,'#4285F4'],[4,7,'#4285F4'],
  [5,0,'#FBBC05'],[5,7,'#4285F4'],
  [6,0,'#34A853'],[6,7,'#34A853'],
  [7,1,'#34A853'],[7,6,'#34A853'],
  [8,2,'#34A853'],[8,3,'#34A853'],[8,4,'#34A853'],[8,5,'#34A853'],
];

function PixelGoogleG({ size = 32 }: { size?: number }) {
  const px = size / 9;
  return (
    <div className="relative" style={{ width: size, height: size, imageRendering: 'pixelated' }}>
      {PIXEL_G.map(([row, col, color], i) => (
        <div key={i} className="absolute" style={{
          width: px, height: px, top: row * px, left: col * px,
          backgroundColor: color, boxShadow: `0 0 ${px}px ${color}40`,
        }} />
      ))}
    </div>
  );
}

/* ─── L-Shaped corner bracket ──────────────────────────────────── */
function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const size = 40;
  const t = 2;
  const isTop = position.startsWith('t');
  const isLeft = position.endsWith('l');

  return (
    <div className="absolute pointer-events-none" style={{
      top: isTop ? 12 : undefined,
      bottom: !isTop ? 12 : undefined,
      left: isLeft ? 12 : undefined,
      right: !isLeft ? 12 : undefined,
    }}>
      {/* L shape */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Horizontal arm */}
        <div className="absolute" style={{
          height: t, width: size,
          backgroundColor: '#FFD700',
          boxShadow: '0 0 4px #FFD70060',
          top: isTop ? 0 : size - t,
          left: 0,
          opacity: 0.5,
        }} />
        {/* Vertical arm */}
        <div className="absolute" style={{
          width: t, height: size,
          backgroundColor: '#FFD700',
          boxShadow: '0 0 4px #FFD70060',
          left: isLeft ? 0 : size - t,
          top: 0,
          opacity: 0.5,
        }} />
        {/* Corner rivet */}
        <div className="absolute" style={{
          width: 5, height: 5,
          top: isTop ? -1 : size - 4,
          left: isLeft ? -1 : size - 4,
        }}>
          <div className="w-full h-full rounded-full bg-zinc-600 border border-zinc-500" />
        </div>
      </div>
    </div>
  );
}

/* ─── Status label (flickering corner HUD text) ────────────────── */
function StatusLabel({ text, position, color, delay }: {
  text: string; position: string; color: string; delay: number;
}) {
  return (
    <div
      className="absolute pointer-events-none animate-pulse hidden sm:block"
      style={{
        ...parsePosition(position),
        fontFamily: 'var(--font-data)',
        fontSize: 8,
        color,
        opacity: 0.35,
        letterSpacing: '0.15em',
        animationDelay: `${delay}s`,
        animationDuration: '3s',
      }}
    >
      {text}
    </div>
  );
}

function parsePosition(pos: string): Record<string, string> {
  const result: Record<string, string> = {};
  pos.split(' ').forEach(p => {
    const [k, v] = p.split(':');
    result[k] = v;
  });
  return result;
}

/* ─── Dense circuit network SVG ────────────────────────────────── */
function CircuitNetwork() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 1000 700" fill="none">
      {/* Left vertical bus */}
      <line x1="80" y1="0" x2="80" y2="700" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="120" y1="0" x2="120" y2="700" stroke="#FFD700" strokeWidth="0.3" opacity="0.4" />
      <line x1="50" y1="0" x2="50" y2="700" stroke="#FFD700" strokeWidth="0.25" opacity="0.2" />
      {/* Right vertical bus */}
      <line x1="920" y1="0" x2="920" y2="700" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="880" y1="0" x2="880" y2="700" stroke="#FFD700" strokeWidth="0.3" opacity="0.4" />
      <line x1="950" y1="0" x2="950" y2="700" stroke="#FFD700" strokeWidth="0.25" opacity="0.2" />
      {/* Top horizontal */}
      <line x1="0" y1="60" x2="1000" y2="60" stroke="#00BCD4" strokeWidth="0.3" opacity="0.3" />
      <line x1="0" y1="30" x2="1000" y2="30" stroke="#00BCD4" strokeWidth="0.2" opacity="0.15" />
      {/* Bottom horizontal */}
      <line x1="0" y1="640" x2="1000" y2="640" stroke="#00BCD4" strokeWidth="0.3" opacity="0.3" />
      <line x1="0" y1="670" x2="1000" y2="670" stroke="#00BCD4" strokeWidth="0.2" opacity="0.15" />
      {/* Cross branches left */}
      <line x1="80" y1="120" x2="200" y2="120" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="80" y1="180" x2="150" y2="180" stroke="#FFD700" strokeWidth="0.3" opacity="0.3" />
      <line x1="80" y1="250" x2="180" y2="250" stroke="#00BCD4" strokeWidth="0.4" />
      <line x1="80" y1="320" x2="140" y2="320" stroke="#00BCD4" strokeWidth="0.3" opacity="0.25" />
      <line x1="80" y1="400" x2="220" y2="400" stroke="#FFD700" strokeWidth="0.4" />
      <line x1="220" y1="400" x2="220" y2="450" stroke="#FFD700" strokeWidth="0.4" />
      <line x1="80" y1="550" x2="160" y2="550" stroke="#00BCD4" strokeWidth="0.4" />
      <line x1="50" y1="200" x2="120" y2="200" stroke="#FFD700" strokeWidth="0.25" opacity="0.2" />
      <line x1="50" y1="480" x2="120" y2="480" stroke="#00BCD4" strokeWidth="0.25" opacity="0.2" />
      {/* Cross branches right */}
      <line x1="920" y1="150" x2="800" y2="150" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="920" y1="220" x2="860" y2="220" stroke="#FFD700" strokeWidth="0.3" opacity="0.3" />
      <line x1="920" y1="300" x2="830" y2="300" stroke="#00BCD4" strokeWidth="0.4" />
      <line x1="920" y1="380" x2="870" y2="380" stroke="#00BCD4" strokeWidth="0.3" opacity="0.25" />
      <line x1="920" y1="480" x2="780" y2="480" stroke="#FFD700" strokeWidth="0.4" />
      <line x1="780" y1="480" x2="780" y2="520" stroke="#FFD700" strokeWidth="0.4" />
      <line x1="920" y1="600" x2="850" y2="600" stroke="#00BCD4" strokeWidth="0.4" />
      <line x1="950" y1="260" x2="880" y2="260" stroke="#FFD700" strokeWidth="0.25" opacity="0.2" />
      <line x1="950" y1="540" x2="880" y2="540" stroke="#00BCD4" strokeWidth="0.25" opacity="0.2" />
      {/* Blinking nodes at intersections */}
      <circle cx="200" cy="120" r="3" fill="#00BCD4" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" /></circle>
      <circle cx="180" cy="250" r="2.5" fill="#00BCD4" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.5s" repeatCount="indefinite" begin="0.5s" /></circle>
      <circle cx="220" cy="450" r="3" fill="#FFD700" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite" begin="1s" /></circle>
      <circle cx="160" cy="550" r="2.5" fill="#00BCD4" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" begin="1.5s" /></circle>
      <circle cx="800" cy="150" r="3" fill="#FFD700" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" begin="0.3s" /></circle>
      <circle cx="830" cy="300" r="2.5" fill="#00BCD4" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" begin="0.8s" /></circle>
      <circle cx="780" cy="520" r="3" fill="#FFD700" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite" begin="2s" /></circle>
      <circle cx="850" cy="600" r="2.5" fill="#00BCD4" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.5s" repeatCount="indefinite" begin="1.2s" /></circle>
      <circle cx="150" cy="180" r="2" fill="#FFD700" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" begin="0.7s" /></circle>
      <circle cx="860" cy="220" r="2" fill="#FFD700" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" begin="1.8s" /></circle>
      {/* Diagonal accents */}
      <line x1="120" y1="80" x2="200" y2="50" stroke="#FFD700" strokeWidth="0.3" opacity="0.4" />
      <line x1="880" y1="620" x2="800" y2="650" stroke="#00BCD4" strokeWidth="0.3" opacity="0.4" />
      <line x1="50" y1="100" x2="120" y2="60" stroke="#FFD700" strokeWidth="0.2" opacity="0.2" />
      <line x1="950" y1="580" x2="880" y2="640" stroke="#00BCD4" strokeWidth="0.2" opacity="0.2" />
      {/* Connecting traces to center */}
      <line x1="200" y1="350" x2="350" y2="350" stroke="#FFD700" strokeWidth="0.3" opacity="0.3" />
      <line x1="800" y1="350" x2="650" y2="350" stroke="#FFD700" strokeWidth="0.3" opacity="0.3" />
      <line x1="350" y1="350" x2="350" y2="300" stroke="#FFD700" strokeWidth="0.2" opacity="0.2" />
      <line x1="650" y1="350" x2="650" y2="300" stroke="#FFD700" strokeWidth="0.2" opacity="0.2" />
      {/* Data stream gradients */}
      <defs>
        <linearGradient id="stream-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFD700" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="stream-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00BCD4" stopOpacity="0" />
          <stop offset="50%" stopColor="#00BCD4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00BCD4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Horizontal data streams */}
      <rect x="0" y="119" width="60" height="2" fill="url(#stream-gold)" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="-60,0;200,0" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="1000" y="299" width="60" height="2" fill="url(#stream-gold)" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="60,0;-200,0" dur="4s" repeatCount="indefinite" begin="1s" />
      </rect>
      {/* Vertical data streams */}
      <rect x="79" y="0" width="2" height="40" fill="url(#stream-cyan)" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,-40;0,700" dur="5s" repeatCount="indefinite" />
      </rect>
      <rect x="919" y="700" width="2" height="40" fill="url(#stream-cyan)" opacity="0.3">
        <animateTransform attributeName="transform" type="translate" values="0,40;0,-700" dur="6s" repeatCount="indefinite" begin="2s" />
      </rect>
    </svg>
  );
}

/* ─── Data pulse traveling along circuit ───────────────────────── */
function DataPulse({ path, color, delay, duration }: {
  path: string; color: string; delay: number; duration: number;
}) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 700" preserveAspectRatio="none">
      <defs>
        <filter id={`glow-${delay}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle r="3" fill={color} filter={`url(#glow-${delay})`}>
        <animateMotion
          path={path}
          dur={`${duration}s`}
          repeatCount="indefinite"
          begin={`${delay}s`}
        />
      </circle>
    </svg>
  );
}

/* ─── Hex pattern ──────────────────────────────────────────────── */
function HexPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex-login" x="0" y="0" width="24" height="42" patternUnits="userSpaceOnUse">
          <path d="M12 0 L24 7 L24 21 L12 28 L0 21 L0 7 Z" fill="none" stroke="#FFD700" strokeWidth="0.5" />
          <path d="M12 14 L24 21 L24 35 L12 42 L0 35 L0 21 Z" fill="none" stroke="#FFD700" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-login)" />
    </svg>
  );
}

/* ─── LED ───────────────────────────────────────────────────────── */
function LED({ color, delay, className }: { color: string; delay: number; className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div className="rounded-full animate-pulse" style={{
        width: 3, height: 3, backgroundColor: color,
        boxShadow: `0 0 6px ${color}, 0 0 10px ${color}40`,
        animationDelay: `${delay}s`, animationDuration: '2.5s',
      }} />
    </div>
  );
}

/* ─── Rivet ─────────────────────────────────────────────────────── */
function Rivet({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`} style={{ imageRendering: 'pixelated' }}>
      <div className="w-2 h-2 rounded-full bg-zinc-700 border border-zinc-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1px] h-full bg-zinc-500/30 absolute" />
          <div className="h-[1px] w-full bg-zinc-500/30 absolute" />
        </div>
        <div className="absolute inset-[1.5px] rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

/* ─── Holographic data stream ──────────────────────────────────── */
function DataStream({ side }: { side: 'left' | 'right' }) {
  const chars = useMemo(() =>
    Array.from({ length: 14 }, () =>
      Array.from({ length: 6 }, () => Math.random() > 0.5 ? '1' : '0').join('')
    ), []
  );
  return (
    <div
      className="absolute hidden sm:flex flex-col gap-0.5 opacity-[0.08] pointer-events-none"
      style={{
        [side]: '6rem', top: '20%',
        color: side === 'left' ? '#FFD700' : '#00BCD4',
        fontFamily: 'var(--font-data)', fontSize: 7,
        imageRendering: 'pixelated',
      }}
    >
      {chars.map((line, i) => (
        <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.25}s` }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/* ─── Boot sequence overlay ────────────────────────────────────── */
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

function BootSequence({ onComplete }: { onComplete: () => void }) {
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
              color: line.startsWith('[OK]') ? '#34A853' : line.startsWith('━') ? '#FFD700' : '#00BCD4',
              letterSpacing: '0.05em',
              opacity: line.startsWith('WELCOME') ? 1 : 0.7,
              textShadow: line.startsWith('WELCOME') ? '0 0 10px #FFD70060' : undefined,
            }}>
              {line}
            </div>
          ))}
          {!done && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#FFD700', opacity: 0.5 }}>
                LOADING...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN LOGIN COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const Login = () => {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [googlePressed, setGooglePressed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [showBoot, setShowBoot] = useState(false);
  const [ignitionFlash, setIgnitionFlash] = useState(false);

  const [stars] = useState(() =>
    Array.from({ length: 50 }, () => ({
      w: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: Math.random() * 4 + 2,
      delay: Math.random() * 3,
    }))
  );

  const statusText = "AWAITING PILOT AUTHENTICATION...";
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (loading) return;
    let i = 0;
    const id = setInterval(() => {
      setTyped(statusText.slice(0, ++i));
      if (i >= statusText.length) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [loading]);

  const triggerIgnition = useCallback((action: () => Promise<void>) => {
    setIgnitionFlash(true);
    setTimeout(async () => {
      await action();
      setIgnitionFlash(false);
    }, 500);
  }, []);

  const handleEmailSubmit = useCallback(async () => {
    if (!email.trim() || !password.trim()) {
      setEmailError("ALL FIELDS REQUIRED");
      return;
    }
    setEmailError(null);
    setEmailLoading(true);
    triggerIgnition(async () => {
      const fn = isSignUp ? signUpWithEmail : signInWithEmail;
      const { error } = await fn(email, password);
      setEmailLoading(false);
      if (error) {
        setEmailError(error.toUpperCase());
      } else if (isSignUp) {
        setEmailError("VERIFICATION LINK TRANSMITTED. CHECK INBOX.");
      }
    });
  }, [email, password, isSignUp, signInWithEmail, signUpWithEmail, triggerIgnition]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse tracking-widest" style={{
          fontFamily: 'var(--font-header)', fontSize: 12, imageRendering: 'pixelated',
        }}>
          SYSTEM BOOT...
        </div>
      </div>
    );
  }

  if (user) {
    if (showBoot) return <BootSequence onComplete={() => {}} />;
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center relative overflow-hidden select-none ${ignitionFlash ? 'animate-screen-shake' : ''}`}>
      {/* Ignition gold flash */}
      {ignitionFlash && (
        <div className="fixed inset-0 z-[60] pointer-events-none" style={{
          background: 'radial-gradient(circle at center, rgba(255,215,0,0.25) 0%, transparent 70%)',
          animation: 'fade-out 0.5s ease-out forwards',
        }} />
      )}
      {/* Heavy vignette */}
      <div className="absolute inset-0 pointer-events-none z-[5]" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.85) 100%)',
      }} />
      {/* Boot sequence overlay */}
      {showBoot && <BootSequence onComplete={() => {}} />}

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-foreground/10 animate-pulse" style={{
            width: s.w, height: s.w, top: `${s.top}%`, left: `${s.left}%`,
            animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s`,
          }} />
        ))}
      </div>

      {/* Hex pattern */}
      <HexPattern />

      {/* Dense circuit network */}
      <CircuitNetwork />

      {/* Data pulses traveling along circuits */}
      <DataPulse path="M80,0 L80,120 L200,120" color="#FFD700" delay={0} duration={4} />
      <DataPulse path="M920,0 L920,150 L800,150" color="#FFD700" delay={2} duration={5} />
      <DataPulse path="M80,700 L80,550 L160,550" color="#00BCD4" delay={1} duration={4.5} />
      <DataPulse path="M920,700 L920,600 L850,600" color="#00BCD4" delay={3} duration={5} />

      {/* Data streams */}
      <DataStream side="left" />
      <DataStream side="right" />

      {/* Corner brackets */}
      <CornerBracket position="tl" />
      <CornerBracket position="tr" />
      <CornerBracket position="bl" />
      <CornerBracket position="br" />

      {/* Flickering status labels */}
      <StatusLabel text="[STORAGE_LINK: ACTIVE]" position="top:70px left:60px" color="#34A853" delay={0} />
      <StatusLabel text="[CPU_CORE: 98%]" position="top:70px right:60px" color="#FFD700" delay={1.5} />
      <StatusLabel text="[MISSION_LOG: READY]" position="bottom:70px left:60px" color="#00BCD4" delay={0.8} />
      <StatusLabel text="[NAV_MATRIX: SYNCED]" position="bottom:70px right:60px" color="#34A853" delay={2.2} />

      {/* LEDs */}
      <LED color="#FFD700" delay={0} className="top-[18%] left-[12%]" />
      <LED color="#00BCD4" delay={1.2} className="top-[28%] right-[14%]" />
      <LED color="#FFD700" delay={0.7} className="bottom-[22%] left-[9%]" />
      <LED color="#00BCD4" delay={2} className="bottom-[32%] right-[16%]" />

      {/* ─── Main content ───────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 px-4 w-full max-w-md">

        {/* Title */}
        <div className="flex flex-col items-center gap-3">
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 'clamp(7px, 1.5vw, 9px)',
            color: '#00BCD4',
            letterSpacing: '0.4em',
            opacity: 0.6,
          }}>
            MISSION CONTROL // ACCESS GRANTED
          </div>
          <div className="animate-pulse-glow" style={{
            fontFamily: 'var(--font-header)',
            fontSize: 'clamp(22px, 5.5vw, 36px)',
            color: '#FFD700',
            textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 0 0 30px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.15)',
            imageRendering: 'pixelated',
            letterSpacing: '0.12em',
            textAlign: 'center',
          }}>
            [ ORBIT 81 ]
          </div>
          <div style={{
            fontFamily: 'var(--font-data)',
            fontSize: 'clamp(8px, 1.8vw, 10px)',
            color: 'hsl(var(--muted-foreground))',
            letterSpacing: '0.35em',
          }}>
            DEPLOYING MISSION ORBIT 81
          </div>
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent mt-1" />
        </div>

        {/* ── Google Auth Button ── */}
        <button
          onClick={signInWithGoogle}
          onPointerDown={() => setGooglePressed(true)}
          onPointerUp={() => setGooglePressed(false)}
          onPointerLeave={() => setGooglePressed(false)}
          className={`group relative w-full cursor-pointer transition-transform duration-100 ease-out ${googlePressed ? 'scale-[0.97]' : 'hover:scale-[1.01]'}`}
          style={{ height: 64 }}
        >
          <div className={`absolute -inset-[2px] rounded-lg transition-shadow duration-700 ${googlePressed
            ? 'shadow-[inset_0_2px_10px_rgba(255,215,0,0.3)]'
            : 'shadow-[0_0_15px_rgba(255,215,0,0.1),0_0_40px_rgba(255,215,0,0.03)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.2),0_0_60px_rgba(255,215,0,0.06)]'
          }`} />
          <div className={`relative w-full h-full rounded-lg overflow-hidden border-2 transition-all duration-700 ${googlePressed ? 'border-[#B8960F]' : 'border-[#FFD700]/60 group-hover:border-[#FFD700]'}`}
            style={{
              background: googlePressed
                ? 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)'
                : 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 50%, #141414 100%)',
              animation: googlePressed ? 'none' : 'border-breathe 3s ease-in-out infinite',
            }}
          >
            {/* Hex overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none">
              <defs><pattern id="hex-gbtn" x="0" y="0" width="18" height="31" patternUnits="userSpaceOnUse">
                <path d="M9 0 L18 5 L18 15 L9 20 L0 15 L0 5 Z" fill="none" stroke="#FFD700" strokeWidth="0.3" />
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#hex-gbtn)" />
            </svg>
            <Rivet className="top-1 left-1" />
            <Rivet className="top-1 right-1" />
            <Rivet className="bottom-1 left-1" />
            <Rivet className="bottom-1 right-1" />
            <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
              <div className="p-1.5 rounded border border-zinc-700/60 bg-zinc-900/60 relative overflow-hidden shrink-0" style={{ imageRendering: 'pixelated' }}>
                <PixelGoogleG size={24} />
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" style={{ animation: 'scanner 2.5s linear infinite' }} />
                </div>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span style={{
                  fontFamily: 'var(--font-header)', fontSize: 'clamp(7px, 2vw, 10px)',
                  color: '#FFD700', textShadow: '1px 1px 0px #000',
                  letterSpacing: '0.12em', imageRendering: 'pixelated',
                }}>SIGN IN WITH GOOGLE</span>
                <span style={{
                  fontFamily: 'var(--font-data)', fontSize: 'clamp(6px, 1.2vw, 8px)',
                  color: '#00BCD4', opacity: 0.5, letterSpacing: '0.2em',
                }}>OAUTH SECURE CHANNEL</span>
              </div>
            </div>
            {/* Scanner */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
              <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent" style={{ animation: 'scanner-full 4s linear infinite' }} />
            </div>
          </div>
        </button>

        {/* ── Divider ── */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/20 to-[#FFD700]/20" />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#FFD700', opacity: 0.4, letterSpacing: '0.3em' }}>
            OR
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#FFD700]/20 to-[#FFD700]/20" />
        </div>

        {/* ── Email/Password Fields ── */}
        <div className="w-full flex flex-col gap-3">
          {/* Email field */}
          <div className="relative">
            <label style={{
              fontFamily: 'var(--font-data)', fontSize: 8, color: '#FFD700',
              opacity: 0.6, letterSpacing: '0.25em', marginBottom: 4, display: 'block',
            }}>
              PILOT ID (EMAIL)
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(null); }}
              placeholder="pilot@orbit81.com"
              className="w-full px-3 py-2.5 rounded border outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(255,215,0,0.15)]"
              style={{
                background: 'rgba(10,10,10,0.8)',
                borderColor: 'rgba(255,215,0,0.3)',
                color: '#FFD700',
                fontFamily: 'var(--font-data)',
                fontSize: 12,
                letterSpacing: '0.1em',
                caretColor: '#FFD700',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.7)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.3)'}
            />
          </div>

          {/* Password field */}
          <div className="relative">
            <label style={{
              fontFamily: 'var(--font-data)', fontSize: 8, color: '#FFD700',
              opacity: 0.6, letterSpacing: '0.25em', marginBottom: 4, display: 'block',
            }}>
              ACCESS CODE (PASSWORD)
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setEmailError(null); }}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded border outline-none transition-all duration-300 focus:shadow-[0_0_12px_rgba(255,215,0,0.15)]"
              style={{
                background: 'rgba(10,10,10,0.8)',
                borderColor: 'rgba(255,215,0,0.3)',
                color: '#FFD700',
                fontFamily: 'var(--font-data)',
                fontSize: 12,
                letterSpacing: '0.2em',
                caretColor: '#FFD700',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(255,215,0,0.7)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,215,0,0.3)'}
              onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()}
            />
          </div>

          {/* Error / info message */}
          {emailError && (
            <div style={{
              fontFamily: 'var(--font-data)', fontSize: 9,
              color: emailError.includes('VERIFICATION') ? '#34A853' : '#EA4335',
              letterSpacing: '0.1em', opacity: 0.8,
            }}>
              ⚠ {emailError}
            </div>
          )}

          {/* INITIALIZE DIVE button */}
          <button
            onClick={handleEmailSubmit}
            disabled={emailLoading}
            className={`group relative w-full cursor-pointer transition-transform duration-100 ${emailLoading ? 'opacity-60 pointer-events-none' : 'active:scale-[0.97] hover:scale-[1.01]'}`}
            style={{ height: 48 }}
          >
            <div className="absolute -inset-[1px] rounded transition-shadow duration-500 shadow-[0_0_10px_rgba(255,215,0,0.08)] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]" />
            <div className="relative w-full h-full rounded overflow-hidden border transition-all duration-500 border-[#FFD700]/40 group-hover:border-[#FFD700]/80"
              style={{ background: 'linear-gradient(180deg, #1c1c0a 0%, #0f0f05 50%, #181808 100%)' }}
            >
              <Rivet className="top-0.5 left-0.5" />
              <Rivet className="top-0.5 right-0.5" />
              <Rivet className="bottom-0.5 left-0.5" />
              <Rivet className="bottom-0.5 right-0.5" />
              <div className="absolute inset-0 flex items-center justify-center gap-2">
                <span style={{
                  fontFamily: 'var(--font-header)',
                  fontSize: 'clamp(7px, 2vw, 10px)',
                  color: '#FFD700',
                  textShadow: '1px 1px 0px #000, 0 0 8px rgba(255,215,0,0.2)',
                  letterSpacing: '0.15em',
                  imageRendering: 'pixelated',
                }}>
                  {emailLoading ? 'IGNITING...' : isSignUp ? 'REGISTER PILOT' : 'IGNITE MISSION'}
                </span>
              </div>
              {/* Scanner */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded">
                <div className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent" style={{ animation: 'scanner-full 3s linear infinite' }} />
              </div>
            </div>
          </button>

          {/* Toggle sign up / sign in */}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setEmailError(null); }}
            className="self-center"
            style={{
              fontFamily: 'var(--font-data)', fontSize: 9,
              color: '#00BCD4', opacity: 0.5, letterSpacing: '0.15em',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {isSignUp ? '← EXISTING PILOT? SIGN IN' : 'NEW PILOT? REGISTER →'}
          </button>

          {/* Guest mode */}
          <div className="flex flex-col items-center gap-1 mt-2">
            <button
              onClick={() => {
                window.location.href = '/';
              }}
              className="group self-center"
              style={{
                fontFamily: 'var(--font-data)', fontSize: 9,
                color: '#FFD700', opacity: 0.35, letterSpacing: '0.12em',
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.35'; }}
            >
              PROCEED AS GUEST (OFFLINE MODE)
            </button>
            <span style={{
              fontFamily: 'var(--font-data)', fontSize: 7,
              color: 'hsl(var(--muted-foreground))', opacity: 0.3,
              letterSpacing: '0.15em', fontStyle: 'italic',
            }}>
              *Data will be saved locally only.*
            </span>
          </div>
        </div>

        {/* ── Status footer ── */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#34A853', boxShadow: '0 0 6px #34A853' }} />
            <span className="text-muted-foreground/40" style={{ fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.2em' }}>
              {typed}<span className="animate-pulse">_</span>
            </span>
          </div>
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
          <div className="text-muted-foreground/20" style={{ fontFamily: 'var(--font-data)', fontSize: 7, letterSpacing: '0.3em' }}>
            SYS v1.0 · GROUND CONTROL · ORBIT 81 PROJECT
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
