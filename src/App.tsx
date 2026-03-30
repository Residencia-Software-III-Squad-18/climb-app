import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";

import { Router } from "wouter";

import { Login } from "./app/(public)/Login/Login";
import { AuthProvider } from "./context/provider";
import { ThemeProvider } from "./context/ThemeProvider";
import { PublicRoute } from "./guards/PublicRoute";
import QueryProvider from "./QueryProvider";
import { useThemeInit } from "./store/useThemeStore";
import { ForgotPassword } from "./app/(public)/ForgotPassword/ForgotPassword";
import { RequestAccess } from "./app/(public)/RequestAccess/RequestAccess";

function App() {
  useThemeInit();

  return (
    <QueryProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="fixed pt-14 pr-8 z-50 right-0">
              <ThemeToggle />
            </div>
            <PublicRoute path="/auth" component={Login} />
            <PublicRoute path="/" component={Login} />
            <PublicRoute path="/forgot-password" component={ForgotPassword} />
            <PublicRoute path="/request-access" component={RequestAccess} />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
