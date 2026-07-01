/**
 * VerificationModal — "check your email" overlay after sign-up.
 *
 * WHY: Self-contained presentational modal. Extracted from Login.tsx.
 * Props: the email it was sent to, and an onClose handler.
 */

export function VerificationModal({ email, onClose }: { email: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-lg overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0d0d0d 0%, #0a0a0a 100%)',
          border: '1px solid rgba(255,157,0,0.5)',
          boxShadow: '0 0 40px rgba(255,157,0,0.15), 0 0 80px rgba(255,157,0,0.05)',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#FF9D00]/20">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#34A853', boxShadow: '0 0 6px #34A853' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#FF9D00', opacity: 0.5, letterSpacing: '0.3em' }}>
            TRANSMISSION COMPLETE
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col items-center gap-5 text-center">
          {/* Icon */}
          <div style={{ fontSize: 36 }}>📡</div>

          <div className="flex flex-col gap-1.5">
            <div style={{ fontFamily: 'var(--font-header)', fontSize: 16, color: '#FF9D00', letterSpacing: '0.15em', textShadow: '0 0 12px rgba(255,157,0,0.4)' }}>
              LINK TRANSMITTED
            </div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#FF9D00', opacity: 0.5, letterSpacing: '0.2em' }}>
              {email}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#FF9D00', opacity: 0.7, letterSpacing: '0.08em', lineHeight: 2 }}>
              A verification link has been sent<br />
              to your inbox.<br />
              Click it to complete sign-in.
            </p>
            <p style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#FF9D00', opacity: 0.4, letterSpacing: '0.08em' }}>
              ⚠ Check your spam folder if you don't see it
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full rounded border py-2.5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,157,0,0.3)]"
            style={{
              fontFamily: 'var(--font-data)',
              fontSize: 11,
              color: '#FF9D00',
              letterSpacing: '0.25em',
              borderColor: 'rgba(255,157,0,0.4)',
              background: 'rgba(255,157,0,0.05)',
            }}
          >
            [ OK, GOT IT ]
          </button>
        </div>
      </div>
    </div>
  );
}
