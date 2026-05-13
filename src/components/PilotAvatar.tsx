import { getAvatar, type AvatarId } from "@/assets/avatars";
import { cn } from "@/lib/utils";

interface PilotAvatarProps {
  id: AvatarId | string | null | undefined;
  size?: number;
  glow?: boolean;
  className?: string;
  pixelated?: boolean;
  /** When "face", zoom into the head area of the avatar PNG. Default: full body. */
  crop?: "face" | "full";
  /** Show inner border ring. Default true. */
  bordered?: boolean;
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
  crop = "full",
  bordered = true,
}: PilotAvatarProps) {
  const avatar = getAvatar(id);
  const faceCrop = crop === "face";

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-md bg-background",
        bordered && "border border-primary/30",
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
          style={{
            ...(pixelated ? { imageRendering: "pixelated" as const } : {}),
            ...(faceCrop
              ? {
                  transform: "scale(2.6) translateY(18%)",
                  transformOrigin: "center center",
                }
              : {}),
          }}
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
