import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

interface ContratoRaw {
  idContrato?: number;
  id?: number;
  proposta?: {
    idProposta?: number;
    empresa?: { id?: number };
    status?: string;
  };
  dataInicio?: string;
  dataFim?: string;
  status: string;
}

export interface Contrato {
  id: number;
  propostaId?: number;
  empresaId?: number;
  dataInicio?: string;
  dataFim?: string;
  status: string;
  titulo?: string;
  descricao?: string;
  valor?: number;
  dataAtualizacao?: string;
}

interface CreateContratoDTO {
  titulo?: string;
  descricao?: string;
  status: string;
  dataInicio?: string;
  dataFim?: string;
  valor?: number;
  empresaId?: number;
}

function normalizeContrato(c: ContratoRaw): Contrato {
  return {
    id: c.idContrato ?? c.id ?? 0,
    propostaId: c.proposta?.idProposta,
    empresaId: c.proposta?.empresa?.id,
    dataInicio: c.dataInicio,
    dataFim: c.dataFim,
    status: c.status,
  };
}

export function useContratos() {
  return useQuery<Contrato[]>({
    queryKey: ["contratos"],
    queryFn: async () => {
      const response = await api.get<ContratoRaw[] | { content: ContratoRaw[] }>("/contratos");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeContrato);
    },
  });
}

export function useContratoById(id: number) {
  return useQuery<Contrato>({
    queryKey: ["contratos", id],
    queryFn: async () => {
      const response = await api.get<ContratoRaw>(`/contratos/${id}`);
      return normalizeContrato(response.data);
    },
    enabled: !!id,
  });
}

export function useContratosByStatus(status: string) {
  return useQuery<Contrato[]>({
    queryKey: ["contratos", "status", status],
    queryFn: async () => {
      const response = await api.get<ContratoRaw[] | { content: ContratoRaw[] }>(`/contratos/status/${status}`);
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeContrato);
    },
    enabled: !!status,
  });
}

export function useCreateContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateContratoDTO) => {
      const response = await api.post<ContratoRaw>("/contratos", data);
      return normalizeContrato(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contratos"] }),
  });
}

export function useUpdateContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateContratoDTO> }) => {
      const response = await api.put<ContratoRaw>(`/contratos/${id}`, data);
      return normalizeContrato(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contratos"] }),
  });
}

export function useDeleteContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contratos/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contratos"] }),
  });
}
