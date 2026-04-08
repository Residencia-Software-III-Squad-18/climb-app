import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/solicitar-acesso" element={<SolicitarAcesso />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/permissoes" element={<Permissoes />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/documentos" element={<Documentos />} />
          <Route path="/contratos" element={<Contratos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
