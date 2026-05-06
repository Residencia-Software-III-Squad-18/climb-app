import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { FormSection } from "@/components/forms/FormSection";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toastErro, toastSucesso } from "@/lib/toast";
import { type Empresa, useUpdateEmpresa } from "@/services";

const schema = z.object({
  razaoSocial: z.string().trim().min(2, "Informe a razão social").max(150),
  nomeFantasia: z.string().trim().max(150).optional().or(z.literal("")),
  cnpj: z.string().trim().min(14, "CNPJ inválido").max(18),
  logradouro: z.string().trim().max(150).optional().or(z.literal("")),
  numero: z.string().trim().max(20).optional().or(z.literal("")),
  bairro: z.string().trim().max(80).optional().or(z.literal("")),
  cidade: z.string().trim().max(80).optional().or(z.literal("")),
  uf: z.string().trim().max(2).optional().or(z.literal("")),
  cep: z.string().trim().max(10).optional().or(z.literal("")),
  telefone: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email("Email inválido").max(160).optional().or(z.literal("")),
  representanteNome: z.string().trim().max(120).optional().or(z.literal("")),
  representanteCpf: z.string().trim().max(14).optional().or(z.literal("")),
  representanteContato: z.string().trim().max(30).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const labelClassName = "text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground";
const inputClassName = "h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20";

function cleanField(value?: string) {
  return value?.trim() ? value.trim() : undefined;
}

interface EditarEmpresaModalProps {
  empresa: Empresa;
  onClose: () => void;
}

export function EditarEmpresaModal({ empresa, onClose }: EditarEmpresaModalProps) {
  const updateEmpresa = useUpdateEmpresa();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      razaoSocial: empresa.razaoSocial ?? empresa.nome ?? "",
      nomeFantasia: empresa.nomeFantasia ?? "",
      cnpj: empresa.cnpj ?? "",
      logradouro: empresa.logradouro ?? "",
      numero: empresa.numero ?? "",
      bairro: empresa.bairro ?? "",
      cidade: empresa.cidade ?? "",
      uf: empresa.uf ?? empresa.estado ?? "",
      cep: empresa.cep ?? "",
      telefone: empresa.telefone ?? "",
      email: empresa.email ?? "",
      representanteNome: empresa.representanteNome ?? "",
      representanteCpf: empresa.representanteCpf ?? "",
      representanteContato: empresa.representanteContato ?? "",
    },
  });

  const handleClose = () => {
    if (updateEmpresa.isPending) return;
    setSubmitError(null);
    onClose();
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await updateEmpresa.mutateAsync({
        id: empresa.id,
        data: {
          razaoSocial: values.razaoSocial,
          nomeFantasia: cleanField(values.nomeFantasia),
          cnpj: values.cnpj,
          logradouro: cleanField(values.logradouro),
          numero: cleanField(values.numero),
          bairro: cleanField(values.bairro),
          cidade: cleanField(values.cidade),
          uf: cleanField(values.uf),
          cep: cleanField(values.cep),
          telefone: cleanField(values.telefone),
          email: cleanField(values.email),
          representanteNome: cleanField(values.representanteNome),
          representanteCpf: cleanField(values.representanteCpf),
          representanteContato: cleanField(values.representanteContato),
        },
      });
      toastSucesso("Empresa atualizada com sucesso.");
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Não foi possível atualizar a empresa. Tente novamente.";
      setSubmitError(message);
      toastErro(message);
    }
  });

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
              <Building2 className="h-4 w-4 text-accent" />
              <h2 className="text-[15px] font-semibold text-foreground">Editar empresa</h2>
              <span className="text-[12px] text-muted-foreground/50">— {empresa.nome}</span>
            </div>
            <motion.button
              onClick={handleClose}
              disabled={updateEmpresa.isPending}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/20 hover:text-foreground"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
            <Form {...form}>
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

              <form id="editar-empresa-form" onSubmit={onSubmit} className="space-y-6">
                <FormSection title="Dados gerais" description="Identificação principal da empresa.">
                  <FormField
                    control={form.control}
                    name="razaoSocial"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelClassName}>Razão social *</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Razão social" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomeFantasia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>Nome fantasia</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Nome fantasia" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>CNPJ *</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="00.000.000/0001-00" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>Telefone</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>E-mail</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} type="email" placeholder="contato@empresa.com" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Endereço" description="Localização da empresa.">
                  <FormField
                    control={form.control}
                    name="logradouro"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelClassName}>Logradouro</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Rua, Av., etc." {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>Número</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Ex: 100" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>Bairro</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Bairro" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>Cidade</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Cidade" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>UF</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="SP" maxLength={2} {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>CEP</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="00000-000" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Representante" description="Responsável legal pela empresa.">
                  <FormField
                    control={form.control}
                    name="representanteNome"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className={labelClassName}>Nome</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="Nome do representante" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="representanteCpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>CPF</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="000.000.000-00" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="representanteContato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelClassName}>Contato</FormLabel>
                        <FormControl>
                          <Input className={inputClassName} placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />
                </FormSection>
              </form>
            </Form>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-border/20 bg-background/40 p-4">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-lg border-border/25 bg-card/30 text-[12px] font-medium text-muted-foreground hover:text-foreground"
              onClick={handleClose}
              disabled={updateEmpresa.isPending}
            >
              Cancelar
            </Button>
            <Button
              form="editar-empresa-form"
              type="submit"
              className="h-10 rounded-lg bg-accent text-[12px] font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90"
              disabled={updateEmpresa.isPending}
            >
              {updateEmpresa.isPending ? (
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
