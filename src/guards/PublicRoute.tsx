import { parseCookies } from "nookies";
import { Route, Redirect } from "wouter";

import { useAuthStore } from "../store/useAuthStore";

interface PublicRouteProps {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
}

export function PublicRoute({ path, component: Component }: PublicRouteProps) {
  const { userData } = useAuthStore();
  const cookies = parseCookies();
  const token = cookies["@CLIMB:T"];

  return (
    <Route path={path}>
      {(params) => {
        if (userData && token && (path === "/auth" || path === "/")) {
          return <Redirect to="/dashboard" />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}
