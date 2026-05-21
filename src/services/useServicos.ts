import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

interface ServicoRaw {
  idServico?: number;
  id?: number;
  nome: string;
}

export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  valor?: number;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

interface CreateServicoDTO {
  nome: string;
  descricao?: string;
  valor?: number;
}

function normalizeServico(s: ServicoRaw): Servico {
  return {
    id: s.idServico ?? s.id ?? 0,
    nome: s.nome,
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
    mutationFn: async (data: CreateServicoDTO) => {
      const response = await api.post<ServicoRaw>("/servicos", data);
      return normalizeServico(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servicos"] }),
  });
}

export function useUpdateServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateServicoDTO> }) => {
      const response = await api.put<ServicoRaw>(`/servicos/${id}`, data);
      return normalizeServico(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servicos"] }),
  });
}

export function useDeleteServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/servicos/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servicos"] }),
  });
}

export interface EmpresaServico {
  id: number;
  empresaId: number;
  servicoId: number;
  servicoNome?: string;
  dataInicio?: string;
  dataFim?: string;
  dataCriacao?: string;
}

interface CreateEmpresaServicoDTO {
  empresaId: number;
  servicoId: number;
  dataInicio?: string;
  dataFim?: string;
}

export function useEmpresaServicosByEmpresa(empresaId: number) {
  return useQuery<EmpresaServico[]>({
    queryKey: ["empresa-servicos", empresaId],
    queryFn: async () => {
      const response = await api.get<EmpresaServico[] | { content: EmpresaServico[] }>("/empresa-servicos", {
        params: { empresaId },
      });
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
    enabled: !!empresaId,
  });
}

export function useCreateEmpresaServico() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmpresaServicoDTO) => {
      const response = await api.post<EmpresaServico>("/empresa-servicos", data);
      return response.data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["empresa-servicos", vars.empresaId] });
    },
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
      queryClient.invalidateQueries({ queryKey: ["empresa-servicos", empresaId] });
    },
  });
}
