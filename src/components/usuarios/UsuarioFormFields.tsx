import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "@/components/forms/FormSection";

export const cargos = [
  { id: 1, label: "Administrador" },
  { id: 2, label: "Gestor" },
  { id: 3, label: "Analista" },
  { id: 4, label: "Cliente" },
];

const labelClassName = "text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground";
const inputClassName = "h-10 rounded-lg border-border/25 bg-background/40 px-3 text-[12px] focus-visible:ring-accent/20";

interface UsuarioFormFieldsProps {
  hideSenha?: boolean;
}

export function UsuarioFormFields({ hideSenha = false }: UsuarioFormFieldsProps) {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormSection
        title="Dados pessoais"
        description="Informações básicas para identificação e contato do usuário."
      >
        <FormField
          control={form.control}
          name="nomeCompleto"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className={labelClassName}>Nome completo</FormLabel>
              <FormControl>
                <Input className={inputClassName} placeholder="Ex: Maria Silva" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cpf"
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
          name="contato"
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

      <FormSection
        title="Acesso"
        description="Credenciais e dados usados no login do sistema."
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel className={labelClassName}>E-mail</FormLabel>
              <FormControl>
                <Input className={inputClassName} type="email" placeholder="email@empresa.com" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        {!hideSenha ? (
          <>
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Senha</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmarSenha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClassName}>Confirmar senha</FormLabel>
                  <FormControl>
                    <Input className={inputClassName} type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </>
        ) : null}
      </FormSection>

      <FormSection
        title="Perfil"
        description="Cargo e situação atual do usuário no sistema."
      >
        <FormField
          control={form.control}
          name="cargoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Cargo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cargos.map((cargo) => (
                    <SelectItem key={cargo.id} value={String(cargo.id)}>
                      {cargo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Situação</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={inputClassName}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />
      </FormSection>
    </div>
  );
}
