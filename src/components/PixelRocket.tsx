interface PixelRocketProps {
  progress: number; // 0-100
}

export function PixelRocket({ progress }: PixelRocketProps) {
  // Rocket altitude: 0% = bottom (0px), 100% = top (60px above bar)
  const altitude = (progress / 100) * 60;
  
  // Exhaust size scales with progress (4px to 16px)
  const exhaustSize = 4 + (progress / 100) * 12;
  
  // Flicker intensity increases with progress
  const flickerIntensity = 0.3 + (progress / 100) * 0.7;

  return (
    <div 
      className="relative flex flex-col items-center transition-transform duration-500 ease-out"
      style={{ transform: `translateY(-${altitude}px)` }}
    >
      {/* Pixel Rocket Body */}
      <div className="relative">
        {/* Nose cone */}
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent border-b-muted-foreground mx-auto" />
        
        {/* Body */}
        <div className="w-3 h-5 bg-secondary-foreground rounded-sm mx-auto relative">
          {/* Window */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
        </div>
        
        {/* Fins */}
        <div className="flex justify-center -mt-1">
          <div className="w-0 h-0 border-t-[6px] border-r-[4px] border-transparent border-t-muted" />
          <div className="w-3 h-1 bg-muted" />
          <div className="w-0 h-0 border-t-[6px] border-l-[4px] border-transparent border-t-muted" />
        </div>
      </div>
      
      {/* Exhaust Flame */}
      <div 
        className="flex flex-col items-center"
        style={{ 
          animation: `flicker 0.1s infinite`,
          opacity: flickerIntensity,
        }}
      >
        {/* Outer flame (orange) */}
        <div 
          className="rounded-b-full bg-gradient-to-b from-primary to-destructive"
          style={{ 
            width: `${exhaustSize}px`, 
            height: `${exhaustSize * 1.5}px`,
            boxShadow: `0 ${exhaustSize / 2}px ${exhaustSize}px hsl(var(--primary) / 0.5)`,
          }} 
        />
        {/* Inner flame (yellow) */}
        <div 
          className="absolute top-0 rounded-b-full bg-gradient-to-b from-yellow-300 to-primary"
          style={{ 
            width: `${exhaustSize * 0.5}px`, 
            height: `${exhaustSize}px`,
            marginTop: '2px',
          }} 
        />
      </div>
    </div>
  );
}
