import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Calendar as CalendarIcon, Shield, Building2, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Search, Upload,
  CheckCircle2, Clock, AlertCircle, FileCheck, X, Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import { clearAuthSession, getUserInitials } from "@/services/session";
import { clearGoogleOAuthSession } from "@/services/google-oauth";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FileText, label: "Contratos", path: "/contratos" },
  { icon: CalendarIcon, label: "Agenda", path: "/agenda" },
  { icon: Shield, label: "Permissões", path: "/permissoes" },
  { icon: Building2, label: "Empresas", path: "/empresas" },
  { icon: FileCheck, label: "Documentos", path: "/documentos" },
  { icon: Settings, label: "Configurações", path: "/dashboard" },
];

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  status: "enviado" | "pendente" | "em_analise" | "aprovado" | "rejeitado";
  sentAt?: string;
  empresa: string;
}

interface ClientDocs {
  empresa: string;
  responsavel: string;
  tipo: string;
  documentos: DocumentItem[];
}

const clientsDocuments: ClientDocs[] = [
  {
    empresa: "Nova Capital",
    responsavel: "Carlos Mendonça",
    tipo: "BPO",
    documentos: [
      { id: "d1", name: "Contrato Social", description: "Última versão consolidada", status: "aprovado", sentAt: "12/02/2026", empresa: "Nova Capital" },
      { id: "d2", name: "Balanço Patrimonial 2025", description: "Balanço anual auditado", status: "aprovado", sentAt: "15/02/2026", empresa: "Nova Capital" },
      { id: "d3", name: "DRE 2025", description: "Demonstração de resultado", status: "em_analise", sentAt: "01/03/2026", empresa: "Nova Capital" },
      { id: "d4", name: "Comprovante de endereço", description: "Conta de luz ou água recente", status: "pendente", empresa: "Nova Capital" },
      { id: "d5", name: "Procuração", description: "Procuração para representação", status: "pendente", empresa: "Nova Capital" },
    ],
  },
  {
    empresa: "Apex Ventures",
    responsavel: "Fernanda Lima",
    tipo: "M&A",
    documentos: [
      { id: "d6", name: "Contrato Social", description: "Ato constitutivo atualizado", status: "enviado", sentAt: "05/03/2026", empresa: "Apex Ventures" },
      { id: "d7", name: "Balanço da Empresa", description: "Balanço patrimonial consolidado", status: "enviado", sentAt: "05/03/2026", empresa: "Apex Ventures" },
      { id: "d8", name: "Planilha Gerencial", description: "Planilha com dados financeiros", status: "pendente", empresa: "Apex Ventures" },
      { id: "d9", name: "CNPJ atualizado", description: "Cartão CNPJ emitido pela Receita", status: "pendente", empresa: "Apex Ventures" },
      { id: "d10", name: "DRE", description: "Demonstrativo de resultado do exercício", status: "pendente", empresa: "Apex Ventures" },
      { id: "d11", name: "Certidões Negativas", description: "Federal, estadual e municipal", status: "pendente", empresa: "Apex Ventures" },
    ],
  },
  {
    empresa: "Horizon Group",
    responsavel: "Ricardo Alves",
    tipo: "Outro",
    documentos: [
      { id: "d12", name: "Contrato Social", description: "Documento constitutivo", status: "pendente", empresa: "Horizon Group" },
      { id: "d13", name: "Balanço da Empresa", description: "Último balanço disponível", status: "pendente", empresa: "Horizon Group" },
      { id: "d14", name: "CNPJ", description: "Comprovante de inscrição", status: "pendente", empresa: "Horizon Group" },
    ],
  },
  {
    empresa: "Vértice Consultoria",
    responsavel: "Marina Santos",
    tipo: "BPO",
    documentos: [
      { id: "d15", name: "Contrato Social", description: "Versão consolidada", status: "aprovado", sentAt: "20/01/2026", empresa: "Vértice Consultoria" },
      { id: "d16", name: "Balanço da Empresa", description: "Balanço 2025", status: "em_analise", sentAt: "28/02/2026", empresa: "Vértice Consultoria" },
      { id: "d17", name: "CNPJ", description: "Cartão CNPJ atualizado", status: "aprovado", sentAt: "20/01/2026", empresa: "Vértice Consultoria" },
      { id: "d18", name: "DRE", description: "DRE do último exercício", status: "pendente", empresa: "Vértice Consultoria" },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  aprovado: { label: "Aprovado", color: "bg-accent/10 text-accent border-accent/20", icon: CheckCircle2 },
  enviado: { label: "Enviado", color: "bg-primary/10 text-primary border-primary/20", icon: Upload },
  em_analise: { label: "Em análise", color: "bg-primary/10 text-primary border-primary/20", icon: Clock },
  pendente: { label: "Pendente", color: "bg-muted/30 text-muted-foreground/60 border-border/20", icon: AlertCircle },
  rejeitado: { label: "Rejeitado", color: "bg-destructive/10 text-destructive border-destructive/20", icon: X },
};

const Documentos = () => {
  const { isDark, setIsDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientDocs | null>(null);
  const navigate = useNavigate();
  const userInitials = getUserInitials();

  const handleLogout = () => {
    clearAuthSession();
    clearGoogleOAuthSession();
    navigate("/", { replace: true });
  };


  const filtered = clientsDocuments.filter(c =>
    c.empresa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgress = (docs: DocumentItem[]) => {
    const done = docs.filter(d => d.status === "aprovado" || d.status === "enviado" || d.status === "em_analise").length;
    return Math.round((done / docs.length) * 100);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)` }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <motion.aside className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${sidebarCollapsed ? "w-[72px]" : "w-[220px]"}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className={`flex items-center h-16 border-b border-border/20 ${sidebarCollapsed ? "justify-center px-2" : "px-5"}`}>
            {sidebarCollapsed ? <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center"><span className="text-accent font-bold text-xs">C</span></motion.div> : <ClimbLogo className="h-[16px] text-foreground" />}
          </div>
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map(item => (
              <motion.button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${item.label === "Documentos" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`} whileHover={{ x: sidebarCollapsed ? 0 : 2 }} whileTap={{ scale: 0.98 }}>
                {item.label === "Documentos" && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" />}
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </nav>
          <div className="border-t border-border/20 py-3 px-2 space-y-1">
            <motion.button onClick={() => setIsDark(!isDark)} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}>
              <AnimatePresence mode="wait"><motion.div key={isDark ? "s" : "m"} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>{isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}</motion.div></AnimatePresence>
              {!sidebarCollapsed && <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>}
            </motion.button>
            <motion.button onClick={handleLogout} className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}><LogOut className="w-[18px] h-[18px]" />{!sidebarCollapsed && <span className="text-[13px] font-medium">Sair</span>}</motion.button>
          </div>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all shadow-sm">
            {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </motion.aside>

        {/* Main */}
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[220px]"}`}>
          <motion.header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-border/20 bg-background/80 backdrop-blur-xl" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/50 w-[280px]">
              <Search className="w-3.5 h-3.5" />
              <input type="text" placeholder="Buscar empresa..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
            </div>
            <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center"><span className="text-accent font-semibold text-[11px]">{userInitials}</span></motion.div>
          </motion.header>

          <div className="px-6 pt-6 pb-2">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Documentos</h1>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">Acompanhe o envio e status dos documentos de cada empresa.</p>
          </div>

          <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((client, i) => {
              const progress = getProgress(client.documentos);
              const pending = client.documentos.filter(d => d.status === "pendente").length;
              const approved = client.documentos.filter(d => d.status === "aprovado").length;
              return (
                <motion.div
                  key={client.empresa}
                  className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm p-5 cursor-pointer hover:border-accent/20 transition-all group"
                  onClick={() => setSelectedClient(client)}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 20px -8px hsl(var(--accent) / 0.1)" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-foreground group-hover:text-accent transition-colors">{client.empresa}</p>
                        <p className="text-[10px] text-muted-foreground/40">{client.tipo} · {client.responsavel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[18px] font-bold text-accent">{progress}%</p>
                      <p className="text-[9px] text-muted-foreground/40">completo</p>
                    </div>
                  </div>

                  <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden mb-3">
                    <motion.div className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, delay: i * 0.1 }} />
                  </div>

                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="flex items-center gap-1 text-accent"><CheckCircle2 className="w-3 h-3" /> {approved} aprovados</span>
                    <span className="flex items-center gap-1 text-muted-foreground/40"><AlertCircle className="w-3 h-3" /> {pending} pendentes</span>
                    <span className="text-muted-foreground/30 ml-auto">{client.documentos.length} documentos</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedClient(null)} />
            <motion.div className="relative z-10 w-full max-w-2xl max-h-[85vh] rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">{selectedClient.empresa}</h2>
                  <p className="text-[11px] text-muted-foreground/50">{selectedClient.tipo} · Responsável: {selectedClient.responsavel}</p>
                </div>
                <motion.button onClick={() => setSelectedClient(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {selectedClient.documentos.map((doc, i) => {
                  const cfg = statusConfig[doc.status];
                  const Icon = cfg.icon;
                  return (
                    <motion.div key={doc.id} className="rounded-xl border border-border/20 bg-background/50 p-4 flex items-center gap-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${cfg.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-foreground">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground/40">{doc.description}</p>
                        {doc.sentAt && <p className="text-[9px] text-muted-foreground/30 mt-0.5">Enviado em {doc.sentAt}</p>}
                      </div>
                      <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                      {doc.status === "pendente" && (
                        <motion.button className="h-8 px-3 rounded-lg border border-accent/20 bg-accent/10 text-accent text-[11px] font-medium flex items-center gap-1.5 hover:bg-accent/20 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Upload className="w-3 h-3" /> Enviar
                        </motion.button>
                      )}
                      {doc.status === "aprovado" && (
                        <motion.button className="h-8 px-3 rounded-lg border border-border/20 bg-muted/10 text-muted-foreground text-[11px] font-medium flex items-center gap-1.5 hover:bg-muted/20 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Download className="w-3 h-3" /> Baixar
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documentos;
