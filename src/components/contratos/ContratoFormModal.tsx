import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, X } from "lucide-react";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Contrato, useCreateContrato, useUpdateContrato } from "@/services/useContratos";
import { usePropostas } from "@/services/usePropostas";

const STATUS_OPTIONS = [
  { value: "PENDENTE", label: "Pendente" },
  { value: "ANALISE", label: "Em análise" },
  { value: "ATIVO", label: "Ativo" },
  { value: "CONCLUIDO", label: "Concluído" },
];

interface ContratoFormModalProps {
  contrato?: Contrato;
  onClose: () => void;
}

export function ContratoFormModal({ contrato, onClose }: ContratoFormModalProps) {
  const isEditing = !!contrato;
  const create = useCreateContrato();
  const update = useUpdateContrato();
  const { data: propostas = [] } = usePropostas();

  const [propostaId, setPropostaId] = useState(contrato?.propostaId?.toString() ?? "");
  const [status, setStatus] = useState(contrato?.status ?? "PENDENTE");
  const [dataInicio, setDataInicio] = useState(contrato?.dataInicio?.slice(0, 10) ?? "");
  const [dataFim, setDataFim] = useState(contrato?.dataFim?.slice(0, 10) ?? "");
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const handleSubmit = async () => {
    if (!propostaId) { setError("Selecione uma proposta."); return; }
    setError(null);

    const data = {
      propostaId: parseInt(propostaId),
      status,
      dataInicio: dataInicio || new Date().toISOString().slice(0, 10),
      dataFim: dataFim || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };

    try {
      if (isEditing) {
        await update.mutateAsync({ id: contrato.id, data });
      } else {
        await create.mutateAsync(data);
      }
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Não foi possível salvar o contrato.";
      setError(message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => { if (!isPending) onClose(); }} />
        <motion.div
          className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between border-b border-border/20 p-5">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold text-foreground">
                {isEditing ? "Editar contrato" : "Novo contrato"}
              </h2>
            </div>
            <motion.button
              onClick={() => { if (!isPending) onClose(); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/20 hover:text-foreground"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {error && (
              <InlineFeedback tone="error" title="Erro" message={error} onDismiss={() => setError(null)} />
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Proposta *
              </Label>
              <select
                value={propostaId}
                onChange={(e) => setPropostaId(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
              >
                <option value="">Selecione a proposta</option>
                {propostas.map((p) => (
                  <option key={p.id} value={p.id}>
                    Proposta #{p.id}{p.empresaId ? ` — Empresa ${p.empresaId}` : ""} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Status</Label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Data início</Label>
                <Input
                  type="date"
                  className="h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Data fim</Label>
                <Input
                  type="date"
                  className="h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Salvando...</>
              ) : isEditing ? "Salvar alterações" : "Criar contrato"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
