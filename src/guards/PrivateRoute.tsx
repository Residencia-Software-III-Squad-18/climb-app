import { Route, Redirect } from "wouter";
import { parseCookies } from "nookies";

import { useAuthStore } from "../store/useAuthStore";

interface PrivateRouteProps {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
}

export function PrivateRoute({
  path,
  component: Component,
}: PrivateRouteProps) {
  const { basicUserData } = useAuthStore();
  const localToken = localStorage.getItem("@CLIMB:T");
  const cookies = parseCookies();
  const cookieToken = cookies["@CLIMB:T"];

  const isAuthenticated = Boolean(basicUserData || localToken || cookieToken);

  return (
    <Route path={path}>
      {(params) => {
        if (!isAuthenticated) {
          return <Redirect to="/" />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}
