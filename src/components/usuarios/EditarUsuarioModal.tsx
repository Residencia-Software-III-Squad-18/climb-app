import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Pencil, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { toastErro, toastSucesso } from "@/lib/toast";
import { type Usuario, useUpdateUsuario } from "@/services";

import { cargos, UsuarioFormFields } from "./UsuarioFormFields";

const schema = z.object({
  nomeCompleto: z.string().trim().min(3, "Informe o nome completo").max(120),
  cpf: z.string().trim().max(14).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(160),
  contato: z.string().trim().max(30).optional().or(z.literal("")),
  cargoId: z.string().min(1, "Selecione um cargo"),
  situacao: z.enum(["ATIVO", "INATIVO"]),
});

type FormValues = z.infer<typeof schema>;

interface EditarUsuarioModalProps {
  usuario: Usuario;
  onClose: () => void;
}

function cargoIdFromNome(nome: string): string {
  const match = cargos.find((c) => c.label.toLowerCase() === nome.toLowerCase());
  return match ? String(match.id) : "";
}

export function EditarUsuarioModal({ usuario, onClose }: EditarUsuarioModalProps) {
  const updateUsuario = useUpdateUsuario();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeCompleto: usuario.nomeCompleto || "",
      cpf: usuario.cpf || "",
      email: usuario.email || "",
      contato: usuario.contato || "",
      cargoId: cargoIdFromNome(usuario.cargo || ""),
      situacao: usuario.situacao === "INATIVO" ? "INATIVO" : "ATIVO",
    },
  });

  const handleClose = () => {
    if (updateUsuario.isPending) return;
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await updateUsuario.mutateAsync({
        id: usuario.id,
        data: {
          nomeCompleto: values.nomeCompleto,
          cpf: values.cpf || undefined,
          email: values.email,
          contato: values.contato || undefined,
          situacao: values.situacao,
          cargoId: Number(values.cargoId),
        },
      });
      toastSucesso("Usuário atualizado com sucesso.");
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Não foi possível atualizar o usuário. Tente novamente.";
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
          onClick={handleClose}
        />
        <motion.div
          className="relative z-10 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border/30 bg-card/95 shadow-2xl backdrop-blur-xl"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
        >
          <div className="flex items-center justify-between border-b border-border/20 p-5">
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold text-foreground">Editar usuário</h2>
              <span className="text-[12px] text-muted-foreground/50">— {usuario.nomeCompleto}</span>
            </div>
            <motion.button
              onClick={handleClose}
              disabled={updateUsuario.isPending}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
            <FormProvider {...form}>
              {submitError ? (
                <div className="mb-4">
                  <InlineFeedback
                    tone="error"
                    title="Não foi possível atualizar"
                    message={submitError}
                    onDismiss={() => setSubmitError(null)}
                  />
                </div>
              ) : null}

              <form id="editar-usuario-form" onSubmit={form.handleSubmit(onSubmit)}>
                <UsuarioFormFields hideSenha />
              </form>
            </FormProvider>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              onClick={handleClose}
              disabled={updateUsuario.isPending}
            >
              Cancelar
            </Button>
            <Button
              form="editar-usuario-form"
              type="submit"
              className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90"
              disabled={updateUsuario.isPending}
            >
              {updateUsuario.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
