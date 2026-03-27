import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index.tsx";
import RecuperarSenha from "./pages/RecuperarSenha.tsx";
import SolicitarAcesso from "./pages/SolicitarAcesso.tsx";
import NotFound from "./pages/NotFound.tsx";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/solicitar-acesso" element={<SolicitarAcesso />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
