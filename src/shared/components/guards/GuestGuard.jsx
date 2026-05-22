// Router
import { Navigate, Outlet } from "react-router-dom";

// Hooks
import useAuth from "@/shared/hooks/useAuth";
import useAuthReady from "@/shared/hooks/useAuthReady";

// Constants
import { ROLE_HOME } from "@/shared/constants/roles";

const GuestGuard = () => {
  const { ready, hasToken } = useAuthReady();
  const { role, isLoading, isError } = useAuth();

  // Bootstrap yoki /me yuklanmaguncha kutamiz
  if (!ready) return null;
  if (hasToken && isLoading) return null;

  if (hasToken && !isError && role) {
    return <Navigate to={ROLE_HOME[role] || "/"} replace />;
  }

  return <Outlet />;
};

export default GuestGuard;
