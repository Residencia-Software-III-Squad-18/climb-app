import { useState, useMemo } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Calendar as CalendarIcon, Shield, Building2, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Search, Download,
  Eye, Briefcase, CheckCircle2, X, FileCheck
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

interface Empresa {
  nome: string;
  tipo: string;
  responsavel: string;
  status: string;
  badge: string;
  isCliente: boolean;
  ultimoContato: string;
  contratoInfo?: { negociado: string; validade: string; valor: string; contratoFeito: string };
  documentos?: { name: string; status: "validated" | "processing" | "pending" }[];
  fluxo?: { name: string; done: boolean }[];
}

const empresas: Empresa[] = [
  {
    nome: "Nova Capital", tipo: "BPO", responsavel: "Equipe Climb", status: "Ativo", badge: "active", isCliente: true, ultimoContato: "28/02/2026",
    contratoInfo: { negociado: "Gestão financeira e fiscal completa", validade: "30/01/2027", valor: "R$ 18.500/mês", contratoFeito: "15/01/2025" },
  },
  {
    nome: "Apex Ventures", tipo: "M&A", responsavel: "Equipe Climb", status: "Análise", badge: "analysis", isCliente: false, ultimoContato: "15/02/2026",
    documentos: [
      { name: "Contrato Social", status: "validated" },
      { name: "Balanço da Empresa", status: "validated" },
      { name: "Planilha Gerencial", status: "processing" },
      { name: "CNPJ", status: "processing" },
      { name: "DRE", status: "pending" },
    ],
    fluxo: [
      { name: "Reunião Comercial", done: true },
      { name: "Proposta Aprovada", done: true },
      { name: "Contrato Criado", done: false },
      { name: "Documentação da Empresa", done: false },
      { name: "Cadastro no Sistema", done: false },
      { name: "Análise & Relatório", done: false },
    ],
  },
  {
    nome: "Horizon Group", tipo: "Outro", responsavel: "Equipe Climb", status: "Proposta", badge: "proposal", isCliente: false, ultimoContato: "22/02/2026",
    documentos: [
      { name: "Contrato Social", status: "pending" },
      { name: "Balanço da Empresa", status: "pending" },
      { name: "CNPJ", status: "pending" },
    ],
    fluxo: [
      { name: "Reunião Comercial", done: true },
      { name: "Proposta Aprovada", done: false },
      { name: "Contrato Criado", done: false },
      { name: "Documentação da Empresa", done: false },
      { name: "Cadastro no Sistema", done: false },
      { name: "Análise & Relatório", done: false },
    ],
  },
  {
    nome: "Solare Investimentos", tipo: "BPO", responsavel: "Equipe Climb", status: "Ativo", badge: "active", isCliente: true, ultimoContato: "10/03/2026",
    contratoInfo: { negociado: "Consultoria tributária e planejamento fiscal", validade: "15/06/2027", valor: "R$ 12.000/mês", contratoFeito: "01/06/2025" },
  },
  {
    nome: "Meridian Partners", tipo: "M&A", responsavel: "Equipe Climb", status: "Ativo", badge: "active", isCliente: true, ultimoContato: "05/03/2026",
    contratoInfo: { negociado: "Assessoria em fusões e aquisições", validade: "01/12/2026", valor: "R$ 45.000/projeto", contratoFeito: "01/12/2024" },
  },
  {
    nome: "Vértice Consultoria", tipo: "BPO", responsavel: "Equipe Climb", status: "Análise", badge: "analysis", isCliente: false, ultimoContato: "01/03/2026",
    documentos: [
      { name: "Contrato Social", status: "validated" },
      { name: "Balanço da Empresa", status: "processing" },
      { name: "CNPJ", status: "validated" },
      { name: "DRE", status: "pending" },
    ],
    fluxo: [
      { name: "Reunião Comercial", done: true },
      { name: "Proposta Aprovada", done: true },
      { name: "Contrato Criado", done: true },
      { name: "Documentação da Empresa", done: false },
      { name: "Cadastro no Sistema", done: false },
      { name: "Análise & Relatório", done: false },
    ],
  },
  {
    nome: "Atlas Participações", tipo: "M&A", responsavel: "Equipe Climb", status: "Ativo", badge: "active", isCliente: true, ultimoContato: "12/03/2026",
    contratoInfo: { negociado: "Reestruturação societária", validade: "20/09/2027", valor: "R$ 32.000/mês", contratoFeito: "20/09/2024" },
  },
];

const badgeStyles: Record<string, string> = {
  active: "bg-accent/15 text-accent border-accent/20",
  analysis: "bg-primary/15 text-primary border-primary/20",
  proposal: "bg-destructive/15 text-destructive border-destructive/20",
  direct: "bg-muted text-muted-foreground border-border/30",
};

const Empresas = () => {
  const { isDark, setIsDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<"todos" | "pendentes" | "clientes">("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const navigate = useNavigate();
  const userInitials = getUserInitials();

  const handleLogout = () => {
    clearAuthSession();
    clearGoogleOAuthSession();
    navigate("/", { replace: true });
  };


  const filtered = useMemo(() => {
    return empresas.filter(e => {
      const matchSearch = e.nome.toLowerCase().includes(searchQuery.toLowerCase());
      const matchFilter = filter === "todos" || (filter === "pendentes" && !e.isCliente) || (filter === "clientes" && e.isCliente);
      return matchSearch && matchFilter;
    });
  }, [searchQuery, filter]);

  const renderDetail = (emp: Empresa) => {
    if (emp.isCliente && emp.contratoInfo) {
      return (
        <div className="space-y-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><Building2 className="w-6 h-6 text-accent" /></div>
            <div>
              <h4 className="text-[17px] font-semibold text-foreground">{emp.nome}</h4>
              <p className="text-[11px] text-accent font-medium">Cliente ativo · {emp.tipo}</p>
            </div>
            <span className={`ml-auto inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium border ${badgeStyles[emp.badge]}`}>{emp.status}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/20 bg-background/50 p-5 space-y-3">
              <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">Detalhes do Contrato</p>
              <div className="space-y-3">
                <div><p className="text-[10px] text-muted-foreground/40">Negociado</p><p className="text-[13px] text-foreground/80">{emp.contratoInfo.negociado}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Valor</p><p className="text-[14px] font-semibold text-accent">{emp.contratoInfo.valor}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Validade do contrato</p><p className="text-[13px] text-foreground/80">{emp.contratoInfo.validade}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Contrato feito em</p><p className="text-[13px] text-foreground/80">{emp.contratoInfo.contratoFeito}</p></div>
                <div><p className="text-[10px] text-muted-foreground/40">Último contato</p><p className="text-[13px] text-foreground/80">{emp.ultimoContato}</p></div>
              </div>
            </div>
            <div className="rounded-xl border border-border/20 bg-background/50 p-5 space-y-3">
              <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">Ações</p>
              <div className="space-y-2">
                <motion.button className="w-full h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 flex items-center justify-center gap-2 hover:border-accent/30 hover:text-accent transition-all" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}><Download className="w-4 h-4" /> Baixar contrato</motion.button>
                <motion.button className="w-full h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 flex items-center justify-center gap-2 hover:border-accent/30 hover:text-accent transition-all" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}><Eye className="w-4 h-4" /> Ver histórico</motion.button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const docs = emp.documentos || [];
    const fluxo = emp.fluxo || [];
    const validCount = docs.filter(d => d.status === "validated").length;
    const compliance = docs.length > 0 ? Math.round((validCount / docs.length) * 100) : 0;

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase className="w-6 h-6 text-primary" /></div>
          <div>
            <h4 className="text-[17px] font-semibold text-foreground">{emp.nome}</h4>
            <p className="text-[11px] text-primary font-medium">Pendente · {emp.tipo}</p>
          </div>
          <span className={`ml-auto inline-flex items-center h-7 px-3 rounded-md text-[11px] font-medium border ${badgeStyles[emp.badge]}`}>{emp.status}</span>
        </div>
        <p className="text-[11px] text-muted-foreground/40">Último contato: {emp.ultimoContato}</p>

        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <p className="text-[10px] text-muted-foreground/35 font-medium tracking-[0.08em] uppercase mb-3">Documentação</p>
            {docs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between py-2.5 border-b border-border/8 last:border-0">
                <span className="text-[12px] text-foreground/70">{doc.name}</span>
                <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${doc.status === "validated" ? "bg-accent/10 text-accent" : doc.status === "processing" ? "bg-primary/10 text-primary" : "bg-muted/30 text-muted-foreground/40"}`}>
                  {doc.status === "validated" ? "Validado" : doc.status === "processing" ? "Em análise" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/35 font-medium tracking-[0.08em] uppercase mb-3">Fluxo Ativo</p>
            {fluxo.map(item => (
              <div key={item.name} className="flex items-center gap-2.5 py-2.5">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${item.done ? "border-accent bg-accent/10" : "border-border/30"}`}>
                  {item.done && <CheckCircle2 className="w-3 h-3 text-accent" />}
                </div>
                <span className={`text-[12px] ${item.done ? "text-foreground/70" : "text-muted-foreground/40"}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground/35">Conformidade documental</span>
            <span className="text-[13px] font-semibold text-accent">{compliance}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted/20 overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent" initial={{ width: 0 }} animate={{ width: `${compliance}%` }} transition={{ duration: 1 }} />
          </div>
        </div>
      </div>
    );
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
              <motion.button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${item.label === "Empresas" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`} whileHover={{ x: sidebarCollapsed ? 0 : 2 }} whileTap={{ scale: 0.98 }}>
                {item.label === "Empresas" && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" />}
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/50 w-[280px]">
                <Search className="w-3.5 h-3.5" />
                <input type="text" placeholder="Buscar empresa..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
              </div>
              <div className="flex items-center h-9 rounded-lg border border-border/25 bg-card/30 overflow-hidden">
                {(["todos", "pendentes", "clientes"] as const).map(f => (
                  <motion.button key={f} onClick={() => setFilter(f)} className={`h-full px-4 text-[12px] font-medium transition-all ${filter === f ? "bg-accent/15 text-accent" : "text-muted-foreground/50 hover:text-foreground"}`} whileTap={{ scale: 0.97 }}>
                    {f === "todos" ? "Todos" : f === "pendentes" ? "Pendentes" : "Clientes"}
                  </motion.button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center"><span className="text-accent font-semibold text-[11px]">{userInitials}</span></motion.div>
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-2">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Empresas</h1>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">Gerencie todas as empresas — pendentes e clientes.</p>
          </div>

          <div className="px-6 pb-6">
            <motion.div className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="divide-y divide-border/10 max-h-[calc(100vh-220px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {filtered.map((emp, i) => (
                  <motion.div
                    key={emp.nome}
                    className="px-5 py-4 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-pointer group"
                    onClick={() => setSelectedEmpresa(emp)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${emp.isCliente ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                        {emp.isCliente ? <Building2 className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">{emp.nome}</p>
                        <p className="text-[10px] text-muted-foreground/40">{emp.tipo} · {emp.responsavel} · Último contato: {emp.ultimoContato}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-medium px-2.5 py-0.5 rounded-full ${emp.isCliente ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"}`}>
                        {emp.isCliente ? "Cliente" : "Pendente"}
                      </span>
                      <span className={`inline-flex items-center h-6 px-2.5 rounded-md text-[10px] font-medium border ${badgeStyles[emp.badge]}`}>{emp.status}</span>
                    </div>
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/30">Nenhuma empresa encontrada</div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedEmpresa && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedEmpresa(null)} />
            <motion.div className="relative z-10 w-full max-w-3xl max-h-[85vh] rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <h2 className="text-[16px] font-semibold text-foreground">{selectedEmpresa.nome}</h2>
                <motion.button onClick={() => setSelectedEmpresa(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {renderDetail(selectedEmpresa)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Empresas;
