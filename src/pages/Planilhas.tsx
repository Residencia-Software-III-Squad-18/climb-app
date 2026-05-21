import { useState, useMemo } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ExternalLink, Loader2, LogOut,
  Moon, Pencil, Plus, Search, Settings, Sun, TableProperties, Trash2, X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { getNavItemsForRole } from "@/lib/navItems";
import { PageHeaderActions } from "@/components/layout/PageHeaderActions";
import {
  usePlanilhas, useCreatePlanilha, useUpdatePlanilha, useDeletePlanilha,
  type Planilha, type CreatePlanilhaDTO,
} from "@/services/usePlanilhas";
import { useContratos } from "@/services/useContratos";
import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PERMISSAO_OPTIONS = [
  { value: "SOMENTE_LEITURA", label: "Somente leitura" },
  { value: "EDICAO", label: "Edição" },
  { value: "COMENTARIOS", label: "Comentários" },
];

function truncateUrl(url: string, maxLen = 50) {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen) + "…";
}

interface FormState {
  contratoId: string;
  urlGoogleSheets: string;
  bloqueada: boolean;
  permissaoVisualizacao: string;
}

const defaultForm: FormState = {
  contratoId: "",
  urlGoogleSheets: "",
  bloqueada: false,
  permissaoVisualizacao: "SOMENTE_LEITURA",
};

const Planilhas = () => {
  const { isDark, setIsDark } = useTheme();
  const currentRole = useCurrentRole();
  const canCreate = useCanPerformAction("planilha.criar");
  const canEdit = useCanPerformAction("planilha.editar");
  const canDelete = useCanPerformAction("planilha.excluir");
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<Planilha | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: planilhas = [], isLoading, error } = usePlanilhas();
  const { data: contratos = [] } = useContratos();
  const criar = useCreatePlanilha();
  const atualizar = useUpdatePlanilha();
  const deletar = useDeletePlanilha();

  const filtered = useMemo(() => {
    if (!search) return planilhas;
    const q = search.toLowerCase();
    return planilhas.filter((p) =>
      p.urlGoogleSheets.toLowerCase().includes(q) ||
      String(p.contratoId).includes(q)
    );
  }, [planilhas, search]);

  const openCreate = () => {
    setForm(defaultForm);
    setFormError(null);
    setEditando(null);
    setFormOpen(true);
  };

  const openEdit = (p: Planilha) => {
    setForm({
      contratoId: String(p.contratoId),
      urlGoogleSheets: p.urlGoogleSheets,
      bloqueada: p.bloqueada,
      permissaoVisualizacao: p.permissaoVisualizacao,
    });
    setFormError(null);
    setEditando(p);
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.contratoId) { setFormError("Selecione um contrato."); return; }
    if (!form.urlGoogleSheets.trim()) { setFormError("URL é obrigatória."); return; }
    setFormError(null);

    const data: CreatePlanilhaDTO = {
      contratoId: parseInt(form.contratoId),
      urlGoogleSheets: form.urlGoogleSheets.trim(),
      bloqueada: form.bloqueada,
      permissaoVisualizacao: form.permissaoVisualizacao,
    };

    try {
      if (editando) {
        await atualizar.mutateAsync({ id: editando.id, data });
      } else {
        await criar.mutateAsync(data);
      }
      setFormOpen(false);
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Erro ao salvar.");
    }
  };

  const isPending = criar.isPending || atualizar.isPending;

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)` }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${sidebarCollapsed ? "w-[72px]" : "w-[220px]"}`} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className={`flex items-center h-16 border-b border-border/20 ${sidebarCollapsed ? "justify-center px-2" : "px-5"}`}>
            {sidebarCollapsed ? <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center"><span className="text-accent font-bold text-xs">C</span></motion.div> : <ClimbLogo className="h-[16px] text-foreground" />}
          </div>
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = item.path === "/planilhas";
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

        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[220px]"}`}>
          <motion.header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-border/20 bg-background/80 backdrop-blur-xl" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/50 w-[280px]">
              <Search className="w-3.5 h-3.5" />
              <input type="text" placeholder="Buscar planilhas..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
            </div>
            <div className="flex items-center gap-2">
              {canCreate && (
                <motion.button
                  onClick={openCreate}
                  className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Nova Planilha
                </motion.button>
              )}
              <PageHeaderActions />
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-2">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight flex items-center gap-2">
              <TableProperties className="w-5 h-5 text-accent" /> Planilhas
            </h1>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">Planilhas Google Sheets vinculadas a contratos.</p>
          </div>

          <div className="px-6 pb-6">
            <motion.div className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              {isLoading ? (
                <div className="py-12 text-center text-[12px] text-muted-foreground/50">Carregando planilhas...</div>
              ) : error ? (
                <div className="py-12 text-center text-[12px] text-destructive">Erro ao carregar planilhas</div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-[12px] text-muted-foreground/30">Nenhuma planilha encontrada</div>
              ) : (
                <div className="divide-y divide-border/10 max-h-[calc(100vh-220px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {filtered.map((p, i) => (
                    <motion.div key={p.id} className="px-5 py-4 hover:bg-muted/10 transition-colors group" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[12px] font-semibold text-foreground">Contrato #{p.contratoId}</p>
                            {p.bloqueada ? (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">Bloqueada</span>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent">Ativa</span>
                            )}
                            <span className="text-[10px] text-muted-foreground/50">{PERMISSAO_OPTIONS.find((o) => o.value === p.permissaoVisualizacao)?.label ?? p.permissaoVisualizacao}</span>
                          </div>
                          <a href={p.urlGoogleSheets} target="_blank" rel="noreferrer" className="text-[11px] text-accent hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {truncateUrl(p.urlGoogleSheets)}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canEdit && (
                            <button onClick={() => openEdit(p)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent/5 hover:text-accent transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {canDelete && (
                            <button onClick={() => setDeletandoId(p.id)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </main>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {formOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => { if (!isPending) setFormOpen(false); }} />
            <motion.div className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center justify-between border-b border-border/20 p-5">
                <h2 className="text-[15px] font-semibold text-foreground">{editando ? "Editar planilha" : "Nova planilha"}</h2>
                <motion.button onClick={() => { if (!isPending) setFormOpen(false); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/20 hover:text-foreground" whileTap={{ scale: 0.95 }}><X className="h-4 w-4" /></motion.button>
              </div>
              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {formError && <InlineFeedback tone="error" title="Erro" message={formError} onDismiss={() => setFormError(null)} />}

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Contrato *</Label>
                  <select value={form.contratoId} onChange={(e) => setForm((f) => ({ ...f, contratoId: e.target.value }))} className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20">
                    <option value="">Selecione o contrato</option>
                    {contratos.map((c) => <option key={c.id} value={c.id}>CT-{c.id} ({c.status})</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">URL Google Sheets *</Label>
                  <Input className="h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px]" placeholder="https://docs.google.com/spreadsheets/..." value={form.urlGoogleSheets} onChange={(e) => setForm((f) => ({ ...f, urlGoogleSheets: e.target.value }))} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Permissão de visualização</Label>
                  <select value={form.permissaoVisualizacao} onChange={(e) => setForm((f) => ({ ...f, permissaoVisualizacao: e.target.value }))} className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20">
                    {PERMISSAO_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input type="checkbox" id="bloqueada" checked={form.bloqueada} onChange={(e) => setForm((f) => ({ ...f, bloqueada: e.target.checked }))} className="rounded" />
                  <label htmlFor="bloqueada" className="text-[12px] text-foreground cursor-pointer">Planilha bloqueada</label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
                <Button variant="outline" className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px]" onClick={() => setFormOpen(false)} disabled={isPending}>Cancelar</Button>
                <Button className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground" onClick={handleSubmit} disabled={isPending}>
                  {isPending ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando...</> : editando ? "Salvar alterações" : "Criar planilha"}
                </Button>
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
              <h3 className="text-[14px] font-semibold text-foreground mb-1">Excluir planilha</h3>
              <p className="text-[11px] text-muted-foreground/50 mb-4">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeletandoId(null)} className="flex-1 h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70">Cancelar</button>
                <button onClick={async () => { await deletar.mutateAsync(deletandoId); setDeletandoId(null); }} disabled={deletar.isPending} className="flex-1 h-10 rounded-lg bg-destructive text-[12px] font-semibold text-white">
                  {deletar.isPending ? "Excluindo..." : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Planilhas;
