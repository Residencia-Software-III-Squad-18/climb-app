import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, UserPlus, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { Button } from "@/components/ui/button";
import { toastErro, toastSucesso } from "@/lib/toast";
import { useCreateUsuario } from "@/services";

import { UsuarioFormFields } from "./UsuarioFormFields";

const schema = z
  .object({
    nomeCompleto: z.string().trim().min(3, "Informe o nome completo").max(120),
    cpf: z.string().trim().min(11, "CPF inválido").max(14),
    email: z.string().trim().email("E-mail inválido").max(160),
    contato: z.string().trim().max(30).optional().or(z.literal("")),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").max(64),
    confirmarSenha: z.string(),
    cargoId: z.string().min(1, "Selecione um cargo"),
    situacao: z.enum(["ATIVO", "INATIVO"]),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não conferem",
    path: ["confirmarSenha"],
  });

type FormValues = z.infer<typeof schema>;

interface NovoUsuarioModalProps {
  onClose: () => void;
  open: boolean;
}

export function NovoUsuarioModal({ onClose, open }: NovoUsuarioModalProps) {
  const createUsuario = useCreateUsuario();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomeCompleto: "",
      cpf: "",
      email: "",
      contato: "",
      senha: "",
      confirmarSenha: "",
      cargoId: "",
      situacao: "ATIVO",
    },
  });

  const handleClose = () => {
    if (createUsuario.isPending) return;
    form.reset();
    setSubmitError(null);
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);
    try {
      await createUsuario.mutateAsync({
        nomeCompleto: values.nomeCompleto,
        cpf: values.cpf,
        email: values.email,
        contato: values.contato || undefined,
        senha: values.senha,
        situacao: values.situacao,
        cargoId: Number(values.cargoId),
      });
      toastSucesso("Usuário cadastrado com sucesso.");
      form.reset();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Não foi possível cadastrar o usuário. Tente novamente.";
      setSubmitError(message);
      toastErro(message);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
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
                <UserPlus className="h-4 w-4 text-accent" />
                <h2 className="text-[15px] font-semibold text-foreground">Novo usuário</h2>
              </div>
              <motion.button
                onClick={handleClose}
                disabled={createUsuario.isPending}
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
                      title="Não foi possível cadastrar"
                      message={submitError}
                      onDismiss={() => setSubmitError(null)}
                    />
                  </div>
                ) : null}

                <form id="novo-usuario-form" onSubmit={form.handleSubmit(onSubmit)}>
                  <UsuarioFormFields />
                </form>
              </FormProvider>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium text-muted-foreground hover:text-foreground"
                onClick={handleClose}
                disabled={createUsuario.isPending}
              >
                Cancelar
              </Button>
              <Button
                form="novo-usuario-form"
                type="submit"
                className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90"
                disabled={createUsuario.isPending}
              >
                {createUsuario.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar usuário"
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
