import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Shield, X } from "lucide-react";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastErro, toastSucesso } from "@/lib/toast";
import { type Permissao, useCreatePermissao, useUpdatePermissao } from "@/services/usePermissoes";

interface PermissaoFormModalProps {
  permissao?: Permissao;
  onClose: () => void;
}

export function PermissaoFormModal({ permissao, onClose }: PermissaoFormModalProps) {
  const isEditing = !!permissao;
  const create = useCreatePermissao();
  const update = useUpdatePermissao();

  const [nome, setNome] = useState(permissao?.nome ?? "");
  const [codigo, setCodigo] = useState(permissao?.codigo ?? "");
  const [descricao, setDescricao] = useState(permissao?.descricao ?? "");
  const [error, setError] = useState<string | null>(null);

  const isPending = create.isPending || update.isPending;

  const handleSubmit = async () => {
    if (!nome.trim()) { setError("Nome é obrigatório."); return; }
    if (!codigo.trim()) { setError("Código é obrigatório."); return; }
    setError(null);

    const data = {
      nome: nome.trim(),
      codigo: codigo.trim().toUpperCase(),
      descricao: descricao.trim(),
    };

    try {
      if (isEditing) {
        await update.mutateAsync({ id: permissao.id, data });
        toastSucesso("Permissão atualizada com sucesso.");
      } else {
        await create.mutateAsync(data);
        toastSucesso("Permissão criada com sucesso.");
      }
      onClose();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Não foi possível salvar a permissão.";
      setError(message);
      toastErro(message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={() => { if (!isPending) onClose(); }}
        />
        <motion.div
          className="relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between border-b border-border/20 p-5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold text-foreground">
                {isEditing ? "Editar permissão" : "Nova permissão"}
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

          <div className="space-y-4 p-5">
            {error && (
              <InlineFeedback tone="error" title="Erro" message={error} onDismiss={() => setError(null)} />
            )}

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Nome *</Label>
              <Input
                className="h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20"
                placeholder="Ex: Visualizar Contratos"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Código *</Label>
              <Input
                className="h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20"
                placeholder="Ex: CONTRATOS_VER"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">Descrição</Label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o que essa permissão permite..."
                rows={3}
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
              ) : isEditing ? "Salvar alterações" : "Criar permissão"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
