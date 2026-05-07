import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export type PropostaStatus = "PENDENTE" | "EM_ANALISE" | "APROVADA" | "RECUSADA" | "CONCLUIDA";

export interface Proposta {
  id: number;
  titulo: string;
  descricao?: string;
  status: PropostaStatus;
  valor?: number;
  empresaId?: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreatePropostaDTO {
  titulo: string;
  descricao?: string;
  status?: PropostaStatus;
  valor?: number;
  empresaId?: number;
}

export function usePropostas() {
  return useQuery<Proposta[]>({
    queryKey: ["propostas"],
    queryFn: async () => {
      const response = await api.get<Proposta[] | { content: Proposta[] }>("/propostas");
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
  });
}

export function usePropostaById(id: number) {
  return useQuery<Proposta>({
    queryKey: ["propostas", id],
    queryFn: async () => {
      const response = await api.get<Proposta>(`/propostas/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function usePropostasByStatus(status: PropostaStatus) {
  return useQuery<Proposta[]>({
    queryKey: ["propostas", "status", status],
    queryFn: async () => {
      const response = await api.get<Proposta[] | { content: Proposta[] }>(`/propostas/status/${status}`);
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
    enabled: !!status,
  });
}

export function useCreateProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePropostaDTO) => {
      const response = await api.post<Proposta>("/propostas", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["propostas"] }),
  });
}

export function useUpdateProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePropostaDTO> }) => {
      const response = await api.put<Proposta>(`/propostas/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["propostas"] }),
  });
}

export function useDeleteProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/propostas/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["propostas"] }),
  });
}
