// Router
import { Navigate, Outlet } from "react-router-dom";

// Hooks
import useAuth from "@/shared/hooks/useAuth";
import useAuthReady from "@/shared/hooks/useAuthReady";

const Loader = () => (
  <div className="flex items-center justify-center fixed inset-0 z-50 size-full bg-gray-100">
    <div className="size-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
  </div>
);

const AuthGuard = () => {
  const { ready, hasToken } = useAuthReady();
  const { isLoading, isError } = useAuth();

  // Bootstrap tugamaguncha kutamiz - aks holda sessiya bor user login'ga uchadi
  if (!ready) return <Loader />;

  if (!hasToken) return <Navigate to="/login" replace />;

  if (isLoading) return <Loader />;

  if (isError) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AuthGuard;
