import { useState, useMemo } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Sun, Moon, ChevronLeft, ChevronRight, Search, Plus, X, Pencil, Trash2, AlertTriangle, Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import { useContratos, Contrato, useDeleteContrato } from "@/services";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { getNavItemsForRole } from "@/lib/navItems";
import { useAuthStore } from "@/store/useAuthStore";
import { ContratoFormModal } from "@/components/contratos/ContratoFormModal";
import { toastErro, toastSucesso } from "@/lib/toast";

const statusStyles: Record<string, string> = {
  "ATIVO": "bg-accent/10 text-accent",
  "ANALISE": "bg-primary/10 text-primary",
  "PENDENTE": "bg-destructive/10 text-destructive",
  "CONCLUIDO": "bg-accent/10 text-accent",
};

type FilterTab = "Todos" | "Ativos" | "Em análise" | "Pendente" | "Concluído";
const tabs: FilterTab[] = ["Todos", "Ativos", "Em análise", "Pendente", "Concluído"];

const tabToStatus: Record<FilterTab, string | null> = {
  "Todos": null,
  "Ativos": "ATIVO",
  "Em análise": "ANALISE",
  "Pendente": "PENDENTE",
  "Concluído": "CONCLUIDO",
};

const Contratos = () => {
  const { isDark, setIsDark } = useTheme();
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const basicUserData = useAuthStore((state) => state.basicUserData);
  const userInitials = (basicUserData?.nomeCompleto || "U")
    .split(" ").filter(Boolean).slice(0, 2)
    .map((s: string) => s[0].toUpperCase()).join("");

  const canCreate = useCanPerformAction("proposta.criar");
  const canEdit = useCanPerformAction("proposta.editar");
  const canDelete = useCanPerformAction("proposta.excluir");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editandoContrato, setEditandoContrato] = useState<Contrato | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: contratos = [], isLoading, error } = useContratos();
  const deletar = useDeleteContrato();

  const filtered = useMemo(() => {
    if (!contratos.length) return [];
    const statusFiltro = tabToStatus[activeTab];
    return contratos.filter((c) => {
      const matchSearch =
        c.titulo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.descricao?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab = !statusFiltro || c.status === statusFiltro;
      return matchSearch && matchTab;
    });
  }, [searchQuery, activeTab, contratos]);

  const handleDelete = async (id: number) => {
    try {
      await deletar.mutateAsync(id);
      toastSucesso("Contrato excluído.");
      setSelectedContrato(null);
      setDeletandoId(null);
    } catch {
      toastErro("Não foi possível excluir o contrato.");
      setDeletandoId(null);
    }
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
            {navItems.map(item => {
              const isActive = item.path === "/contratos";
              return (
                <motion.button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`} whileHover={{ x: sidebarCollapsed ? 0 : 2 }} whileTap={{ scale: 0.98 }}>
                  {isActive && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" />}
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
                </motion.button>
              );
            })}
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
              <input type="text" placeholder="Buscar contratos..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
            </div>
            <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center"><span className="text-accent font-semibold text-[11px]">{userInitials}</span></motion.div>
          </motion.header>

          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[22px] font-bold text-foreground tracking-tight">Contratos</h1>
                <p className="text-[12px] text-muted-foreground/50 mt-0.5">{isLoading ? "Carregando..." : `${filtered.length} de ${contratos.length} contratos`}</p>
              </div>
              {canCreate && (
                <motion.button
                  onClick={() => setFormOpen(true)}
                  className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Novo Contrato
                </motion.button>
              )}
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

          <div className="px-6 pb-6">
            <motion.div className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="divide-y divide-border/10 max-h-[calc(100vh-220px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {isLoading ? (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/50">Carregando contratos...</div>
                ) : error ? (
                  <div className="py-12 text-center text-[12px] text-destructive">Erro ao carregar contratos</div>
                ) : filtered.length === 0 ? (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/30">Nenhum contrato encontrado</div>
                ) : (
                  filtered.map((c, i) => (
                    <motion.div
                      key={c.id}
                      className="px-5 py-4 hover:bg-muted/10 transition-colors cursor-pointer group border-b border-border/5 last:border-0"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0" onClick={() => setSelectedContrato(c)}>
                          <p className="text-[12px] font-semibold text-foreground">CT-{c.id}</p>
                          <p className="text-[11px] text-foreground/70 group-hover:text-accent transition-colors truncate">{c.titulo}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right" onClick={() => setSelectedContrato(c)}>
                            <p className="text-[12px] font-medium text-foreground/80">R$ {c.valor}</p>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full w-fit inline-block ${statusStyles[c.status] || "bg-muted/10 text-muted-foreground"}`}>{c.status}</span>
                          </div>
                          {(canEdit || canDelete) && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {canEdit && (
                                <button onClick={(e) => { e.stopPropagation(); setEditandoContrato(c); }} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent/5 hover:text-accent transition-colors">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {canDelete && (
                                <button onClick={(e) => { e.stopPropagation(); setDeletandoId(c.id); }} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
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
                  <h2 className="text-[16px] font-semibold text-foreground">CT-{selectedContrato.id}</h2>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">{selectedContrato.titulo}</p>
                </div>
                <motion.button onClick={() => setSelectedContrato(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border/20 bg-background/50 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1 uppercase tracking-wider">Valor</p>
                    <p className="text-[14px] font-semibold text-accent">R$ {selectedContrato.valor}</p>
                  </div>
                  <div className="rounded-lg border border-border/20 bg-background/50 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1 uppercase tracking-wider">Status</p>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block ${statusStyles[selectedContrato.status] || "bg-muted/10 text-muted-foreground"}`}>{selectedContrato.status}</span>
                  </div>
                </div>
                {selectedContrato.descricao && (
                  <div>
                    <p className="text-[10px] text-muted-foreground/40 mb-2 uppercase tracking-wider">Descrição</p>
                    <p className="text-[12px] text-foreground/70">{selectedContrato.descricao}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {canEdit && (
                    <motion.button
                      onClick={() => { setEditandoContrato(selectedContrato); setSelectedContrato(null); }}
                      className="flex-1 h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 hover:border-accent/30 hover:text-accent transition-all flex items-center justify-center gap-2"
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </motion.button>
                  )}
                  {canDelete && (
                    <motion.button
                      onClick={() => { setDeletandoId(selectedContrato.id); setSelectedContrato(null); }}
                      className="h-10 px-4 rounded-lg border border-destructive/20 bg-destructive/5 text-[12px] text-destructive hover:bg-destructive/10 transition-all flex items-center gap-2"
                      whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Excluir
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deletandoId !== null && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setDeletandoId(null)} />
            <motion.div className="relative z-10 w-full max-w-sm rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl p-6" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-foreground">Excluir contrato</h3>
                  <p className="text-[11px] text-muted-foreground/50">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeletandoId(null)} className="flex-1 h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 hover:text-foreground transition-all">Cancelar</button>
                <button onClick={() => handleDelete(deletandoId)} disabled={deletar.isPending} className="flex-1 h-10 rounded-lg bg-destructive text-[12px] font-semibold text-white hover:bg-destructive/90 transition-all flex items-center justify-center gap-2">
                  {deletar.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Excluindo...</> : "Confirmar exclusão"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {formOpen && <ContratoFormModal onClose={() => setFormOpen(false)} />}
      {editandoContrato && <ContratoFormModal contrato={editandoContrato} onClose={() => setEditandoContrato(null)} />}
    </div>
  );
};

export default Contratos;
