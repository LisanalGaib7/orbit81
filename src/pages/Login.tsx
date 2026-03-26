import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";

/* ─── Pixel Google "G" ─────────────────────────────────────────── */
const PIXEL_G: [number, number, string][] = [
  // Row 0-1: top of G (blue)
  [0,2,'#4285F4'],[0,3,'#4285F4'],[0,4,'#4285F4'],[0,5,'#4285F4'],
  [1,1,'#EA4335'],[1,6,'#4285F4'],
  // Row 2-3: left side (red) + right gap
  [2,0,'#EA4335'],[2,7,'#4285F4'],
  [3,0,'#EA4335'],
  // Row 4: left (yellow) + middle bar (blue)
  [4,0,'#FBBC05'],[4,4,'#4285F4'],[4,5,'#4285F4'],[4,6,'#4285F4'],[4,7,'#4285F4'],
  // Row 5-6: left (yellow/green) + right (blue)
  [5,0,'#FBBC05'],[5,7,'#4285F4'],
  [6,0,'#34A853'],[6,7,'#34A853'],
  // Row 7-8: bottom (green)
  [7,1,'#34A853'],[7,6,'#34A853'],
  [8,2,'#34A853'],[8,3,'#34A853'],[8,4,'#34A853'],[8,5,'#34A853'],
];

function PixelGoogleG({ size = 36 }: { size?: number }) {
  const px = size / 9;
  return (
    <div className="relative" style={{ width: size, height: size, imageRendering: 'pixelated' }}>
      {PIXEL_G.map(([row, col, color], i) => (
        <div
          key={i}
          className="absolute"
          style={{
            width: px, height: px,
            top: row * px, left: col * px,
            backgroundColor: color,
            boxShadow: `0 0 ${px}px ${color}40`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Blinking LED indicator ───────────────────────────────────── */
function LED({ color, delay, className }: { color: string; delay: number; className?: string }) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className="rounded-full animate-pulse"
        style={{
          width: 4, height: 4,
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}, 0 0 12px ${color}50`,
          animationDelay: `${delay}s`,
          animationDuration: '2.5s',
        }}
      />
    </div>
  );
}

/* ─── Circuit trace lines (SVG) ────────────────────────────────── */
function CircuitLines({ side }: { side: 'left' | 'right' }) {
  const mirror = side === 'right';
  return (
    <svg
      className="absolute top-0 h-full w-16 sm:w-24 opacity-20 pointer-events-none"
      style={{ [side]: 0, transform: mirror ? 'scaleX(-1)' : undefined }}
      viewBox="0 0 80 400"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Vertical main bus */}
      <line x1="20" y1="0" x2="20" y2="400" stroke="#FFD700" strokeWidth="0.5" />
      {/* Horizontal branches */}
      <line x1="20" y1="80" x2="60" y2="80" stroke="#FFD700" strokeWidth="0.5" />
      <circle cx="60" cy="80" r="2" fill="#FFD700" />
      <line x1="20" y1="160" x2="50" y2="160" stroke="#00BCD4" strokeWidth="0.5" />
      <circle cx="50" cy="160" r="2" fill="#00BCD4" />
      <line x1="20" y1="240" x2="65" y2="240" stroke="#FFD700" strokeWidth="0.5" />
      <line x1="65" y1="240" x2="65" y2="280" stroke="#FFD700" strokeWidth="0.5" />
      <circle cx="65" cy="280" r="2" fill="#FFD700" />
      <line x1="20" y1="320" x2="45" y2="320" stroke="#00BCD4" strokeWidth="0.5" />
      <circle cx="45" cy="320" r="2" fill="#00BCD4" />
      {/* Diagonal */}
      <line x1="20" y1="50" x2="40" y2="30" stroke="#FFD700" strokeWidth="0.3" opacity="0.5" />
      <line x1="20" y1="370" x2="55" y2="350" stroke="#00BCD4" strokeWidth="0.3" opacity="0.5" />
    </svg>
  );
}

/* ─── Hex pattern overlay ──────────────────────────────────────── */
function HexPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
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

/* ─── Corner rivets ────────────────────────────────────────────── */
function Rivet({ className }: { className: string }) {
  return (
    <div className={`absolute ${className}`} style={{ imageRendering: 'pixelated' }}>
      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border border-zinc-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[1px] h-full bg-zinc-500/40 absolute" />
          <div className="h-[1px] w-full bg-zinc-500/40 absolute" />
        </div>
        <div className="absolute inset-[2px] rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

/* ─── Holographic data stream ──────────────────────────────────── */
function DataStream({ side }: { side: 'left' | 'right' }) {
  const chars = useMemo(() =>
    Array.from({ length: 12 }, () =>
      Array.from({ length: 4 }, () => Math.random() > 0.5 ? '1' : '0').join('')
    ), []
  );

  return (
    <div
      className="absolute top-1/4 hidden sm:flex flex-col gap-1 opacity-[0.12] pointer-events-none font-mono text-[8px]"
      style={{
        [side]: side === 'left' ? '2rem' : '2rem',
        color: side === 'left' ? '#FFD700' : '#00BCD4',
        imageRendering: 'pixelated',
        fontFamily: 'var(--font-data)',
      }}
    >
      {chars.map((line, i) => (
        <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/* ─── Scanner line on button ───────────────────────────────────── */
function ScannerLine() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
      <div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/15 to-transparent"
        style={{ animation: 'scanner-full 4s linear infinite' }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  LOGIN PAGE                                                     */
/* ═══════════════════════════════════════════════════════════════ */

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const [pressed, setPressed] = useState(false);
  const [stars] = useState(() =>
    Array.from({ length: 50 }, () => ({
      w: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      dur: Math.random() * 4 + 2,
      delay: Math.random() * 3,
    }))
  );

  // Typewriter effect for status text
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse tracking-widest" style={{ fontFamily: 'var(--font-header)', fontSize: 12, imageRendering: 'pixelated' }}>
          SYSTEM BOOT...
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden select-none">
      {/* Deep space stars */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/15 animate-pulse"
            style={{
              width: s.w, height: s.w,
              top: `${s.top}%`, left: `${s.left}%`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Hex pattern */}
      <HexPattern />

      {/* Circuit traces */}
      <CircuitLines side="left" />
      <CircuitLines side="right" />

      {/* Holographic data streams */}
      <DataStream side="left" />
      <DataStream side="right" />

      {/* Blinking LEDs scattered */}
      <LED color="#FFD700" delay={0} className="top-[15%] left-[10%]" />
      <LED color="#00BCD4" delay={1.2} className="top-[25%] right-[12%]" />
      <LED color="#FFD700" delay={0.7} className="bottom-[20%] left-[8%]" />
      <LED color="#00BCD4" delay={2} className="bottom-[30%] right-[15%]" />
      <LED color="#FFD700" delay={1.5} className="top-[60%] left-[5%]" />
      <LED color="#00BCD4" delay={0.3} className="top-[45%] right-[6%]" />

      {/* ─── Main content ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-8 sm:gap-10 px-4 w-full max-w-lg">

        {/* ── Title block ── */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="text-center leading-tight"
            style={{
              fontFamily: 'var(--font-header)',
              fontSize: 'clamp(14px, 3.5vw, 22px)',
              color: '#FFD700',
              textShadow: '2px 2px 0px #000, 0 0 20px rgba(255,215,0,0.35)',
              imageRendering: 'pixelated',
              letterSpacing: '0.08em',
            }}
          >
            PILOT ENROLLMENT
          </div>
          <div
            className="text-center"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 'clamp(9px, 2vw, 11px)',
              color: 'hsl(var(--muted-foreground))',
              letterSpacing: '0.35em',
            }}
          >
            ORBIT 81 COMMAND
          </div>
          <div className="w-40 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent mt-1" />
        </div>

        {/* ── Main cockpit button ── */}
        <button
          onClick={signInWithGoogle}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          className={`
            group relative w-full cursor-pointer
            transition-transform duration-100 ease-out
            ${pressed ? 'scale-[0.97]' : 'hover:scale-[1.01]'}
          `}
          style={{ aspectRatio: '16 / 5.5' }}
        >
          {/* Outer glow */}
          <div className={`
            absolute -inset-[2px] rounded-lg transition-shadow duration-700
            ${pressed
              ? 'shadow-[inset_0_2px_10px_rgba(255,215,0,0.3)]'
              : 'shadow-[0_0_20px_rgba(255,215,0,0.12),0_0_50px_rgba(255,215,0,0.04)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.22),0_0_70px_rgba(255,215,0,0.08)]'
            }
          `} />

          {/* Metal plate */}
          <div
            className={`
              relative w-full h-full rounded-lg overflow-hidden
              border-2 transition-all duration-700
              ${pressed
                ? 'border-[#B8960F]'
                : 'border-[#FFD700]/70 group-hover:border-[#FFD700]'
              }
            `}
            style={{
              background: pressed
                ? 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)'
                : 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 50%, #141414 100%)',
              animation: pressed ? 'none' : 'border-breathe 3s ease-in-out infinite',
            }}
          >
            {/* Hex overlay on button */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none">
              <defs>
                <pattern id="hex-btn" x="0" y="0" width="20" height="35" patternUnits="userSpaceOnUse">
                  <path d="M10 0 L20 6 L20 17 L10 23 L0 17 L0 6 Z" fill="none" stroke="#FFD700" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hex-btn)" />
            </svg>

            {/* Corner rivets */}
            <Rivet className="top-1.5 left-1.5" />
            <Rivet className="top-1.5 right-1.5" />
            <Rivet className="bottom-1.5 left-1.5" />
            <Rivet className="bottom-1.5 right-1.5" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 sm:gap-5 px-6">
              {/* Pixel Google G in frame */}
              <div className="relative shrink-0">
                <div
                  className="p-2 rounded border border-zinc-700/80 bg-zinc-900/80 relative overflow-hidden"
                  style={{ imageRendering: 'pixelated' }}
                >
                  <PixelGoogleG size={32} />
                  {/* Scanner on G */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/50 to-transparent"
                      style={{ animation: 'scanner 2.5s linear infinite' }}
                    />
                  </div>
                </div>
              </div>

              {/* Text stack */}
              <div className="flex flex-col items-start gap-1.5">
                <span
                  style={{
                    fontFamily: 'var(--font-header)',
                    fontSize: 'clamp(8px, 2.2vw, 12px)',
                    color: '#FFD700',
                    textShadow: '1px 1px 0px #000, 0 0 10px rgba(255,215,0,0.2)',
                    letterSpacing: '0.15em',
                    imageRendering: 'pixelated',
                  }}
                >
                  SIGN IN WITH GOOGLE
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 'clamp(7px, 1.5vw, 9px)',
                    color: '#00BCD4',
                    opacity: 0.6,
                    letterSpacing: '0.2em',
                  }}
                >
                  DEPLOYING MISSION ORBIT 81
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-data)',
                    fontSize: 'clamp(6px, 1.2vw, 8px)',
                    color: '#00BCD4',
                    opacity: 0.35,
                    letterSpacing: '0.25em',
                  }}
                >
                  ORBIT 81 PROJECT
                </span>
              </div>
            </div>

            {/* Full-width scanner */}
            <ScannerLine />
          </div>
        </button>

        {/* ── Status footer ── */}
        <div className="flex flex-col items-center gap-3">
          {/* Typewriter status */}
          <div className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: '#34A853', boxShadow: '0 0 6px #34A853' }}
            />
            <span
              className="text-muted-foreground/50"
              style={{
                fontFamily: 'var(--font-data)',
                fontSize: 9,
                letterSpacing: '0.25em',
              }}
            >
              {typed}
              <span className="animate-pulse">_</span>
            </span>
          </div>

          {/* Separator */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Version */}
          <div
            className="text-muted-foreground/25"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 8,
              letterSpacing: '0.3em',
            }}
          >
            SYS v1.0 · GROUND CONTROL
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
