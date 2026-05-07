import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Building2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  Filter,
  Home,
  Loader2,
  LogOut,
  Map,
  Moon,
  Plus,
  Search,
  Settings,
  Shield,
  Sun,
  Trash2,
  X,
} from "lucide-react";

import { StatusBadge } from "@/components/status/StatusBadge";
import { EditarEmpresaModal } from "@/components/empresas/EditarEmpresaModal";
import ClimbLogo from "@/components/login/ClimbLogo";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { useTheme } from "@/hooks/use-theme";
import { getNavItemsForRole } from "@/lib/navItems";
import { Empresa, useEmpresas, useDeleteEmpresa } from "@/services";
import { toastErro, toastSucesso } from "@/lib/toast";

type ViewMode = "lista" | "mapa";

function toNumberOrNull(v: string | null) {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function hasCoords(e: Empresa) {
  return typeof e.latitude === "number" && typeof e.longitude === "number";
}

function getEmpresaStatus(e: Empresa): "ativa" | "pendente" {
  return e.cnpj && (e.razaoSocial || e.nome) ? "ativa" : "pendente";
}

const EmpresasIndex = () => {
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const canCreateEmpresa = useCanPerformAction("empresa.criar");
  const canDeleteEmpresa = useCanPerformAction("empresa.excluir");
  const { isDark, setIsDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [editandoEmpresa, setEditandoEmpresa] = useState<Empresa | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: empresas = [], isLoading, error } = useEmpresas();
  const deletar = useDeleteEmpresa();

  const handleDelete = async (id: number) => {
    try {
      await deletar.mutateAsync(id);
      toastSucesso("Empresa excluída.");
      setSelectedEmpresa(null);
      setDeletandoId(null);
    } catch {
      toastErro("Não foi possível excluir a empresa.");
      setDeletandoId(null);
    }
  };

  const view = (searchParams.get("view") as ViewMode) || "lista";
  const search = searchParams.get("q") || "";
  const state = searchParams.get("uf") || "";

  const onlyWithCoords = searchParams.get("coords") === "1";
  const minContracts = toNumberOrNull(searchParams.get("minContratos"));

  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return empresas
      .filter((e) => {
        const matchSearch =
          !q ||
          e.nome?.toLowerCase().includes(q) ||
          e.cnpj?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.cidade?.toLowerCase().includes(q);
        if (!matchSearch) return false;
        if (state && e.estado?.toLowerCase() !== state.toLowerCase()) return false;
        if (onlyWithCoords && !hasCoords(e)) return false;
        // minContracts is a placeholder until the backend exposes counts on Empresa
        if (typeof minContracts === "number" && minContracts > 0) return true;
        return true;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [empresas, minContracts, onlyWithCoords, search, state]);

  const withCoords = useMemo(() => filtered.filter(hasCoords), [filtered]);
  const statusSummary = useMemo(() => {
    const ativas = filtered.filter((empresa) => getEmpresaStatus(empresa) === "ativa").length;
    return {
      total: filtered.length,
      ativas,
      pendentes: filtered.length - ativas,
    };
  }, [filtered]);

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${
            sidebarCollapsed ? "w-[72px]" : "w-[220px]"
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div
            className={`flex items-center h-16 border-b border-border/20 ${
              sidebarCollapsed ? "justify-center px-2" : "px-5"
            }`}
          >
            {sidebarCollapsed ? (
              <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-xs">C</span>
              </motion.div>
            ) : (
              <ClimbLogo className="h-[16px] text-foreground" />
            )}
          </div>

          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${
                  sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                } ${
                  item.label === "Empresas"
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label === "Empresas" && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                    layoutId="activeNav"
                  />
                )}
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          <div className="border-t border-border/20 py-3 px-2 space-y-1">
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "s" : "m"}
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 30 }}
                >
                  {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
              {!sidebarCollapsed && (
                <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>
              )}
            </motion.button>

            <Link to="/">
              <motion.button
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-[18px] h-[18px]" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">Sair</span>}
              </motion.button>
            </Link>
          </div>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border/40 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 transition-all shadow-sm"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </motion.aside>

        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-[72px]" : "ml-[220px]"}`}>
          <motion.header
            className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-border/20 bg-background/80 backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/50 w-[320px]">
              <Search className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Buscar empresa, CNPJ, cidade..."
                value={search}
                onChange={(e) => setParam("q", e.target.value || null)}
                className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground"
              />
              <button
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60 hover:text-foreground transition-colors"
                type="button"
              >
                <Filter className="w-3.5 h-3.5" />
                Filtros
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 h-9 rounded-lg border border-border/25 bg-card/30 overflow-hidden">
                <motion.button
                  onClick={() => setParam("view", "lista")}
                  className={`h-full px-3 text-[12px] font-medium transition-all ${
                    view === "lista" ? "bg-accent/15 text-accent" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  Lista
                </motion.button>
                <motion.button
                  onClick={() => setParam("view", "mapa")}
                  className={`h-full px-3 text-[12px] font-medium transition-all inline-flex items-center gap-1.5 ${
                    view === "mapa" ? "bg-accent/15 text-accent" : "text-muted-foreground/60 hover:text-foreground"
                  }`}
                  whileTap={{ scale: 0.97 }}
                >
                  <Map className="w-3.5 h-3.5" />
                  Mapa
                </motion.button>
              </div>

              {canCreateEmpresa ? (
                <Link to="/empresas/nova">
                  <motion.button
                    className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-3.5 h-3.5" /> Nova Empresa
                  </motion.button>
                </Link>
              ) : null}
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-4">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-[22px] font-bold text-foreground tracking-tight">Empresas</h1>
                <p className="text-[12px] text-muted-foreground/50 mt-0.5">
                  {isLoading ? "Carregando..." : `${filtered.length} de ${empresas.length} empresas`}
                  {onlyWithCoords ? ` · ${withCoords.length} com localização` : ""}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                {state && (
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/15">
                    UF: {state.toUpperCase()}
                  </span>
                )}
                {onlyWithCoords && (
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                    Somente com mapa
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <SummaryCard label="Empresas visíveis" value={statusSummary.total} />
            <SummaryCard label="Ativas" tone="success" value={statusSummary.ativas} />
            <SummaryCard label="Pendentes" tone="warning" value={statusSummary.pendentes} />
          </div>

          <div className="px-6 pb-6">
            <motion.div
              className={`rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden ${
                view === "mapa" ? "h-[calc(100vh-220px)]" : ""
              }`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {view === "lista" ? (
                <div className="divide-y divide-border/10 max-h-[calc(100vh-220px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                  {isLoading ? (
                    <div className="py-12 text-center text-[12px] text-muted-foreground/50">Carregando empresas...</div>
                  ) : error ? (
                    <div className="py-12 text-center text-[12px] text-destructive">Erro ao carregar empresas</div>
                  ) : filtered.length === 0 ? (
                    <div className="py-12 text-center text-[12px] text-muted-foreground/30">Nenhuma empresa encontrada</div>
                  ) : (
                    filtered.map((emp, i) => (
                      <motion.div
                        key={emp.id}
                        className="px-5 py-4 flex items-center justify-between hover:bg-muted/10 transition-colors cursor-pointer group"
                        onClick={() => setSelectedEmpresa(emp)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors truncate">
                              {emp.nome}
                            </p>
                            <p className="text-[10px] text-muted-foreground/40 truncate">
                              {emp.cnpj} · {emp.cidade || "N/A"}{emp.estado ? `/${emp.estado}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasCoords(emp) && (
                            <StatusBadge tone="info">Mapa</StatusBadge>
                          )}
                          <StatusBadge
                            pulse={getEmpresaStatus(emp) === "ativa"}
                            tone={getEmpresaStatus(emp) === "ativa" ? "success" : "warning"}
                          >
                            {getEmpresaStatus(emp) === "ativa" ? "Ativa" : "Pendente"}
                          </StatusBadge>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <EmpresasMapPanel empresas={withCoords} empty={filtered.length === 0} />
              )}
            </motion.div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setFiltersOpen(false)} />
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">Filtros</h2>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">Refine a lista e o mapa de empresas.</p>
                </div>
                <motion.button
                  onClick={() => setFiltersOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-muted-foreground/60 mb-1">UF</label>
                    <input
                      value={state}
                      onChange={(e) => setParam("uf", e.target.value || null)}
                      placeholder="Ex: SP"
                      className="w-full h-10 rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] outline-none focus:border-accent/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-muted-foreground/60 mb-1">Mín. contratos (em breve)</label>
                    <input
                      value={minContracts?.toString() || ""}
                      onChange={(e) => setParam("minContratos", e.target.value || null)}
                      placeholder="0"
                      inputMode="numeric"
                      className="w-full h-10 rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] outline-none focus:border-accent/40"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between gap-3 rounded-lg border border-border/20 bg-background/40 px-3 py-2.5 cursor-pointer">
                  <div>
                    <p className="text-[12px] font-medium text-foreground/80">Somente empresas com localização</p>
                    <p className="text-[11px] text-muted-foreground/50">Para aparecer no mapa (lat/lng).</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={onlyWithCoords}
                    onChange={(e) => setParam("coords", e.target.checked ? "1" : null)}
                    className="h-4 w-4 accent-[hsl(var(--accent))]"
                  />
                </label>

                <div className="flex items-center justify-between gap-2 pt-2">
                  <motion.button
                    onClick={() => {
                      setSearchParams(new URLSearchParams([["view", view]]), { replace: true });
                      setFiltersOpen(false);
                    }}
                    className="h-10 px-4 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 hover:border-accent/30 hover:text-accent transition-all"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Limpar
                  </motion.button>
                  <motion.button
                    onClick={() => setFiltersOpen(false)}
                    className="h-10 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Aplicar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedEmpresa && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedEmpresa(null)} />
            <motion.div
              className="relative z-10 w-full max-w-xl rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div className="min-w-0">
                  <h2 className="text-[16px] font-semibold text-foreground truncate">{selectedEmpresa.nome}</h2>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5 truncate">
                    {selectedEmpresa.cnpj} · {selectedEmpresa.cidade || "N/A"}{selectedEmpresa.estado ? `/${selectedEmpresa.estado}` : ""}
                  </p>
                </div>
                <StatusBadge
                  className="shrink-0"
                  pulse={getEmpresaStatus(selectedEmpresa) === "ativa"}
                  tone={getEmpresaStatus(selectedEmpresa) === "ativa" ? "success" : "warning"}
                >
                  {getEmpresaStatus(selectedEmpresa) === "ativa" ? "Ativa" : "Pendente"}
                </StatusBadge>
                <motion.button
                  onClick={() => setSelectedEmpresa(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/20 bg-background/40 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1 uppercase tracking-wider">Contato</p>
                    <p className="text-[12px] text-foreground/80 truncate">{selectedEmpresa.email || "N/A"}</p>
                    <p className="text-[12px] text-foreground/80 truncate">{selectedEmpresa.telefone || "N/A"}</p>
                  </div>
                  <div className="rounded-lg border border-border/20 bg-background/40 p-4">
                    <p className="text-[10px] text-muted-foreground/40 mb-1 uppercase tracking-wider">Endereço</p>
                    <p className="text-[12px] text-foreground/80 line-clamp-2">
                      {selectedEmpresa.endereco || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => navigate(`/empresas/${selectedEmpresa.id}`)}
                    className="flex-1 h-10 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Ver detalhes completos
                  </motion.button>
                  <motion.button
                    onClick={() => setEditandoEmpresa(selectedEmpresa)}
                    className="h-10 px-4 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70 hover:border-accent/30 hover:text-accent transition-all"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Editar
                  </motion.button>
                  {canDeleteEmpresa && (
                    <motion.button
                      onClick={() => { setDeletandoId(selectedEmpresa.id); setSelectedEmpresa(null); }}
                      className="h-10 px-3 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {editandoEmpresa && (
        <EditarEmpresaModal
          empresa={editandoEmpresa}
          onClose={() => setEditandoEmpresa(null)}
        />
      )}

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
                  <h3 className="text-[14px] font-semibold text-foreground">Excluir empresa</h3>
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
    </div>
  );
};

function SummaryCard({
  label,
  tone = "neutral",
  value,
}: {
  label: string;
  tone?: "neutral" | "success" | "warning";
  value: number;
}) {
  const toneClasses = {
    neutral: "border-border/25 bg-card/40 text-foreground",
    success: "border-accent/20 bg-accent/10 text-accent",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  } as const;

  return (
    <div className={`rounded-xl border p-4 backdrop-blur-sm ${toneClasses[tone]}`}>
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">{label}</p>
      <p className="mt-2 text-[20px] font-bold tracking-tight">{value}</p>
    </div>
  );
}

function EmpresasMapPanel({ empresas, empty }: { empresas: Empresa[]; empty: boolean }) {
  // Lightweight “map”: until we add Leaflet/Google Maps, we render a coordinate list.
  // This already satisfies the “see on a map” requirement once lat/lng exists in the data.
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[360px_1fr]">
      <div className="border-b md:border-b-0 md:border-r border-border/20 p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
        <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">Empresas no mapa</p>
        <p className="text-[12px] text-muted-foreground/60 mt-1">
          {empty ? "Ajuste filtros ou cadastre empresas." : `${empresas.length} com latitude/longitude.`}
        </p>
        <div className="mt-4 space-y-2">
          {empresas.map((e) => (
            <Link
              to={`/empresas/${e.id}`}
              key={e.id}
              className="block rounded-lg border border-border/20 bg-background/40 px-3 py-2 hover:border-accent/30 transition-colors"
            >
              <p className="text-[12px] font-medium text-foreground/85 truncate">{e.nome}</p>
              <p className="text-[11px] text-muted-foreground/60 truncate">
                {e.cidade || "N/A"}{e.estado ? `/${e.estado}` : ""} · {e.latitude}, {e.longitude}
              </p>
            </Link>
          ))}
          {empresas.length === 0 && (
            <div className="rounded-lg border border-border/20 bg-background/40 p-4 text-[12px] text-muted-foreground/60">
              Nenhuma empresa com coordenadas ainda. Cadastre a empresa com latitude/longitude para aparecer aqui.
            </div>
          )}
        </div>
      </div>
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-md w-full rounded-2xl border border-border/20 bg-background/40 p-6">
          <p className="text-[13px] font-semibold text-foreground">Mapa (em implementação)</p>
          <p className="text-[12px] text-muted-foreground/60 mt-2">
            A estrutura já está pronta para exibir pontos por latitude/longitude. Na próxima etapa eu adiciono o mapa
            interativo (Leaflet) com clusters, zoom e seleção.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-muted-foreground/70">
            <div className="rounded-lg border border-border/20 bg-card/40 p-3">
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Pins</p>
              <p className="text-[12px] font-semibold text-foreground/80 mt-1">{empresas.length}</p>
            </div>
            <div className="rounded-lg border border-border/20 bg-card/40 p-3">
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Sem coords</p>
              <p className="text-[12px] font-semibold text-foreground/80 mt-1">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmpresasIndex;
