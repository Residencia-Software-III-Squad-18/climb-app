import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  Home,
  LogOut,
  Mail,
  MapPin,
  Moon,
  Phone,
  Plus,
  Settings,
  Shield,
  Sun,
  X,
} from "lucide-react";

import ClimbLogo from "@/components/login/ClimbLogo";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { PageHeaderActions } from "@/components/layout/PageHeaderActions";
import { useTheme } from "@/hooks/use-theme";
import { getNavItemsForRole } from "@/lib/navItems";
import { useContratos, useEmpresaById } from "@/services";
import { useServicos, useEmpresaServicosByEmpresa, useCreateEmpresaServico, useDeleteEmpresaServico } from "@/services/useServicos";

function brl(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
}

const EmpresaDetalhe = () => {
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const canEditEmpresa = useCanPerformAction("empresa.editar");
  const { id } = useParams();
  const empresaId = Number(id);
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAllContracts, setShowAllContracts] = useState(false);

  const { data: empresa, isLoading: empresaLoading, error: empresaError } = useEmpresaById(empresaId);
  const { data: contratos = [], isLoading: contratosLoading } = useContratos();
  const { data: empresaServicos = [] } = useEmpresaServicosByEmpresa(empresaId);
  const { data: todosServicos = [] } = useServicos();
  const vincularServico = useCreateEmpresaServico();
  const desvincularServico = useDeleteEmpresaServico();
  const canManageServicos = useCanPerformAction("empresa.editar");
  const [selectedServicoId, setSelectedServicoId] = useState("");

  const contratosEmpresa = useMemo(() => {
    return contratos
      .filter((c) => c.empresaId === empresaId)
      .sort((a, b) => b.id - a.id);
  }, [contratos, empresaId]);

  const servicosVinculadosIds = useMemo(() => new Set(empresaServicos.map((es) => es.servicoId)), [empresaServicos]);
  const servicosDisponiveis = useMemo(() => todosServicos.filter((s) => !servicosVinculadosIds.has(s.id)), [todosServicos, servicosVinculadosIds]);

  const receitaTotal = 0;

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
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => navigate("/empresas")}
                className="h-9 px-3 rounded-lg border border-border/25 bg-card/30 text-[12px] text-muted-foreground/70 hover:text-foreground hover:border-accent/30 transition-all inline-flex items-center gap-2"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </motion.button>
              <div className="hidden md:block">
                <p className="text-[12px] text-muted-foreground/50">Dossiê da empresa</p>
                <p className="text-[13px] font-semibold text-foreground">{empresa?.nome || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {empresa?.id && canEditEmpresa && (
                <Link to={`/empresas/${empresa.id}/editar`}>
                  <motion.button
                    className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Editar empresa
                  </motion.button>
                </Link>
              )}
              <PageHeaderActions />
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-6 space-y-5">
            {empresaLoading ? (
              <div className="rounded-xl border border-border/25 bg-card/40 p-6 text-[12px] text-muted-foreground/60">
                Carregando empresa...
              </div>
            ) : empresaError || !empresa ? (
              <div className="rounded-xl border border-border/25 bg-card/40 p-6 text-[12px] text-destructive">
                Não foi possível carregar a empresa.
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-[22px] font-bold text-foreground tracking-tight truncate">{empresa.nome}</h1>
                    <p className="text-[12px] text-muted-foreground/50 mt-0.5 truncate">
                      {empresa.cnpj} · {empresa.cidade || "N/A"}
                      {empresa.estado ? `/${empresa.estado}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/15">
                      Cliente
                    </span>
                    {typeof empresa.latitude === "number" && typeof empresa.longitude === "number" && (
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/15">
                        No mapa
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/20 bg-card/40 p-5">
                      <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">
                        Contato
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-[12px] text-foreground/80">
                          <Mail className="w-4 h-4 text-muted-foreground/60" />
                          <span className="truncate">{empresa.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-foreground/80">
                          <Phone className="w-4 h-4 text-muted-foreground/60" />
                          <span className="truncate">{empresa.telefone || "N/A"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border/20 bg-card/40 p-5">
                      <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">
                        Endereço
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-start gap-2 text-[12px] text-foreground/80">
                          <MapPin className="w-4 h-4 text-muted-foreground/60 mt-0.5" />
                          <div className="min-w-0">
                            <p className="truncate">{empresa.endereco || "N/A"}</p>
                            <p className="text-[11px] text-muted-foreground/60 truncate">
                              {empresa.cidade || "N/A"}
                              {empresa.estado ? `/${empresa.estado}` : ""} · {empresa.cep || "—"}
                            </p>
                            {typeof empresa.latitude === "number" && typeof empresa.longitude === "number" && (
                              <p className="text-[11px] text-muted-foreground/60 truncate">
                                Lat/Lng: {empresa.latitude}, {empresa.longitude}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/20 bg-card/40 p-5">
                    <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">
                      Visão financeira
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-border/20 bg-background/40 p-4">
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Contratos</p>
                        <p className="text-[14px] font-semibold text-accent mt-1">{contratosEmpresa.length}</p>
                        <p className="text-[11px] text-muted-foreground/50 mt-1">vínculos ativos</p>
                      </div>
                      <div className="rounded-lg border border-border/20 bg-background/40 p-4">
                        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Serviços</p>
                        <p className="text-[14px] font-semibold text-foreground/80 mt-1">{empresaServicos.length}</p>
                        <p className="text-[11px] text-muted-foreground/50 mt-1">contratados</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Serviços Contratados */}
                <div className="rounded-xl border border-border/20 bg-card/40 overflow-hidden">
                  <div className="p-5 border-b border-border/20">
                    <p className="text-[12px] font-semibold text-foreground">Serviços Contratados</p>
                    <p className="text-[11px] text-muted-foreground/50 mt-0.5">{empresaServicos.length} serviço(s) vinculado(s)</p>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {empresaServicos.map((es) => (
                        <div key={es.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/20 bg-accent/5 text-[12px] text-foreground/80">
                          <span>{es.servicoNome}</span>
                          {canManageServicos && (
                            <button
                              onClick={() => desvincularServico.mutate({ id: es.id, empresaId })}
                              className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                      {empresaServicos.length === 0 && (
                        <p className="text-[12px] text-muted-foreground/40">Nenhum serviço vinculado.</p>
                      )}
                    </div>
                    {canManageServicos && servicosDisponiveis.length > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <select
                          value={selectedServicoId}
                          onChange={(e) => setSelectedServicoId(e.target.value)}
                          className="flex-1 h-9 rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
                        >
                          <option value="">Adicionar serviço...</option>
                          {servicosDisponiveis.map((s) => (
                            <option key={s.id} value={s.id}>{s.nome}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            if (selectedServicoId) {
                              vincularServico.mutate({ empresaId, servicoId: parseInt(selectedServicoId) });
                              setSelectedServicoId("");
                            }
                          }}
                          disabled={!selectedServicoId || vincularServico.isPending}
                          className="h-9 w-9 flex items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Histórico de Contratos */}
                <div className="rounded-xl border border-border/20 bg-card/40 overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-border/20">
                    <div>
                      <p className="text-[12px] font-semibold text-foreground">Histórico de contratos</p>
                      <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                        {contratosLoading ? "Carregando..." : `${contratosEmpresa.length} registros vinculados à empresa`}
                      </p>
                    </div>
                    {contratosEmpresa.length > 6 && (
                      <motion.button
                        onClick={() => setShowAllContracts(true)}
                        className="h-9 px-3 rounded-lg border border-border/25 bg-card/30 text-[12px] text-muted-foreground/70 hover:text-foreground hover:border-accent/30 transition-all"
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Ver todos
                      </motion.button>
                    )}
                  </div>
                  <div className="divide-y divide-border/10">
                    {contratosEmpresa.slice(0, 6).map((c) => (
                      <div key={c.id} className="px-5 py-4 flex items-center justify-between">
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-foreground/85">CT-{c.id}</p>
                          <p className="text-[11px] text-muted-foreground/60 truncate">
                            {c.propostaId ? `Proposta #${c.propostaId}` : "—"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-muted-foreground/50">{c.status}</p>
                        </div>
                      </div>
                    ))}
                    {!contratosLoading && contratosEmpresa.length === 0 && (
                      <div className="px-5 py-10 text-center text-[12px] text-muted-foreground/60">
                        Nenhum contrato vinculado a esta empresa ainda.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showAllContracts && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setShowAllContracts(false)} />
            <motion.div
              className="relative z-10 w-full max-w-2xl max-h-[85vh] rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div>
                  <h2 className="text-[16px] font-semibold text-foreground">Todos os contratos</h2>
                  <p className="text-[11px] text-muted-foreground/50 mt-0.5">{contratosEmpresa.length} itens</p>
                </div>
                <motion.button
                  onClick={() => setShowAllContracts(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {contratosEmpresa.map((c) => (
                  <div key={c.id} className="px-5 py-4 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-foreground/85">CT-{c.id}</p>
                      <p className="text-[11px] text-muted-foreground/60 truncate">
                        {c.propostaId ? `Proposta #${c.propostaId}` : "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-muted-foreground/50">{c.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmpresaDetalhe;
