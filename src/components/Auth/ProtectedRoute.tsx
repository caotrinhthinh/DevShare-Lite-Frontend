import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    <Navigate
      to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`}
    />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
