import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { parseCookies } from "nookies";
import { useAuthStore } from "@/store/useAuthStore";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { userData } = useAuthStore();
  const cookies = parseCookies();
  const token = cookies["@CLIMB:T"];
  const { pathname } = useLocation();

  // Se está autenticado e tenta acessar login ou home, redireciona para dashboard
  if (userData && token && (pathname === "/" || pathname === "/auth")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
