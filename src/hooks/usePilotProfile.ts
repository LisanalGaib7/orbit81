import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { AvatarId } from "@/assets/avatars";

interface AvatarConfig {
  avatar_id?: AvatarId;
  selected_at?: string;
  // legacy fields preserved
  suit_color?: string;
  unlocked_parts?: unknown[];
}

export interface PilotProfile {
  call_sign: string;
  avatar_id: AvatarId | null;
  avatar_config: AvatarConfig;
  loading: boolean;
  /** True if a logged-in user has not yet picked an avatar. */
  needsOnboarding: boolean;
  refresh: () => Promise<void>;
  saveProfile: (next: { avatar_id: AvatarId; call_sign: string }) => Promise<{ error: string | null }>;
}

const DEFAULT_CONFIG: AvatarConfig = { suit_color: "default", unlocked_parts: [] };

export function usePilotProfile(): PilotProfile {
  const { user } = useAuth();
  const [callSign, setCallSign] = useState<string>("Pilot");
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("call_sign, avatar_config")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setCallSign(data.call_sign ?? "Pilot");
      setConfig((data.avatar_config as AvatarConfig) ?? DEFAULT_CONFIG);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = useCallback<PilotProfile["saveProfile"]>(
    async ({ avatar_id, call_sign }) => {
      if (!user) return { error: "Not authenticated" };
      const nextConfig: AvatarConfig = {
        ...config,
        avatar_id,
        selected_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("profiles")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ call_sign, avatar_config: nextConfig as any })
        .eq("user_id", user.id);

      if (error) return { error: error.message };
      setCallSign(call_sign);
      setConfig(nextConfig);
      return { error: null };
    },
    [user, config],
  );

  const avatarId = (config.avatar_id ?? null) as AvatarId | null;
  const needsOnboarding = !!user && !loading && !avatarId;

  return {
    call_sign: callSign,
    avatar_id: avatarId,
    avatar_config: config,
    loading,
    needsOnboarding,
    refresh: load,
    saveProfile,
  };
}
