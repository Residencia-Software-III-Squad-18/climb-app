import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { parseCookies } from "nookies";
import { useAuthStore } from "@/store/useAuthStore";

interface PrivateRouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { basicUserData } = useAuthStore();
  const localToken = localStorage.getItem("@CLIMB:T");
  const cookies = parseCookies();
  const cookieToken = cookies["@CLIMB:T"];

  const isAuthenticated = Boolean(basicUserData || localToken || cookieToken);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
