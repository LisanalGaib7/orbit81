import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { GoalMatrix } from "@/components/GoalMatrix";
import { PilotOnboarding } from "@/components/PilotOnboarding";
import { usePilotProfile } from "@/hooks/usePilotProfile";

const Index = () => {
  const { user, loading } = useAuth();
  const isGuest = localStorage.getItem('orbit81_guest_mode') === 'true';
  const profile = usePilotProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg tracking-widest font-mono">
          INITIALIZING...
        </div>
      </div>
    );
  }

  if (!user && !isGuest) return <Navigate to="/login" replace />;

  // Onboarding gate: show registration screen on demand (currently forced so the
  // user can preview the new pixel-art avatar selection).
  if (user && !profile.loading) {
    return (
      <PilotOnboarding
        initialCallSign={profile.call_sign}
        initialAvatarId={profile.avatar_id}
        onComplete={profile.saveProfile}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 relative overflow-hidden">
      <GoalMatrix />
    </div>
  );
};

export default Index;
