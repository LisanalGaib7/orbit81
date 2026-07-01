/**
 * LoginChrome — Decorative HUD components for the Login screen.
 *
 * WHY: Login.tsx mixed ~560 lines of purely decorative ground-control chrome
 * (circuit traces, LEDs, brackets, scanlines) with the actual auth logic.
 * Extracting the chrome here keeps Login.tsx focused on authentication.
 *
 * All components are self-contained: they depend only on their props, the
 * local PIXEL_G / parsePosition helpers, and global CSS (var(--font-*),
 * @keyframes defined in index.css). No shared state with Login.
 */

import { useMemo } from "react";

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

export function PixelGoogleG({ size = 32 }: { size?: number }) {
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
export function CornerBracket({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
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
          backgroundColor: '#FF9D00',
          boxShadow: '0 0 4px #FF9D0060',
          top: isTop ? 0 : size - t,
          left: 0,
          opacity: 0.5,
        }} />
        {/* Vertical arm */}
        <div className="absolute" style={{
          width: t, height: size,
          backgroundColor: '#FF9D00',
          boxShadow: '0 0 4px #FF9D0060',
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
export function StatusLabel({ text, position, color, delay }: {
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
export function CircuitNetwork() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" preserveAspectRatio="none" viewBox="0 0 1000 700" fill="none">
      {/* Left vertical bus */}
      <line x1="80" y1="0" x2="80" y2="700" stroke="#FF9D00" strokeWidth="0.5" />
      <line x1="120" y1="0" x2="120" y2="700" stroke="#FF9D00" strokeWidth="0.3" opacity="0.4" />
      <line x1="50" y1="0" x2="50" y2="700" stroke="#FF9D00" strokeWidth="0.25" opacity="0.2" />
      {/* Right vertical bus */}
      <line x1="920" y1="0" x2="920" y2="700" stroke="#FF9D00" strokeWidth="0.5" />
      <line x1="880" y1="0" x2="880" y2="700" stroke="#FF9D00" strokeWidth="0.3" opacity="0.4" />
      <line x1="950" y1="0" x2="950" y2="700" stroke="#FF9D00" strokeWidth="0.25" opacity="0.2" />
      {/* Top horizontal */}
      <line x1="0" y1="60" x2="1000" y2="60" stroke="#FF9D00" strokeWidth="0.3" opacity="0.3" />
      <line x1="0" y1="30" x2="1000" y2="30" stroke="#FF9D00" strokeWidth="0.2" opacity="0.15" />
      {/* Bottom horizontal */}
      <line x1="0" y1="640" x2="1000" y2="640" stroke="#FF9D00" strokeWidth="0.3" opacity="0.3" />
      <line x1="0" y1="670" x2="1000" y2="670" stroke="#FF9D00" strokeWidth="0.2" opacity="0.15" />
      {/* Cross branches left */}
      <line x1="80" y1="120" x2="200" y2="120" stroke="#FF9D00" strokeWidth="0.5" />
      <line x1="80" y1="180" x2="150" y2="180" stroke="#FF9D00" strokeWidth="0.3" opacity="0.3" />
      <line x1="80" y1="250" x2="180" y2="250" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="80" y1="320" x2="140" y2="320" stroke="#FF9D00" strokeWidth="0.3" opacity="0.25" />
      <line x1="80" y1="400" x2="220" y2="400" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="220" y1="400" x2="220" y2="450" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="80" y1="550" x2="160" y2="550" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="50" y1="200" x2="120" y2="200" stroke="#FF9D00" strokeWidth="0.25" opacity="0.2" />
      <line x1="50" y1="480" x2="120" y2="480" stroke="#FF9D00" strokeWidth="0.25" opacity="0.2" />
      {/* Cross branches right */}
      <line x1="920" y1="150" x2="800" y2="150" stroke="#FF9D00" strokeWidth="0.5" />
      <line x1="920" y1="220" x2="860" y2="220" stroke="#FF9D00" strokeWidth="0.3" opacity="0.3" />
      <line x1="920" y1="300" x2="830" y2="300" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="920" y1="380" x2="870" y2="380" stroke="#FF9D00" strokeWidth="0.3" opacity="0.25" />
      <line x1="920" y1="480" x2="780" y2="480" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="780" y1="480" x2="780" y2="520" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="920" y1="600" x2="850" y2="600" stroke="#FF9D00" strokeWidth="0.4" />
      <line x1="950" y1="260" x2="880" y2="260" stroke="#FF9D00" strokeWidth="0.25" opacity="0.2" />
      <line x1="950" y1="540" x2="880" y2="540" stroke="#FF9D00" strokeWidth="0.25" opacity="0.2" />
      {/* Blinking nodes at intersections */}
      <circle cx="200" cy="120" r="3" fill="#FF9D00" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" /></circle>
      <circle cx="180" cy="250" r="2.5" fill="#FF9D00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.5s" repeatCount="indefinite" begin="0.5s" /></circle>
      <circle cx="220" cy="450" r="3" fill="#FF9D00" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite" begin="1s" /></circle>
      <circle cx="160" cy="550" r="2.5" fill="#FF9D00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" begin="1.5s" /></circle>
      <circle cx="800" cy="150" r="3" fill="#FF9D00" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" begin="0.3s" /></circle>
      <circle cx="830" cy="300" r="2.5" fill="#FF9D00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2s" repeatCount="indefinite" begin="0.8s" /></circle>
      <circle cx="780" cy="520" r="3" fill="#FF9D00" opacity="0.7"><animate attributeName="opacity" values="0.7;0.2;0.7" dur="3s" repeatCount="indefinite" begin="2s" /></circle>
      <circle cx="850" cy="600" r="2.5" fill="#FF9D00" opacity="0.6"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.5s" repeatCount="indefinite" begin="1.2s" /></circle>
      <circle cx="150" cy="180" r="2" fill="#FF9D00" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2s" repeatCount="indefinite" begin="0.7s" /></circle>
      <circle cx="860" cy="220" r="2" fill="#FF9D00" opacity="0.5"><animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.5s" repeatCount="indefinite" begin="1.8s" /></circle>
      {/* Diagonal accents */}
      <line x1="120" y1="80" x2="200" y2="50" stroke="#FF9D00" strokeWidth="0.3" opacity="0.4" />
      <line x1="880" y1="620" x2="800" y2="650" stroke="#FF9D00" strokeWidth="0.3" opacity="0.4" />
      <line x1="50" y1="100" x2="120" y2="60" stroke="#FF9D00" strokeWidth="0.2" opacity="0.2" />
      <line x1="950" y1="580" x2="880" y2="640" stroke="#FF9D00" strokeWidth="0.2" opacity="0.2" />
      {/* Connecting traces to center */}
      <line x1="200" y1="350" x2="350" y2="350" stroke="#FF9D00" strokeWidth="0.3" opacity="0.3" />
      <line x1="800" y1="350" x2="650" y2="350" stroke="#FF9D00" strokeWidth="0.3" opacity="0.3" />
      <line x1="350" y1="350" x2="350" y2="300" stroke="#FF9D00" strokeWidth="0.2" opacity="0.2" />
      <line x1="650" y1="350" x2="650" y2="300" stroke="#FF9D00" strokeWidth="0.2" opacity="0.2" />
      {/* Data stream gradients */}
      <defs>
        <linearGradient id="stream-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF9D00" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF9D00" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF9D00" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="stream-cyan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FF9D00" stopOpacity="0" />
          <stop offset="50%" stopColor="#FF9D00" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF9D00" stopOpacity="0" />
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
export function DataPulse({ path, color, delay, duration }: {
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
export function HexPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex-login" x="0" y="0" width="24" height="42" patternUnits="userSpaceOnUse">
          <path d="M12 0 L24 7 L24 21 L12 28 L0 21 L0 7 Z" fill="none" stroke="#FF9D00" strokeWidth="0.5" />
          <path d="M12 14 L24 21 L24 35 L12 42 L0 35 L0 21 Z" fill="none" stroke="#FF9D00" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex-login)" />
    </svg>
  );
}

/* ─── LED ───────────────────────────────────────────────────────── */
export function LED({ color, delay, className }: { color: string; delay: number; className?: string }) {
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
export function Rivet({ className }: { className: string }) {
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
export function DataStream({ side }: { side: 'left' | 'right' }) {
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
        color: side === 'left' ? '#FF9D00' : '#FF9D00',
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
