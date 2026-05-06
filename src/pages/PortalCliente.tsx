import { useMemo, useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileUp,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ClimbLogo from "@/components/login/ClimbLogo";
import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { StatusBadge } from "@/components/status/StatusBadge";
import { UploadDocumentoModal } from "@/components/documentos/UploadDocumentoModal";
import { useCurrentRole } from "@/hooks/useAccess";
import { getNavItemsForRole } from "@/lib/navItems";
import type { ProcessoStatus, DocumentoStatus } from "@/lib/access";
import { useAuthStore } from "@/store/useAuthStore";
import { useDocumentos, useDocumentosByEmpresa, type Documento } from "@/services/useDocumentos";

const STATUS_LABEL: Record<DocumentoStatus, string> = {
  PENDENTE: "Pendente de envio",
  EM_ANALISE: "Em análise",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
  NECESSITA_CORRECAO: "Necessita correção",
  EXPIRADO: "Documento expirado",
  INVALIDO: "Documento inválido",
};

const STATUS_TONE: Record<DocumentoStatus, "neutral" | "info" | "success" | "warning" | "danger" | "alerta"> = {
  PENDENTE: "alerta",
  EM_ANALISE: "info",
  APROVADO: "success",
  REPROVADO: "danger",
  NECESSITA_CORRECAO: "warning",
  EXPIRADO: "alerta",
  INVALIDO: "danger",
};

const PROCESSO_LABEL: Record<ProcessoStatus, string> = {
  DOCUMENTACAO_EM_ANDAMENTO: "Documentação em andamento",
  CONTRATO_EM_ANALISE: "Contrato em análise",
  AGUARDANDO_CORRECOES: "Aguardando correções",
  PROCESSO_APROVADO: "Processo aprovado",
  PROCESSO_CONCLUIDO: "Processo concluído",
};

function deriveProcessoStatus(documentos: Documento[]): ProcessoStatus {
  if (!documentos.length) return "DOCUMENTACAO_EM_ANDAMENTO";
  const statuses = documentos.map((d) => d.status ?? "PENDENTE");
  if (statuses.every((s) => s === "APROVADO")) return "PROCESSO_APROVADO";
  if (statuses.some((s) => s === "REPROVADO" || s === "NECESSITA_CORRECAO")) return "AGUARDANDO_CORRECOES";
  if (statuses.some((s) => s === "EM_ANALISE")) return "CONTRATO_EM_ANALISE";
  return "DOCUMENTACAO_EM_ANDAMENTO";
}

function processoTone(status: ProcessoStatus): "info" | "success" | "alerta" | "warning" {
  if (status === "PROCESSO_APROVADO" || status === "PROCESSO_CONCLUIDO") return "success";
  if (status === "AGUARDANDO_CORRECOES") return "alerta";
  if (status === "CONTRATO_EM_ANALISE") return "info";
  return "info";
}

function StatusDocIcon({ status }: { status?: DocumentoStatus }) {
  if (status === "APROVADO") return <CheckCircle2 className="h-3.5 w-3.5 text-accent" />;
  if (status === "REPROVADO" || status === "INVALIDO") return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
  if (status === "NECESSITA_CORRECAO" || status === "EXPIRADO") return <AlertCircle className="h-3.5 w-3.5 text-amber-500" />;
  return <Clock className="h-3.5 w-3.5 text-primary" />;
}

const PortalCliente = () => {
  const { isDark, setIsDark } = useTheme();
  const navigate = useNavigate();
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const basicUserData = useAuthStore((state) => state.basicUserData);
  const userInitials = (basicUserData?.nomeCompleto || "U")
    .split(" ").filter(Boolean).slice(0, 2)
    .map((s: string) => s[0].toUpperCase()).join("");

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const empresaId = basicUserData?.empresaId;
  const { data: docsPorEmpresa = [], isLoading: loadingEmpresa } = useDocumentosByEmpresa(empresaId);
  const { data: todosDocumentos = [], isLoading: loadingTodos } = useDocumentos();

  const documentos = empresaId ? docsPorEmpresa : todosDocumentos.filter(
    (d) => basicUserData?.id && d.usuarioId === basicUserData.id
  );
  const isLoading = empresaId ? loadingEmpresa : loadingTodos;

  const processoStatus = useMemo(() => deriveProcessoStatus(documentos), [documentos]);
  const feedbackRecente = useMemo(
    () => documentos.filter((d) => d.observacao).slice(0, 5),
    [documentos]
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)` }} />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${sidebarCollapsed ? "w-[72px]" : "w-[220px]"}`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className={`flex items-center h-16 border-b border-border/20 ${sidebarCollapsed ? "justify-center px-2" : "px-5"}`}>
            {sidebarCollapsed
              ? <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center"><span className="text-accent font-bold text-xs">C</span></motion.div>
              : <ClimbLogo className="h-[16px] text-foreground" />}
          </div>
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = item.path === "/portal";
              return (
                <motion.button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"} ${isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}
                  whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isActive && <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent" layoutId="activeNav" />}
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
                </motion.button>
              );
            })}
          </nav>
          <div className="border-t border-border/20 py-3 px-2 space-y-1">
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ${sidebarCollapsed ? "justify-center" : ""}`}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? "s" : "m"} initial={{ opacity: 0, rotate: -30 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 30 }}>
                  {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
              {!sidebarCollapsed && <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>}
            </motion.button>
            <Link to="/">
              <motion.button className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all ${sidebarCollapsed ? "justify-center" : ""}`} whileTap={{ scale: 0.98 }}>
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
            <div>
              <p className="text-[13px] font-semibold text-foreground">Portal do Cliente</p>
              <p className="text-[10px] text-muted-foreground/40">{basicUserData?.nomeCompleto}</p>
            </div>
            <motion.div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center">
              <span className="text-accent font-semibold text-[11px]">{userInitials}</span>
            </motion.div>
          </motion.header>

          <div className="px-6 pt-6 pb-2">
            <h1 className="text-[22px] font-bold text-foreground tracking-tight">Minha documentação</h1>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">Acompanhe o envio e status dos documentos da sua empresa.</p>
          </div>

          <div className="px-6 pb-6 space-y-5">
            {/* Andamento do processo */}
            <motion.div
              className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm p-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 mb-3">Andamento do processo</p>
              <div className="flex items-center gap-3">
                <StatusBadge tone={processoTone(processoStatus)} pulse={processoStatus === "CONTRATO_EM_ANALISE"}>
                  {PROCESSO_LABEL[processoStatus]}
                </StatusBadge>
                <span className="text-[11px] text-muted-foreground/40">
                  {documentos.length} documento{documentos.length !== 1 ? "s" : ""} enviado{documentos.length !== 1 ? "s" : ""}
                </span>
              </div>
            </motion.div>

            {/* Lista de documentos */}
            <motion.div
              className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border/15">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span className="text-[13px] font-semibold text-foreground">Meus documentos</span>
                </div>
                <motion.button
                  onClick={() => setShowUpload(true)}
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-accent px-3 text-[11px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileUp className="h-3 w-3" />
                  Enviar documento
                </motion.button>
              </div>

              <div className="divide-y divide-border/10 max-h-[380px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                {isLoading ? (
                  <div className="py-10 text-center text-[12px] text-muted-foreground/40">Carregando documentos...</div>
                ) : documentos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/20">
                      <FileCheck className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                    <p className="text-[12px] text-muted-foreground/40">Nenhum documento enviado ainda</p>
                    <motion.button
                      onClick={() => setShowUpload(true)}
                      className="flex h-8 items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 text-[11px] font-medium text-accent hover:bg-accent/20"
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileUp className="h-3 w-3" />
                      Enviar primeiro documento
                    </motion.button>
                  </div>
                ) : (
                  documentos.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      className="px-5 py-4 hover:bg-muted/10 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          <StatusDocIcon status={doc.status} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="text-[12px] font-semibold text-foreground">{doc.nome}</p>
                            <StatusBadge tone={STATUS_TONE[doc.status ?? "PENDENTE"]}>
                              {STATUS_LABEL[doc.status ?? "PENDENTE"]}
                            </StatusBadge>
                          </div>
                          <p className="text-[10px] text-muted-foreground/50">{doc.tipo}</p>
                          <p className="text-[10px] text-muted-foreground/30 mt-0.5">
                            Enviado em {new Date(doc.dataUpload).toLocaleDateString("pt-BR")}
                          </p>
                          {doc.observacao && (
                            <div className="mt-2">
                              <InlineFeedback
                                tone={doc.status === "APROVADO" ? "success" : doc.status === "REPROVADO" ? "error" : "info"}
                                message={doc.observacao}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Feedback recente */}
            {feedbackRecente.length > 0 && (
              <motion.div
                className="rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm p-5"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/50 mb-3">Retornos recentes da análise</p>
                <div className="space-y-3">
                  {feedbackRecente.map((doc) => (
                    <div key={doc.id} className="flex items-start gap-3">
                      <StatusDocIcon status={doc.status} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium text-foreground">{doc.nome}</p>
                        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{doc.observacao}</p>
                      </div>
                      <StatusBadge tone={STATUS_TONE[doc.status ?? "PENDENTE"]} className="shrink-0">
                        {STATUS_LABEL[doc.status ?? "PENDENTE"]}
                      </StatusBadge>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>

      {showUpload && (
        <UploadDocumentoModal
          empresaId={basicUserData?.empresaId}
          usuarioId={basicUserData?.id}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  );
};

export default PortalCliente;
