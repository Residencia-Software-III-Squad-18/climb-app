import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

interface ServicoRaw {
  idServico?: number;
  id?: number;
  nome: string;
}

export interface Servico {
  id: number;
  nome: string;
}

interface EmpresaServicoRaw {
  id?: number;
  empresa?: { idEmpresa?: number; id?: number };
  servico?: { idServico?: number; id?: number; nome?: string };
}

export interface EmpresaServico {
  id: number;
  empresaId: number;
  servicoId: number;
  servicoNome: string;
}

function normalizeServico(s: ServicoRaw): Servico {
  return {
    id: s.idServico ?? s.id ?? 0,
    nome: s.nome,
  };
}

function normalizeEmpresaServico(e: EmpresaServicoRaw): EmpresaServico {
  return {
    id: e.id ?? 0,
    empresaId: e.empresa?.idEmpresa ?? e.empresa?.id ?? 0,
    servicoId: e.servico?.idServico ?? e.servico?.id ?? 0,
    servicoNome: e.servico?.nome ?? "",
  };
}

export function useServicos() {
  return useQuery<Servico[]>({
    queryKey: ["servicos"],
    queryFn: async () => {
      const response = await api.get<ServicoRaw[] | { content: ServicoRaw[] }>("/servicos");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeServico);
    },
  });
}

export function useCreateServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { nome: string }) => {
      const response = await api.post<ServicoRaw>("/servicos", data);
      return normalizeServico(response.data);
    },
    onSuccess: () => {
      toast.success("Serviço criado.");
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useUpdateServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { nome: string } }) => {
      const response = await api.put<ServicoRaw>(`/servicos/${id}`, data);
      return normalizeServico(response.data);
    },
    onSuccess: () => {
      toast.success("Serviço atualizado.");
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useDeleteServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/servicos/${id}`);
    },
    onSuccess: () => {
      toast.success("Serviço excluído.");
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
    },
    onError: () => { toast.error("Erro ao excluir. Tente novamente."); },
  });
}

export function useEmpresaServicosByEmpresa(empresaId: number) {
  return useQuery<EmpresaServico[]>({
    queryKey: ["empresa-servicos", empresaId],
    queryFn: async () => {
      const response = await api.get<EmpresaServicoRaw[] | { content: EmpresaServicoRaw[] }>("/empresa-servicos");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items
        .map(normalizeEmpresaServico)
        .filter((es) => es.empresaId === empresaId);
    },
    enabled: !!empresaId,
  });
}

export function useCreateEmpresaServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ empresaId, servicoId }: { empresaId: number; servicoId: number }) => {
      const response = await api.post<EmpresaServicoRaw>("/empresa-servicos", {
        empresa: { idEmpresa: empresaId },
        servico: { idServico: servicoId },
      });
      return normalizeEmpresaServico(response.data);
    },
    onSuccess: (_, vars) => {
      toast.success("Serviço vinculado.");
      queryClient.invalidateQueries({ queryKey: ["empresa-servicos", vars.empresaId] });
    },
    onError: () => { toast.error("Erro ao vincular. Tente novamente."); },
  });
}

export function useDeleteEmpresaServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, empresaId }: { id: number; empresaId: number }) => {
      await api.delete(`/empresa-servicos/${id}`);
      return empresaId;
    },
    onSuccess: (empresaId) => {
      toast.success("Serviço desvinculado.");
      queryClient.invalidateQueries({ queryKey: ["empresa-servicos", empresaId] });
    },
    onError: () => { toast.error("Erro ao desvincular. Tente novamente."); },
  });
}
