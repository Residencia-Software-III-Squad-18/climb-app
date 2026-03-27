import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";

import { Router } from "wouter";

import { Login } from "./app/(public)/Login/Login";
import { AuthProvider } from "./context/provider";
import { ThemeProvider } from "./context/ThemeProvider";
import { PublicRoute } from "./guards/PublicRoute";
import QueryProvider from "./QueryProvider";

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="fixed pt-4 pl-4 z-50 right-0">
              <ThemeToggle />
            </div>
            <PublicRoute path="/auth" component={Login} />
            <PublicRoute path="/" component={Login} />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  );
}

export default App;
