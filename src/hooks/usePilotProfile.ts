/**
 * usePilotProfile — Manages pilot call sign and avatar via Supabase.
 *
 * WHY: Uses TanStack Query for automatic caching, background refetch,
 * and clean loading/error states — replacing manual useState + useEffect.
 */

import { useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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

const PROFILE_QUERY_KEY = (userId: string) => ["profile", userId];

export function usePilotProfile(): PilotProfile {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ── Fetch ────────────────────────────────────────────────────────
  const { data, isLoading, isError } = useQuery({
    queryKey: PROFILE_QUERY_KEY(user?.id ?? ""),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("call_sign, avatar_config")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  // Show toast when fetch fails
  useEffect(() => {
    if (isError) {
      toast({
        title: "프로필 로드 실패",
        description: "네트워크를 확인하고 잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  // ── Save ─────────────────────────────────────────────────────────
  const { mutateAsync } = useMutation({
    mutationFn: async ({ avatar_id, call_sign }: { avatar_id: AvatarId; call_sign: string }) => {
      const currentConfig = (data?.avatar_config as AvatarConfig) ?? DEFAULT_CONFIG;
      const nextConfig: AvatarConfig = {
        ...currentConfig,
        avatar_id,
        selected_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("profiles")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .update({ call_sign, avatar_config: nextConfig as any })
        .eq("user_id", user!.id);
      if (error) throw error;
      return { call_sign, avatar_config: nextConfig };
    },
    onSuccess: () => {
      // Invalidate cache so next read reflects saved data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY(user?.id ?? "") });
    },
  });

  const saveProfile = useCallback<PilotProfile["saveProfile"]>(
    async ({ avatar_id, call_sign }) => {
      if (!user) return { error: "Not authenticated" };
      try {
        await mutateAsync({ avatar_id, call_sign });
        return { error: null };
      } catch (err: unknown) {
        return { error: err instanceof Error ? err.message : "Unknown error" };
      }
    },
    [user, mutateAsync],
  );

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY(user?.id ?? "") });
  }, [queryClient, user?.id]);

  // ── Derived ──────────────────────────────────────────────────────
  const config = (data?.avatar_config as AvatarConfig) ?? DEFAULT_CONFIG;
  const callSign = data?.call_sign ?? "Pilot";
  const avatarId = (config.avatar_id ?? null) as AvatarId | null;
  const needsOnboarding = !!user && !isLoading && !avatarId;

  return {
    call_sign: callSign,
    avatar_id: avatarId,
    avatar_config: config,
    loading: isLoading,
    needsOnboarding,
    refresh,
    saveProfile,
  };
}
