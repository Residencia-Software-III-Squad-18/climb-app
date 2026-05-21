import { useState, useMemo, useRef } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ClipboardCheck, Download, ExternalLink,
  LogOut, Plus, Settings, Moon, Search, Sun, Trash2, Upload, X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import { AtualizarStatusModal } from "@/components/documentos/AtualizarStatusModal";
import { StatusBadge } from "@/components/status/StatusBadge";
import { useCanPerformAction, useCurrentRole } from "@/hooks/useAccess";
import { getNavItemsForRole } from "@/lib/navItems";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useDocumentos,
  useSolicitarDocumento,
  useEnviarArquivoDocumento,
  useDeleteDocumento,
  type Documento,
  type DocumentoStatus,
} from "@/services/useDocumentos";
import { useEmpresas } from "@/services/useEmpresas";
import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STATUS_LABEL: Record<DocumentoStatus, string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
};

const STATUS_TONE: Record<DocumentoStatus, "neutral" | "info" | "success" | "warning" | "danger" | "alerta"> = {
  PENDENTE: "alerta",
  EM_ANALISE: "info",
  APROVADO: "success",
  REPROVADO: "danger",
};

const STATUS_FILTER_OPTIONS: { value: DocumentoStatus | "TODOS"; label: string }[] = [
  { value: "TODOS", label: "Todos os status" },
  { value: "PENDENTE", label: "Pendente" },
  { value: "EM_ANALISE", label: "Em análise" },
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Reprovado" },
];

const TIPO_OPTIONS = [
  "CNPJ", "Contrato Social", "Balanço Patrimonial", "DRE", "Declaração IR",
  "Certidão Negativa", "Alvará de Funcionamento", "Outro",
];

const Documentos = () => {
  const { isDark, setIsDark } = useTheme();
  const currentRole = useCurrentRole();
  const canAprovar = useCanPerformAction("documento.aprovar");
  const canUpload = useCanPerformAction("documento.upload");
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const basicUserData = useAuthStore((state) => state.basicUserData);
  const userInitials = (basicUserData?.nomeCompleto || "U")
    .split(" ").filter(Boolean).slice(0, 2)
    .map((s: string) => s[0].toUpperCase()).join("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DocumentoStatus | "TODOS">("TODOS");
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [atualizandoDoc, setAtualizandoDoc] = useState<Documento | null>(null);
  const [solicitarOpen, setSolicitarOpen] = useState(false);
  const [uploadDoc, setUploadDoc] = useState<Documento | null>(null);
  const [deletandoId, setDeletandoId] = useState<number | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: documentos = [], isLoading, error } = useDocumentos();
  const { data: empresas = [] } = useEmpresas();
  const solicitarMutation = useSolicitarDocumento();
  const enviarArquivo = useEnviarArquivoDocumento();
  const deletar = useDeleteDocumento();

  const [solicitarEmpresaId, setSolicitarEmpresaId] = useState("");
  const [solicitarTipo, setSolicitarTipo] = useState(TIPO_OPTIONS[0]);
  const [solicitarError, setSolicitarError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return documentos.filter((d) => {
      const matchSearch =
        d.tipoDocumento?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.nomeEmpresa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.nomeAnalista?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || d.validado === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter, documentos]);

  const handleSolicitar = async () => {
    if (!solicitarEmpresaId) { setSolicitarError("Selecione uma empresa."); return; }
    if (!basicUserData?.id) { setSolicitarError("Usuário não identificado."); return; }
    setSolicitarError(null);
    try {
      await solicitarMutation.mutateAsync({
        empresaId: parseInt(solicitarEmpresaId),
        tipoDocumento: solicitarTipo,
        analistaId: basicUserData.id,
      });
      setSolicitarOpen(false);
      setSolicitarEmpresaId("");
      setSolicitarTipo(TIPO_OPTIONS[0]);
    } catch (err: any) {
      setSolicitarError(err?.response?.data?.message || "Erro ao solicitar.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uploadDoc || !e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append("arquivo", e.target.files[0]);
    try {
      await enviarArquivo.mutateAsync({ id: uploadDoc.id, formData });
      setUploadDoc(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
              const isActive = item.path === "/documentos";
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg border border-border/25 bg-card/30 backdrop-blur-sm text-muted-foreground/50 w-[240px]">
                <Search className="w-3.5 h-3.5" />
                <input type="text" placeholder="Buscar documentos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/30 text-foreground" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DocumentoStatus | "TODOS")}
                className="h-9 rounded-lg border border-border/25 bg-card/30 px-2 text-[11px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              {canUpload && (
                <motion.button
                  onClick={() => setSolicitarOpen(true)}
                  className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)]"
                  whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-3.5 h-3.5" /> Solicitar
                </motion.button>
              )}
              <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center"><span className="text-accent font-semibold text-[11px]">{userInitials}</span></motion.div>
            </div>
          </motion.header>

          <div className="px-6 pt-6 pb-2">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Documentos</h1>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">Acompanhe o fluxo de documentação por empresa.</p>
          </div>

          <div className="px-6 pb-6">
            <motion.div className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="divide-y divide-border/10 max-h-[calc(100vh-220px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {isLoading ? (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/50">Carregando documentos...</div>
                ) : error ? (
                  <div className="py-12 text-center text-[12px] text-destructive">Erro ao carregar documentos</div>
                ) : filtered.length === 0 ? (
                  <div className="py-12 text-center text-[12px] text-muted-foreground/30">Nenhum documento encontrado</div>
                ) : (
                  filtered.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      className="px-5 py-4 hover:bg-muted/10 transition-colors cursor-pointer group"
                      onClick={() => setSelectedDoc(doc)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[12px] font-semibold text-foreground">{doc.tipoDocumento}</p>
                            <StatusBadge tone={STATUS_TONE[doc.validado ?? "PENDENTE"]}>
                              {STATUS_LABEL[doc.validado ?? "PENDENTE"]}
                            </StatusBadge>
                          </div>
                          <p className="text-[11px] text-foreground/70 group-hover:text-accent transition-colors">{doc.nomeEmpresa}</p>
                          <p className="text-[10px] text-muted-foreground/40 mt-0.5">Analista: {doc.nomeAnalista}</p>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {canUpload && !doc.url && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setUploadDoc(doc); fileInputRef.current?.click(); }}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent/5 hover:text-accent transition-colors"
                              title="Enviar arquivo"
                            >
                              <Upload className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {canAprovar && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setAtualizandoDoc(doc); }}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent/5 hover:text-accent transition-colors"
                              title="Validar"
                            >
                              <ClipboardCheck className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {canAprovar && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeletandoId(doc.id); }}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
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

      {/* Hidden file input for upload */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSelectedDoc(null)} />
            <motion.div className="relative z-10 w-full max-w-lg rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <div className="flex items-start gap-3">
                  <div>
                    <h2 className="text-[16px] font-semibold text-foreground">{selectedDoc.tipoDocumento}</h2>
                    <p className="text-[11px] text-muted-foreground/50">{selectedDoc.nomeEmpresa}</p>
                  </div>
                  <StatusBadge tone={STATUS_TONE[selectedDoc.validado ?? "PENDENTE"]} className="mt-0.5">
                    {STATUS_LABEL[selectedDoc.validado ?? "PENDENTE"]}
                  </StatusBadge>
                </div>
                <motion.button onClick={() => setSelectedDoc(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="p-5 space-y-4">
                <div className="rounded-xl border border-border/20 bg-background/50 p-4 space-y-3">
                  <p className="text-[10px] text-muted-foreground/40 font-medium tracking-[0.08em] uppercase">Detalhes</p>
                  <div className="space-y-2">
                    <div><p className="text-[10px] text-muted-foreground/40">Empresa</p><p className="text-[13px] text-foreground/80">{selectedDoc.nomeEmpresa}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/40">Analista responsável</p><p className="text-[13px] text-foreground/80">{selectedDoc.nomeAnalista}</p></div>
                    <div><p className="text-[10px] text-muted-foreground/40">Arquivo</p>
                      {selectedDoc.url ? (
                        <a href={selectedDoc.url} target="_blank" rel="noreferrer" className="text-[13px] text-accent flex items-center gap-1 hover:underline">
                          <ExternalLink className="w-3 h-3" /> Ver arquivo
                        </a>
                      ) : (
                        <p className="text-[13px] text-muted-foreground/40">Aguardando envio</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedDoc.url && (
                    <a href={selectedDoc.url} target="_blank" rel="noreferrer" className="flex-1">
                      <motion.button className="w-full h-10 rounded-lg border border-accent/20 bg-accent/10 text-accent text-[12px] font-medium flex items-center justify-center gap-2 hover:bg-accent/20 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Download className="w-4 h-4" /> Baixar documento
                      </motion.button>
                    </a>
                  )}

                  {canAprovar && (
                    <motion.button
                      onClick={() => { setSelectedDoc(null); setAtualizandoDoc(selectedDoc); }}
                      className="flex h-10 items-center gap-2 rounded-lg border border-border/25 bg-card/30 px-4 text-[12px] font-medium text-muted-foreground hover:border-accent/30 hover:text-accent transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ClipboardCheck className="w-4 h-4" /> Validar
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solicitar Modal */}
      <AnimatePresence>
        {solicitarOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setSolicitarOpen(false)} />
            <motion.div className="relative z-10 w-full max-w-md rounded-2xl border border-border/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden" initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }}>
              <div className="flex items-center justify-between p-5 border-b border-border/20">
                <h2 className="text-[15px] font-semibold text-foreground">Solicitar documento</h2>
                <motion.button onClick={() => setSolicitarOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/20" whileTap={{ scale: 0.95 }}><X className="w-4 h-4" /></motion.button>
              </div>
              <div className="p-5 space-y-4">
                {solicitarError && (
                  <InlineFeedback tone="error" title="Erro" message={solicitarError} onDismiss={() => setSolicitarError(null)} />
                )}
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Empresa *</Label>
                  <select
                    value={solicitarEmpresaId}
                    onChange={(e) => setSolicitarEmpresaId(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
                  >
                    <option value="">Selecione a empresa</option>
                    {empresas.map((e) => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Tipo de documento *</Label>
                  <select
                    value={solicitarTipo}
                    onChange={(e) => setSolicitarTipo(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
                  >
                    {TIPO_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
                <Button variant="outline" className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium" onClick={() => setSolicitarOpen(false)} disabled={solicitarMutation.isPending}>Cancelar</Button>
                <Button className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground" onClick={handleSolicitar} disabled={solicitarMutation.isPending}>
                  {solicitarMutation.isPending ? "Enviando..." : "Solicitar"}
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
              <h3 className="text-[14px] font-semibold text-foreground mb-1">Excluir documento</h3>
              <p className="text-[11px] text-muted-foreground/50 mb-4">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeletandoId(null)} className="flex-1 h-10 rounded-lg border border-border/25 bg-card/40 text-[12px] text-foreground/70">Cancelar</button>
                <button
                  onClick={async () => { await deletar.mutateAsync(deletandoId); setDeletandoId(null); }}
                  disabled={deletar.isPending}
                  className="flex-1 h-10 rounded-lg bg-destructive text-[12px] font-semibold text-white"
                >
                  {deletar.isPending ? "Excluindo..." : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {atualizandoDoc && (
        <AtualizarStatusModal
          documento={atualizandoDoc}
          onClose={() => setAtualizandoDoc(null)}
        />
      )}
    </div>
  );
};

export default Documentos;
