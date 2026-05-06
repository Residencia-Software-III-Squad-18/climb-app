import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Loader2, Upload, X } from "lucide-react";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toastErro, toastSucesso } from "@/lib/toast";
import { useUploadDocumento } from "@/services/useDocumentos";

const TIPOS_DOCUMENTO = [
  "Contrato Social",
  "Cartão CNPJ",
  "Alvará de Funcionamento",
  "Certidão Negativa Federal",
  "Certidão Negativa Estadual",
  "Certidão Negativa Municipal",
  "Balanço Patrimonial",
  "Demonstrativo de Resultado",
  "Comprovante de Endereço",
  "Documento de Identidade",
  "Procuração",
  "Outro",
];

interface UploadDocumentoModalProps {
  empresaId?: number;
  usuarioId?: number;
  onClose: () => void;
}

export function UploadDocumentoModal({ empresaId, usuarioId, onClose }: UploadDocumentoModalProps) {
  const upload = useUploadDocumento();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setArquivo(file);
    if (!nome) setNome(file.name.replace(/\.[^/.]+$/, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!arquivo) { setSubmitError("Selecione um arquivo."); return; }
    if (!nome.trim()) { setSubmitError("Informe o nome do documento."); return; }
    if (!tipo) { setSubmitError("Selecione o tipo do documento."); return; }

    setSubmitError(null);
    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("nome", nome.trim());
    formData.append("tipo", tipo);
    formData.append("descricao", descricao.trim());
    if (empresaId) formData.append("empresaId", String(empresaId));
    if (usuarioId) formData.append("usuarioId", String(usuarioId));

    try {
      await upload.mutateAsync(formData);
      toastSucesso("Documento enviado com sucesso.");
      onClose();
    } catch (error: any) {
      const message = error?.response?.data?.message || "Não foi possível enviar o documento.";
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
          onClick={() => { if (!upload.isPending) onClose(); }}
        />
        <motion.div
          className="relative z-10 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between border-b border-border/20 p-5">
            <div className="flex items-center gap-2">
              <FileUp className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold text-foreground">Enviar documento</h2>
            </div>
            <motion.button
              onClick={() => { if (!upload.isPending) onClose(); }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/20 hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {submitError && (
              <InlineFeedback
                tone="error"
                title="Erro ao enviar"
                message={submitError}
                onDismiss={() => setSubmitError(null)}
              />
            )}

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-8 transition-all ${
                dragOver
                  ? "border-accent/60 bg-accent/5"
                  : arquivo
                  ? "border-accent/30 bg-accent/5"
                  : "border-border/30 hover:border-accent/30 hover:bg-muted/10"
              }`}
            >
              <Upload className={`h-8 w-8 ${arquivo ? "text-accent" : "text-muted-foreground/30"}`} />
              {arquivo ? (
                <div className="text-center">
                  <p className="text-[12px] font-medium text-foreground">{arquivo.name}</p>
                  <p className="text-[10px] text-muted-foreground/50">
                    {(arquivo.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[12px] font-medium text-foreground/70">
                    Arraste o arquivo ou clique para selecionar
                  </p>
                  <p className="text-[10px] text-muted-foreground/40">PDF, DOC, DOCX, JPG, PNG</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Nome do documento *
                </Label>
                <Input
                  className="h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20"
                  placeholder="Ex: Contrato Social da Empresa"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Tipo *
                </Label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border/25 bg-background/40 px-3 text-[12px] text-foreground focus:outline-none focus:ring-1 focus:ring-accent/20"
                >
                  <option value="">Selecione o tipo</option>
                  {TIPOS_DOCUMENTO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Descrição
                </Label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Observações adicionais sobre o documento..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-border/25 bg-background/40 px-3 py-2 text-[12px] text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-accent/20"
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
              disabled={upload.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
              onClick={handleSubmit}
              disabled={upload.isPending}
            >
              {upload.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar documento"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
