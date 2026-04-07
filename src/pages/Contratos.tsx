import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Calendar as CalendarIcon, Shield, Building2, Settings,
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Search, Plus,
  Filter, FileCheck, X, Eye
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: FileText, label: "Contratos", path: "/contratos" },
  { icon: CalendarIcon, label: "Agenda", path: "/agenda" },
  { icon: Shield, label: "Permissões", path: "/permissoes" },
  { icon: Building2, label: "Empresas", path: "/empresas" },
  { icon: FileCheck, label: "Documentos", path: "/documentos" },
  { icon: Settings, label: "Configurações", path: "/dashboard" },
];

interface Contrato {
  id: string;
  tipo: string;
  empresa: string;
  analista: string;
  valor: string;
  risco: "Baixo" | "Médio" | "Alto";
  status: "Ativo" | "Em análise" | "Pendente" | "Concluído";
  progresso: number;
}

const contratos: Contrato[] = [
  { id: "CT-2024-089", tipo: "CEO", empresa: "Tech Solutions LTDA", analista: "João Silva", valor: "R$ 45.000", risco: "Baixo", status: "Ativo", progresso: 76 },
  { id: "CT-2024-088", tipo: "LCI", empresa: "Nova Digital S.A.", analista: "Maria Santos", valor: "R$ 120.000", risco: "Médio", status: "Em análise", progresso: 40 },
  { id: "CT-2024-087", tipo: "Debênture", empresa: "Alpha Construções", analista: "Pedro Lima", valor: "R$ 78.500", risco: "Alto", status: "Pendente", progresso: 15 },
  { id: "CT-2024-086", tipo: "CDB", empresa: "Beta Serviços ME", analista: "Ana Oliveira", valor: "R$ 32.000", risco: "Baixo", status: "Ativo", progresso: 91 },
  { id: "CT-2024-085", tipo: "Fundo", empresa: "Gamma Logística", analista: "Carlos Reis", valor: "R$ 95.000", risco: "Médio", status: "Concluído", progresso: 100 },
  { id: "CT-2024-084", tipo: "LCA", empresa: "Delta Consultoria", analista: "João Silva", valor: "R$ 55.000", risco: "Baixo", status: "Ativo", progresso: 80 },
  { id: "CT-2024-083", tipo: "CRI", empresa: "Epsilon Tech", analista: "Maria Santos", valor: "R$ 210.000", risco: "Alto", status: "Em análise", progresso: 35 },
  { id: "CT-2024-082", tipo: "CEO", empresa: "Zeta Participações", analista: "Pedro Lima", valor: "R$ 67.000", risco: "Médio", status: "Ativo", progresso: 62 },
];

const statusStyles: Record<string, string> = {
  "Ativo": "bg-accent/10 text-accent",
  "Em análise": "bg-primary/10 text-primary",
  "Pendente": "bg-destructive/10 text-destructive",
  "Concluído": "bg-accent/10 text-accent",
};

const riscoStyles: Record<string, string> = {
  "Baixo": "text-accent",
  "Médio": "text-primary",
  "Alto": "text-destructive",
};

const progressColors: Record<string, string> = {
  "Ativo": "from-accent/60 to-accent",
  "Em análise": "from-primary/60 to-primary",
  "Pendente": "from-destructive/40 to-destructive/60",
  "Concluído": "from-accent/60 to-accent",
};

type FilterTab = "Todos" | "Ativos" | "Em análise" | "Pendente" | "Concluído";
const tabs: FilterTab[] = ["Todos", "Ativos", "Em análise", "Pendente", "Concluído"];

const Contratos = () => {
  const [isDark, setIsDark] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const filtered = useMemo(() => {
    return contratos.filter(c => {
      const matchTab = activeTab === "Todos" || (activeTab === "Ativos" ? c.status === "Ativo" : c.status === activeTab);
      const matchSearch = c.empresa.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [activeTab, searchQuery]);

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
              <motion.button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${item.label === "Contratos" ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`} whileHover={{ x: sidebarCollapsed ? 0 : 2 }} whileTap={{ scale: 0.98 }}>
                {item.label === "Contratos" && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" />}
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
            <Link to="/"><motion.button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}><LogOut className="w-[18px] h-[18px]" />{!sidebarCollapsed && <span className="text-[13px] font-medium">Sair</span>}</motion.button></Link>
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
              <input type="text" placeholder="Buscar contratos, propostas..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
            </div>
            <div className="flex items-center gap-3">
              <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center"><span className="text-accent font-semibold text-[11px]">RR</span></motion.div>
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[22px] font-bold text-foreground tracking-tight">Contratos</h1>
                <p className="text-[12px] text-muted-foreground/50 mt-0.5">{filtered.length} de {contratos.length} contratos</p>
              </div>
              <motion.button className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]" whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}>
                <Plus className="w-3.5 h-3.5" /> Novo Contrato
              </motion.button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-1 h-9 rounded-lg border border-border/25 bg-card/30 overflow-hidden w-fit">
              {tabs.map(t => (
                <motion.button key={t} onClick={() => setActiveTab(t)} className={`h-full px-4 text-[12px] font-medium transition-all ${activeTab === t ? "bg-accent/15 text-accent" : "text-muted-foreground/50 hover:text-foreground"}`} whileTap={{ scale: 0.97 }}>
                  {t}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search within table */}
          <div className="px-6 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border/20 bg-card/20 text-muted-foreground/40 w-[220px]">
                <Search className="w-3 h-3" />
                <input type="text" placeholder="Buscar por empresa ou ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[11px] outline-none placeholder:text-muted-foreground/25 text-foreground" />
              </div>
              <button className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border/20 text-[11px] text-muted-foreground/50 hover:text-foreground hover:border-border/40 transition-all">
                <Filter className="w-3 h-3" /> Filtros
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="px-6 pb-6">
            <motion.div className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="grid grid-cols-[140px_1fr_120px_100px_80px_90px_120px] px-5 py-3 border-b border-border/15 text-[10px] font-medium text-muted-foreground/40 tracking-wider uppercase">
                <span>Contrato</span>
                <span>Empresa</span>
                <span>Analista</span>
                <span>Valor</span>
                <span>Risco</span>
                <span>Status</span>
                <span>Progresso</span>
              </div>

              {/* Rows */}
              <div className="divide-y divide-border/10 max-h-[calc(100vh-340px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {filtered.map((c, i) => (
                  <motion.div
                    key={c.id}
                    className="grid grid-cols-[140px_1fr_120px_100px_80px_90px_120px] px-5 py-4 items-center hover:bg-muted/10 transition-colors cursor-pointer group"
                    onClick={() => setSelectedContrato(c)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ x: 2 }}
                  >
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">{c.id}</p>
                      <p className="text-[9px] text-muted-foreground/40">{c.tipo}</p>
                    </div>
                    <p className="text-[12px] text-foreground/70 group-hover:text-accent transition-colors">{c.empresa}</p>
                    <p className="text-[12px] text-muted-foreground/50">{c.analista}</p>
                    <p className="text-[12px] font-medium text-foreground/80">{c.valor}</p>
                    <span className={`text-[11px] font-medium ${riscoStyles[c.risco]}`}>{c.risco}</span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full w-fit ${statusStyles[c.status]}`}>{c.status}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                        <motion.div className={`h-full rounded-full bg-gradient-to-r ${progressColors[c.status]}`} initial={{ width: 0 }} animate={{ width: `${c.progresso}%` }} transition={{ duration: 1, delay: i * 0.05 }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/40 w-8 text-right">{c.progresso}%</span>
                    </div>
                  </motion.div>
                ))}
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/30">Nenhum contrato encontrado</div>
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedContrato && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedContrato(null)} />
            <motion.div className="relative z-10 w-full max-w-lg rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">{selectedContrato.id}</h2>
                  <p className="text-[11px] text-muted-foreground/50">{selectedContrato.tipo} · {selectedContrato.empresa}</p>
                </div>
                <motion.button onClick={() => setSelectedContrato(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border/20 bg-background/50 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1">Analista</p>
                    <p className="text-[13px] font-medium text-foreground">{selectedContrato.analista}</p>
                  </div>
                  <div className="rounded-lg border border-border/20 bg-background/50 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1">Valor</p>
                    <p className="text-[14px] font-semibold text-accent">{selectedContrato.valor}</p>
                  </div>
                  <div className="rounded-lg border border-border/20 bg-background/50 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1">Risco</p>
                    <p className={`text-[13px] font-semibold ${riscoStyles[selectedContrato.risco]}`}>{selectedContrato.risco}</p>
                  </div>
                  <div className="rounded-lg border border-border/20 bg-background/50 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1">Status</p>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusStyles[selectedContrato.status]}`}>{selectedContrato.status}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground/40">Progresso</span>
                    <span className="text-[14px] font-bold text-accent">{selectedContrato.progresso}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                    <motion.div className={`h-full rounded-full bg-gradient-to-r ${progressColors[selectedContrato.status]}`} initial={{ width: 0 }} animate={{ width: `${selectedContrato.progresso}%` }} transition={{ duration: 1 }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button className="flex-1 h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 flex items-center justify-center gap-2 hover:border-accent/30 hover:text-accent transition-all" whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}><Eye className="w-4 h-4" /> Ver detalhes</motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contratos;
