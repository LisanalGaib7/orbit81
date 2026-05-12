import { getAvatar, type AvatarId } from "@/assets/avatars";
import { cn } from "@/lib/utils";

interface PilotAvatarProps {
  id: AvatarId | string | null | undefined;
  size?: number;
  glow?: boolean;
  className?: string;
  pixelated?: boolean;
}

/**
 * Renders a pilot avatar by id.
 * Falls back to a subtle pixel placeholder if id is unknown.
 */
export function PilotAvatar({
  id,
  size = 48,
  glow = false,
  className,
  pixelated = true,
}: PilotAvatarProps) {
  const avatar = getAvatar(id);

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md border border-primary/30 bg-background",
        className,
      )}
      style={{
        width: size,
        height: size,
        boxShadow: glow
          ? `0 0 ${Math.round(size / 4)}px ${avatar?.accent ?? "#FF9D00"}80, 0 0 ${Math.round(size / 2)}px ${avatar?.accent ?? "#FF9D00"}40`
          : undefined,
      }}
    >
      {avatar ? (
        <img
          src={avatar.src}
          alt={avatar.name}
          width={size}
          height={size}
          loading="lazy"
          className="h-full w-full object-cover"
          style={pixelated ? { imageRendering: "pixelated" } : undefined}
          draggable={false}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-primary/60"
          style={{
            fontFamily: "var(--font-data)",
            fontSize: Math.max(8, Math.round(size / 5)),
            letterSpacing: "0.1em",
          }}
        >
          ?
        </div>
      )}
    </div>
  );
}
