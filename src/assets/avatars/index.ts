import nova from "./nova.png";
import ember from "./ember.png";
import nebula from "./nebula.png";
import drift from "./drift.png";
import relic from "./relic.png";
import pixel from "./pixel.png";
import aurora from "./aurora.png";
import comet from "./comet.png";
import corgi from "./corgi.png";

export type AvatarId =
  | "nova"
  | "ember"
  | "nebula"
  | "drift"
  | "relic"
  | "pixel"
  | "aurora"
  | "comet"
  | "corgi";

export interface AvatarDef {
  id: AvatarId;
  name: string;
  tagline: string;
  src: string;
  /** Hex tone used for the card glow / accent ring. */
  accent: string;
}

export const AVATARS: AvatarDef[] = [
  { id: "nova",   name: "NOVA",   tagline: "Classic flight, clean ignition.",   src: nova,   accent: "#FFD27A" },
  { id: "ember",  name: "EMBER",  tagline: "Lofi beats to launch rockets to.",  src: ember,  accent: "#FF7A3D" },
  { id: "nebula", name: "NEBULA", tagline: "Stardust in the visor.",            src: nebula, accent: "#E254A8" },
  { id: "relic",  name: "RELIC",  tagline: "Old metal, new horizons.",          src: relic,  accent: "#C58A3D" },
  { id: "drift",  name: "DRIFT",  tagline: "Calm pilot, long trajectories.",    src: drift,  accent: "#4FC3C7" },
  { id: "pixel",  name: "PIXEL",  tagline: "Minimal kit. Maximum range.",       src: pixel,  accent: "#E5E7EB" },
  { id: "aurora", name: "AURORA", tagline: "Glow-up in low orbit.",             src: aurora, accent: "#3CDCB0" },
  { id: "comet",  name: "COMET",  tagline: "Bright streak across the dark.",    src: comet,  accent: "#FF4D5E" },
  { id: "corgi",  name: "SHIBA",  tagline: "Such pilot. Very orbit. Wow.",      src: corgi,  accent: "#F4A24C" },
];

export const AVATAR_MAP: Record<AvatarId, AvatarDef> = AVATARS.reduce(
  (acc, a) => ({ ...acc, [a.id]: a }),
  {} as Record<AvatarId, AvatarDef>,
);

const preloadAvatar = (src: string) => {
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = src;
  void img.decode?.().catch(() => undefined);
  return img;
};

// Preload and pre-decode all avatar images at module import so opening the
// profile panel is instant. Total payload is tiny (~60KB).
const avatarPreloadCache: HTMLImageElement[] = [];
if (typeof window !== "undefined") {
  for (const a of AVATARS) {
    avatarPreloadCache.push(preloadAvatar(a.src));
  }
}

export function getAvatar(id: string | undefined | null): AvatarDef | null {
  if (!id) return null;
  return AVATAR_MAP[id as AvatarId] ?? null;
}
