import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

/** Honeycomb SVG pattern rendered inline */
const HoneycombPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="honeycomb" x="0" y="0" width="28" height="49" patternUnits="userSpaceOnUse"
        patternTransform="scale(1.2)">
        <path d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z" fill="none" stroke="#FFD700" strokeWidth="0.5" />
        <path d="M14 17 L28 25 L28 41 L14 49 L0 41 L0 25 Z" fill="none" stroke="#FFD700" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#honeycomb)" />
  </svg>
);

/** Corner rivet — tiny bolted circle */
const Rivet = ({ className }: { className: string }) => (
  <div className={`absolute w-3 h-3 ${className}`}>
    <div className="w-full h-full rounded-full bg-zinc-700 border border-zinc-600 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[1px] h-full bg-zinc-500/50 absolute" />
        <div className="h-[1px] w-full bg-zinc-500/50 absolute" />
      </div>
      <div className="absolute inset-[2px] rounded-full bg-zinc-800" />
    </div>
  </div>
);

/** Scanner line effect over the G logo */
const ScannerLine = () => (
  <div className="absolute inset-0 overflow-hidden rounded pointer-events-none">
    <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700]/60 to-transparent animate-[scanner_2.5s_linear_infinite]" />
  </div>
);

/** The Google 'G' multi-color SVG */
const GoogleG = () => (
  <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
    <div className="w-8 h-8 bg-zinc-950 rounded-sm border border-zinc-700 flex items-center justify-center relative overflow-hidden">
      <svg viewBox="0 0 24 24" className="w-5 h-5 relative z-10">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      <ScannerLine />
    </div>
  </div>
);

const Login = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const [pressed, setPressed] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg tracking-widest font-mono">
          SYSTEM BOOT...
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Deep space stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground/20 animate-pulse"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 4 + 2}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 px-4 w-full max-w-lg">
        {/* Title block */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl sm:text-6xl font-black tracking-tighter font-mono"
            style={{ color: '#FFD700', textShadow: '0 0 20px rgba(255,215,0,0.3), 0 2px 0 #000' }}>
            ORBIT 81
          </div>
          <div className="text-muted-foreground text-xs sm:text-sm tracking-[0.4em] uppercase font-mono">
            MISSION CONTROL TERMINAL
          </div>
          <div className="mt-1 w-32 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />
        </div>

        {/* === THE COCKPIT BUTTON === */}
        <button
          onClick={signInWithGoogle}
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => setPressed(false)}
          onPointerLeave={() => setPressed(false)}
          className={`
            group relative w-full cursor-pointer select-none
            transition-transform duration-100 ease-out
            ${pressed ? 'scale-[0.97]' : 'hover:scale-[1.01]'}
          `}
          style={{ aspectRatio: '16/5' }}
        >
          {/* Outer golden glow */}
          <div className={`
            absolute -inset-[2px] rounded-lg transition-shadow duration-700
            ${pressed
              ? 'shadow-[inset_0_2px_8px_rgba(255,215,0,0.3)]'
              : 'shadow-[0_0_15px_rgba(255,215,0,0.15),0_0_40px_rgba(255,215,0,0.05)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.25),0_0_60px_rgba(255,215,0,0.1)]'
            }
          `} />

          {/* Main plate */}
          <div className={`
            relative w-full h-full rounded-lg overflow-hidden
            border-2 transition-all duration-700
            ${pressed
              ? 'border-[#B8960F] bg-zinc-950'
              : 'border-[#FFD700] bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 group-hover:from-zinc-800 group-hover:via-zinc-900 group-hover:to-zinc-800'
            }
          `}
            style={{
              animation: pressed ? 'none' : 'border-breathe 3s ease-in-out infinite',
            }}
          >
            {/* Honeycomb overlay */}
            <HoneycombPattern />

            {/* Corner rivets */}
            <Rivet className="top-2 left-2" />
            <Rivet className="top-2 right-2" />
            <Rivet className="bottom-2 left-2" />
            <Rivet className="bottom-2 right-2" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center gap-4 px-6">
              <GoogleG />
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm sm:text-base font-bold tracking-[0.2em] font-mono"
                  style={{ color: '#FFD700', textShadow: '0 1px 0 #000, 0 0 8px rgba(255,215,0,0.2)' }}>
                  SIGN IN WITH GOOGLE
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.15em] font-mono text-cyan-500/60">
                  DEPLOYING MISSION ORBIT 81
                </span>
              </div>
            </div>

            {/* Scan line across entire button */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-lg">
              <div className="absolute left-0 right-0 h-[1px] bg-[#FFD700]/10 animate-[scanner-full_4s_linear_infinite]" />
            </div>
          </div>
        </button>

        {/* Footer status */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground/60 text-[10px] tracking-[0.3em] font-mono uppercase">
              Systems Online · Awaiting Pilot Auth
            </span>
          </div>
          <div className="text-muted-foreground/30 text-[10px] tracking-widest font-mono">
            v1.0 · GROUND CONTROL
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
