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
import EmpresasIndex from "./pages/empresas/EmpresasIndex.tsx";
import EmpresaDetalhe from "./pages/empresas/EmpresaDetalhe.tsx";
import EmpresaForm from "./pages/empresas/EmpresaForm.tsx";
import Documentos from "./pages/Documentos.tsx";
import Contratos from "./pages/Contratos.tsx";
import Usuarios from "./pages/Usuarios.tsx";
import Configuracoes from "./pages/Configuracoes.tsx";
import Propostas from "./pages/Propostas.tsx";
import Relatorios from "./pages/Relatorios.tsx";
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
                  <EmpresasIndex />
                </PrivateRoute>
              }
            />
            <Route
              path="/empresas/nova"
              element={
                <PrivateRoute>
                  <EmpresaForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/empresas/:id"
              element={
                <PrivateRoute>
                  <EmpresaDetalhe />
                </PrivateRoute>
              }
            />
            <Route
              path="/empresas/:id/editar"
              element={
                <PrivateRoute>
                  <EmpresaForm />
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
            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <Usuarios />
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <PrivateRoute>
                  <Configuracoes />
                </PrivateRoute>
              }
            />

            <Route
              path="/propostas"
              element={
                <PrivateRoute>
                  <Propostas />
                </PrivateRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <PrivateRoute>
                  <Relatorios />
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
