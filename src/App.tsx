import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";

import { Router } from "wouter";

import { Dashboard } from "./app/(private)/Dashboard/Dashboard";
import { Agenda } from "./app/(public)/Agenda/Agenda";
import { Configuracoes } from "./app/(public)/Configuracoes/Configuracoes";
import { Contratos } from "./app/(public)/Contratos/contratos";
import { Documentos } from "./app/(public)/Documentos/Documentos";
import { ForgotPassword } from "./app/(public)/ForgotPassword/ForgotPassword";
import { Login } from "./app/(public)/Login/Login";
import { RequestAccess } from "./app/(public)/RequestAccess/RequestAccess";
import { AuthProvider } from "./context/provider";
import { ThemeProvider } from "./context/ThemeProvider";
import { PrivateRoute } from "./guards/PrivateRoute";
import { PublicRoute } from "./guards/PublicRoute";
import QueryProvider from "./QueryProvider";
import { useThemeInit } from "./store/useThemeStore";

function App() {
  useThemeInit();

  return (
    <QueryProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="fixed pt-12 pr-8 z-50 right-0">
              <ThemeToggle />
            </div>
            <PublicRoute path="/auth" component={Login} />
            <PublicRoute path="/" component={Login} />
            <PublicRoute path="/forgot-password" component={ForgotPassword} />
            <PublicRoute path="/request-access" component={RequestAccess} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PublicRoute path="/contratos" component={Contratos} />
            <PublicRoute path="/documentos" component={Documentos} />
            <PublicRoute path="/agenda" component={Agenda} />
            <PublicRoute path="/configuracoes" component={Configuracoes} />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
