import { Route, Redirect } from "wouter";

import { useAuthStore } from "../store/useAuthStore";



interface PrivateRouteProps {
  path: string;
  component: React.ComponentType<Record<string, unknown>>;
}

export function PrivateRoute({
  path,
  component: Component,
}: PrivateRouteProps) {
  const { userData } = useAuthStore();
  const token = localStorage.getItem("@CLIMB:T");

  return (
    <Route path={path}>
      {(params) => {
        if (!userData && !token) {
          return <Redirect to="/auth" />;
        }

        return <Component {...params} />;
      }}
    </Route>
  );
}
