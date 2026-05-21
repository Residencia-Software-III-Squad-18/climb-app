import { useMemo, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, ChevronLeft, ChevronRight, Loader2, LogOut, Settings, Moon, Pencil, Plus, Search, Sun, Trash2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import { usePermissoes, useDeletePermissao, type Permissao } from "@/services";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { getNavItemsForRole } from "@/lib/navItems";
import { PageHeaderActions } from "@/components/layout/PageHeaderActions";
import { PermissaoFormModal } from "@/components/permissoes/PermissaoFormModal";
import { toastErro, toastSucesso } from "@/lib/toast";

const Permissoes = () => {
  const { isDark, setIsDark } = useTheme();
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);

  const canCreate = useCanPerformAction("permissao.criar");
  const canEdit = useCanPerformAction("permissao.editar");
  const canDelete = useCanPerformAction("permissao.excluir");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editandoPerm, setEditandoPerm] = useState<Permissao | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: permissoes = [], isLoading, error } = usePermissoes();
  const deletar = useDeletePermissao();

  const filtered = permissoes.filter(p =>
    p.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await deletar.mutateAsync(id);
      toastSucesso("Permissão excluída.");
      setDeletandoId(null);
    } catch {
      toastErro("Não foi possível excluir a permissão.");
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
            {navItems.map((item) => {
              const isActive = item.path === "/permissoes";
              return (
                <motion.button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`} whileHover={{ x: sidebarCollapsed ? 0 : 2 }} whileTap={{ scale: 0.98 }}>
                  {isActive && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" />}
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
                </motion.button>
              );
            })}
          </nav>
          <div className="border-t border-border/20 py-3 px-2">
            <Link to="/configuracoes"><motion.button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}><Settings className="w-[18px] h-[18px]" />{!sidebarCollapsed && <span className="text-[13px] font-medium">Configurações</span>}</motion.button></Link>
          </div>
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
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/50 w-[240px]">
                <Search className="w-3.5 h-3.5" />
                <input type="text" placeholder="Buscar permissão..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canCreate && (
                <motion.button onClick={() => setFormOpen(true)} className="flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3 text-[12px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}>
                  <Plus className="h-3.5 w-3.5" /> Nova permissão
                </motion.button>
              )}
              <PageHeaderActions />
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-2">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Gerenciamento de Permissões</h1>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">
              {isLoading ? "Carregando..." : `${filtered.length} permissão${filtered.length !== 1 ? "ões" : ""}`}
            </p>
          </div>

          <div className="px-6 pb-6">
            <motion.div className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="divide-y divide-border/10 max-h-[calc(100vh-200px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/30">
                    {isLoading ? "Carregando permissões..." : error ? "Erro ao carregar" : "Nenhuma permissão encontrada"}
                  </div>
                ) : (
                  filtered.map((perm, pi) => (
                    <motion.div
                      key={perm.id}
                      className="flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-colors group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: pi * 0.03 }}
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground/90">{perm.nome}</p>
                        <p className="text-[10px] text-muted-foreground/40 mt-0.5">{perm.codigo}</p>
                        {perm.descricao && <p className="text-[11px] text-muted-foreground/50 mt-1">{perm.descricao}</p>}
                      </div>
                      {(canEdit || canDelete) && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canEdit && (
                            <button onClick={() => setEditandoPerm(perm)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent/5 hover:text-accent transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button onClick={() => setDeletandoId(perm.id)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </main>
      </div>

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
                  <h3 className="text-[14px] font-semibold text-foreground">Excluir permissão</h3>
                  <p className="text-[11px] text-muted-foreground/50">Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeletandoId(null)} className="flex-1 h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 hover:text-foreground transition-all">Cancelar</button>
                <button onClick={() => handleDelete(deletandoId)} disabled={deletar.isPending} className="flex-1 h-10 rounded-lg bg-destructive text-[12px] font-semibold text-white hover:bg-destructive/90 transition-all flex items-center justify-center gap-2">
                  {deletar.isPending ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Excluindo...</> : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {formOpen && <PermissaoFormModal onClose={() => setFormOpen(false)} />}
      {editandoPerm && <PermissaoFormModal permissao={editandoPerm} onClose={() => setEditandoPerm(null)} />}
    </div>
  );
};

export default Permissoes;
