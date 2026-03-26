import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { GoalMatrix } from "@/components/GoalMatrix";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg tracking-widest font-mono">
          INITIALIZING...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background py-8 sm:py-12 relative overflow-hidden">
      <GoalMatrix />
    </div>
  );
};

export default Index;
