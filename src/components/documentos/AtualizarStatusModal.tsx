import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, Loader2, X } from "lucide-react";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toastErro, toastSucesso } from "@/lib/toast";
import type { DocumentoStatus } from "@/lib/access";
import { type Documento, useAtualizarStatusDocumento } from "@/services/useDocumentos";

const STATUS_OPTIONS: { value: DocumentoStatus; label: string }[] = [
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Reprovado" },
  { value: "EM_ANALISE", label: "Em análise" },
  { value: "NECESSITA_CORRECAO", label: "Necessita correção" },
  { value: "EXPIRADO", label: "Documento expirado" },
  { value: "INVALIDO", label: "Documento inválido" },
  { value: "PENDENTE", label: "Pendente de envio" },
];

const OBSERVACAO_OBRIGATORIA: DocumentoStatus[] = ["REPROVADO", "NECESSITA_CORRECAO", "INVALIDO"];

interface AtualizarStatusModalProps {
  documento: Documento;
  onClose: () => void;
}

export function AtualizarStatusModal({ documento, onClose }: AtualizarStatusModalProps) {
  const atualizar = useAtualizarStatusDocumento();
  const [status, setStatus] = useState<DocumentoStatus>(documento.status ?? "EM_ANALISE");
  const [observacao, setObservacao] = useState(documento.observacao ?? "");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const observacaoObrigatoria = OBSERVACAO_OBRIGATORIA.includes(status);

  const handleSubmit = async () => {
    if (observacaoObrigatoria && !observacao.trim()) {
      setSubmitError("A observação é obrigatória para este status.");
      return;
    }
    setSubmitError(null);
    try {
      await atualizar.mutateAsync({
        id: documento.id,
        status,
        observacao: observacao.trim() || undefined,
      });
      toastSucesso("Status do documento atualizado.");
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Não foi possível atualizar o status.";
      setSubmitError(message);
      toastErro(message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={() => { if (!atualizar.isPending) onClose(); }}
        />
        <motion.div
          className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between border-b border-border/20 p-5">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold text-foreground">Atualizar status</h2>
              <span className="text-[12px] text-muted-foreground/50">— {documento.nome}</span>
            </div>
            <motion.button
              onClick={() => { if (!atualizar.isPending) onClose(); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/20 hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="space-y-4 p-5">
            {submitError && (
              <InlineFeedback
                tone="error"
                title="Erro"
                message={submitError}
                onDismiss={() => setSubmitError(null)}
              />
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Novo status *
              </Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DocumentoStatus)}
                className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Observação {observacaoObrigatoria ? "*" : "(opcional)"}
              </Label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder={
                  observacaoObrigatoria
                    ? "Descreva o motivo da reprovação ou ajuste necessário..."
                    : "Comentário adicional para o cliente..."
                }
                rows={4}
                className="w-full resize-none rounded-lg border border-border/25 bg-background/40 px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/20"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              onClick={onClose}
              disabled={atualizar.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
              onClick={handleSubmit}
              disabled={atualizar.isPending}
            >
              {atualizar.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar status"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
