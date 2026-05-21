import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardCheck, Loader2, X } from "lucide-react";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type Documento, type DocumentoStatus, useValidarDocumento } from "@/services/useDocumentos";

const STATUS_OPTIONS: { value: "APROVADO" | "REPROVADO"; label: string }[] = [
  { value: "APROVADO", label: "Aprovado" },
  { value: "REPROVADO", label: "Reprovado" },
];

interface AtualizarStatusModalProps {
  documento: Documento;
  onClose: () => void;
}

export function AtualizarStatusModal({ documento, onClose }: AtualizarStatusModalProps) {
  const validar = useValidarDocumento();
  const [status, setStatus] = useState<"APROVADO" | "REPROVADO">("APROVADO");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitError(null);
    try {
      await validar.mutateAsync({ id: documento.id, validado: status });
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Não foi possível validar o documento.";
      setSubmitError(message);
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
          onClick={() => { if (!validar.isPending) onClose(); }}
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
              <h2 className="text-[15px] font-semibold text-foreground">Validar documento</h2>
              <span className="text-[12px] text-muted-foreground/50">— {documento.tipoDocumento}</span>
            </div>
            <motion.button
              onClick={() => { if (!validar.isPending) onClose(); }}
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

            <div className="rounded-lg border border-border/20 bg-background/50 p-4 space-y-1">
              <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Documento</p>
              <p className="text-[13px] font-medium text-foreground">{documento.tipoDocumento}</p>
              <p className="text-[11px] text-muted-foreground/60">{documento.nomeEmpresa}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Decisão *
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`h-10 rounded-lg border text-[12px] font-medium transition-all ${
                      status === opt.value
                        ? opt.value === "APROVADO"
                          ? "border-green-500/40 bg-green-500/10 text-green-600 dark:text-green-400"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-border/25 bg-background/40 text-muted-foreground hover:border-border/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              onClick={onClose}
              disabled={validar.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
              onClick={handleSubmit}
              disabled={validar.isPending}
            >
              {validar.isPending ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando...</>
              ) : (
                "Confirmar validação"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
