import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/context/QueryProvider";
import { AuthProvider } from "@/context";
import { PrivateRoute } from "@/guards/PrivateRoute";
import { PublicRoute } from "@/guards/PublicRoute";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import RecuperarSenha from "./pages/RecuperarSenha.tsx";
import SolicitarAcesso from "./pages/SolicitarAcesso.tsx";
import Agenda from "./pages/Agenda.tsx";
import Permissoes from "./pages/Permissoes.tsx";
import Empresas from "./pages/Empresas.tsx";
import Documentos from "./pages/Documentos.tsx";
import Contratos from "./pages/Contratos.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => (
  <QueryProvider>
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Rotas Públicas */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Index />
                </PublicRoute>
              }
            />
            <Route
              path="/recuperar-senha"
              element={
                <PublicRoute>
                  <RecuperarSenha />
                </PublicRoute>
              }
            />
            <Route
              path="/solicitar-acesso"
              element={
                <PublicRoute>
                  <SolicitarAcesso />
                </PublicRoute>
              }
            />

            {/* Rotas Privadas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/agenda"
              element={
                <PrivateRoute>
                  <Agenda />
                </PrivateRoute>
              }
            />
            <Route
              path="/permissoes"
              element={
                <PrivateRoute>
                  <Permissoes />
                </PrivateRoute>
              }
            />
            <Route
              path="/empresas"
              element={
                <PrivateRoute>
                  <Empresas />
                </PrivateRoute>
              }
            />
            <Route
              path="/documentos"
              element={
                <PrivateRoute>
                  <Documentos />
                </PrivateRoute>
              }
            />
            <Route
              path="/contratos"
              element={
                <PrivateRoute>
                  <Contratos />
                </PrivateRoute>
              }
            />

            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  </QueryProvider>
);

export default App;
