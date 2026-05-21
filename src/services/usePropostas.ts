import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

export type PropostaStatus = "PENDENTE" | "EM_ANALISE" | "APROVADA" | "RECUSADA" | "CONCLUIDA";

interface PropostaRaw {
  idProposta?: number;
  id?: number;
  empresaId?: number;
  usuarioId?: number;
  status: PropostaStatus;
  dataCriacao?: string;
}

export interface Proposta {
  id: number;
  empresaId?: number;
  usuarioId?: number;
  status: PropostaStatus;
  dataCriacao?: string;
  titulo?: string;
  descricao?: string;
  valor?: number;
  dataAtualizacao?: string;
}

interface CreatePropostaDTO {
  empresaId?: number;
  usuarioId?: number;
  status?: PropostaStatus;
  titulo?: string;
  descricao?: string;
  valor?: number;
}

function normalizeProposta(p: PropostaRaw): Proposta {
  return {
    id: p.idProposta ?? p.id ?? 0,
    empresaId: p.empresaId,
    usuarioId: p.usuarioId,
    status: p.status,
    dataCriacao: p.dataCriacao,
  };
}

export function usePropostas() {
  return useQuery<Proposta[]>({
    queryKey: ["propostas"],
    queryFn: async () => {
      const response = await api.get<PropostaRaw[] | { content: PropostaRaw[] }>("/propostas");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeProposta);
    },
  });
}

export function usePropostaById(id: number) {
  return useQuery<Proposta>({
    queryKey: ["propostas", id],
    queryFn: async () => {
      const response = await api.get<PropostaRaw>(`/propostas/${id}`);
      return normalizeProposta(response.data);
    },
    enabled: !!id,
  });
}

export function usePropostasByStatus(status: PropostaStatus) {
  return useQuery<Proposta[]>({
    queryKey: ["propostas", "status", status],
    queryFn: async () => {
      const response = await api.get<PropostaRaw[] | { content: PropostaRaw[] }>(`/propostas/status/${status}`);
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeProposta);
    },
    enabled: !!status,
  });
}

export function useCreateProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePropostaDTO) => {
      const response = await api.post<PropostaRaw>("/propostas", data);
      return normalizeProposta(response.data);
    },
    onSuccess: () => {
      toast.success("Proposta criada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
    onError: () => {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  });
}

export function useUpdateProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePropostaDTO> }) => {
      const response = await api.put<PropostaRaw>(`/propostas/${id}`, data);
      return normalizeProposta(response.data);
    },
    onSuccess: () => {
      toast.success("Proposta atualizada com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
    onError: () => {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  });
}

export function useDeleteProposta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/propostas/${id}`);
    },
    onSuccess: () => {
      toast.success("Proposta excluída com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["propostas"] });
    },
    onError: () => {
      toast.error("Erro ao excluir. Tente novamente.");
    }
  });
}
