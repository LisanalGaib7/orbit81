import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { GoalMatrix } from "@/components/GoalMatrix";
import { PilotOnboarding } from "@/components/PilotOnboarding";
import { usePilotProfile } from "@/hooks/usePilotProfile";

const Index = () => {
  const { user, loading, isGuest } = useAuth();
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

  // Onboarding gate: only show registration screen if the logged-in user
  // hasn't picked an avatar yet.
  if (profile.needsOnboarding) {
    return (
      <PilotOnboarding
        initialCallSign={profile.call_sign}
        initialAvatarId={profile.avatar_id}
        onComplete={profile.saveProfile}
      />
    );
  }

  return (
    <div className="min-h-svh sm:min-h-screen bg-background py-0 sm:py-12 relative overflow-hidden">
      <GoalMatrix />
    </div>
  );
};

export default Index;
