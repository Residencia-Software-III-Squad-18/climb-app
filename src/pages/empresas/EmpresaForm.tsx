import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  FileText,
  Home,
  LogOut,
  Loader2,
  Moon,
  Save,
  Settings,
  Shield,
  Sun,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { InlineFeedback } from "@/components/feedback/InlineFeedback";
import { FormSection } from "@/components/forms/FormSection";
import ClimbLogo from "@/components/login/ClimbLogo";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentRole } from "@/hooks/useAccess";
import { useTheme } from "@/hooks/use-theme";
import { toastErro, toastSucesso } from "@/lib/toast";
import { getNavItemsForRole } from "@/lib/navItems";
import { useCreateEmpresa, useEmpresaById, useUpdateEmpresa } from "@/services";

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

const EmpresaForm = () => {
  const currentRole = useCurrentRole();
  const navItems = useMemo(() => getNavItemsForRole(currentRole), [currentRole]);
  const { id } = useParams();
  const empresaId = id ? Number(id) : null;
  const isEdit = typeof empresaId === "number" && Number.isFinite(empresaId);
  const navigate = useNavigate();
  const { isDark, setIsDark } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { data: empresa, isLoading: empresaLoading } = useEmpresaById(empresaId ?? 0);
  const create = useCreateEmpresa();
  const update = useUpdateEmpresa();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const defaults = useMemo<FormValues>(
    () => ({
      razaoSocial: "",
      nomeFantasia: "",
      cnpj: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
      telefone: "",
      email: "",
      representanteNome: "",
      representanteCpf: "",
      representanteContato: "",
    }),
    []
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaults,
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!isEdit) return;
    if (!empresa) return;
    form.reset({
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
    });
  }, [empresa, form, isEdit]);

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);

    const payload = {
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
    };

    try {
      if (isEdit && empresaId) {
        await update.mutateAsync({ id: empresaId, data: payload });
        toastSucesso("Empresa atualizada com sucesso.");
        navigate(`/empresas/${empresaId}`);
        return;
      }

      const created = await create.mutateAsync(payload);
      toastSucesso("Empresa cadastrada com sucesso.");
      navigate(`/empresas/${created.id}`);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Não foi possível salvar a empresa. Tente novamente.";
      setSubmitError(message);
      toastErro(message);
    }
  });

  const busy = create.isPending || update.isPending || (isEdit && empresaLoading);

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 0% 0%, hsl(var(--accent) / 0.04) 0%, transparent 50%), radial-gradient(ellipse 50% 40% at 100% 100%, hsl(var(--primary) / 0.03) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <motion.aside
          className={`fixed left-0 top-0 bottom-0 z-30 flex flex-col border-r border-border/30 bg-card/60 backdrop-blur-xl transition-all duration-300 ${
            sidebarCollapsed ? "w-[72px]" : "w-[220px]"
          }`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div
            className={`flex items-center h-16 border-b border-border/20 ${
              sidebarCollapsed ? "justify-center px-2" : "px-5"
            }`}
          >
            {sidebarCollapsed ? (
              <motion.div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-xs">C</span>
              </motion.div>
            ) : (
              <ClimbLogo className="h-[16px] text-foreground" />
            )}
          </div>
          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 rounded-lg transition-all group relative ${
                  sidebarCollapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5"
                } ${
                  item.label === "Empresas"
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                }`}
                whileHover={{ x: sidebarCollapsed ? 0 : 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label === "Empresas" && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                    layoutId="activeNav"
                  />
                )}
                <item.icon className="w-[18px] h-[18px] shrink-0" />
                {!sidebarCollapsed && <span className="text-[13px] font-medium">{item.label}</span>}
              </motion.button>
            ))}
          </nav>
          <div className="border-t border-border/20 py-3 px-2 space-y-1">
            <motion.button
              onClick={() => setIsDark(!isDark)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDark ? "s" : "m"}
                  initial={{ opacity: 0, rotate: -30 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 30 }}
                >
                  {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
              {!sidebarCollapsed && (
                <span className="text-[13px] font-medium">{isDark ? "Modo claro" : "Modo escuro"}</span>
              )}
            </motion.button>
            <Link to="/">
              <motion.button
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all ${
                  sidebarCollapsed ? "justify-center" : ""
                }`}
                whileTap={{ scale: 0.98 }}
              >
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
            <motion.button
              onClick={() => navigate(isEdit && empresaId ? `/empresas/${empresaId}` : "/empresas")}
              className="h-9 px-3 rounded-lg border border-border/25 bg-card/30 text-[12px] text-muted-foreground/70 hover:text-foreground hover:border-accent/30 transition-all inline-flex items-center gap-2"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </motion.button>

            <motion.button
              onClick={onSubmit}
              disabled={busy}
              className="h-9 px-4 rounded-lg bg-accent text-accent-foreground text-[12px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_-2px_hsl(var(--accent)/0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ scale: busy ? 1 : 1.02, y: busy ? 0 : -1 }}
              whileTap={{ scale: busy ? 1 : 0.98 }}
              type="button"
            >
              <Save className="w-4 h-4" />
              {busy ? "Salvando..." : "Salvar"}
            </motion.button>
          </motion.header>

          <div className="px-6 pt-6 pb-6">
            <div className="max-w-3xl">
              <h1 className="text-[22px] font-bold text-foreground tracking-tight">
                {isEdit ? "Editar empresa" : "Nova empresa"}
              </h1>
              <p className="text-[12px] text-muted-foreground/50 mt-0.5">
                Cadastre ou atualize os dados da empresa seguindo o contrato atual do backend.
              </p>

              <div className="mt-5 rounded-xl border border-border/25 bg-card/40 backdrop-blur-sm p-5">
                <Form {...form}>
                  {submitError ? (
                    <div className="mb-5">
                      <InlineFeedback
                        tone="error"
                        title="Não foi possível salvar"
                        message={submitError}
                        onDismiss={() => setSubmitError(null)}
                      />
                    </div>
                  ) : null}

                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <FormSection
                      title="Identificação"
                      description="Informações principais utilizadas para cadastro e validação da empresa."
                    >
                      <FormField
                        control={form.control}
                        name="razaoSocial"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className={labelClassName}>Razão social</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} {...field} />
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
                              <Input className={inputClassName} {...field} />
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
                            <FormLabel className={labelClassName}>CNPJ</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} placeholder="00.000.000/0000-00" {...field} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    </FormSection>

                    <FormSection
                      title="Endereço"
                      description="Dados estruturados conforme o payload atual do backend."
                      contentClassName="grid grid-cols-1 gap-4 md:grid-cols-6"
                    >
                      <FormField
                        control={form.control}
                        name="logradouro"
                        render={({ field }) => (
                          <FormItem className="md:col-span-4">
                            <FormLabel className={labelClassName}>Logradouro</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} {...field} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className={labelClassName}>Número</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} {...field} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel className={labelClassName}>Bairro</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} {...field} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className={labelClassName}>Cidade</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} {...field} />
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
                            <FormLabel className={labelClassName}>Estado</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} maxLength={2} placeholder="SP" {...field} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cep"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className={labelClassName}>CEP</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} placeholder="00000-000" {...field} />
                            </FormControl>
                            <FormMessage className="text-[11px]" />
                          </FormItem>
                        )}
                      />
                    </FormSection>

                    <FormSection
                      title="Contato"
                      description="Canais principais de contato com a empresa."
                    >
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

                    <FormSection
                      title="Representante"
                      description="Pessoa de contato vinculada à empresa."
                      contentClassName="grid grid-cols-1 gap-4 md:grid-cols-3"
                    >
                      <FormField
                        control={form.control}
                        name="representanteNome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelClassName}>Nome</FormLabel>
                            <FormControl>
                              <Input className={inputClassName} {...field} />
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmpresaForm;
