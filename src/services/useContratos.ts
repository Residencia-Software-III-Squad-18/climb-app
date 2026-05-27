import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

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
}

export interface CreateContratoDTO {
  propostaId: number;
  dataInicio?: string;
  dataFim?: string;
  status: string;
}

function buildContratoPayload(dto: CreateContratoDTO) {
  return {
    proposta: { idProposta: dto.propostaId },
    dataInicio: dto.dataInicio,
    dataFim: dto.dataFim,
    status: dto.status,
  };
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
      const response = await api.post<ContratoRaw>("/contratos", buildContratoPayload(data));
      return normalizeContrato(response.data);
    },
    onSuccess: () => {
      toast.success("Contrato criado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
    onError: () => {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  });
}

export function useUpdateContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateContratoDTO> }) => {
      const payload = data.propostaId
        ? buildContratoPayload(data as CreateContratoDTO)
        : { dataInicio: data.dataInicio, dataFim: data.dataFim, status: data.status };
      const response = await api.put<ContratoRaw>(`/contratos/${id}`, payload);
      return normalizeContrato(response.data);
    },
    onSuccess: () => {
      toast.success("Contrato atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
    onError: () => {
      toast.error("Erro ao salvar. Tente novamente.");
    }
  });
}

export function useDeleteContrato() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contratos/${id}`);
    },
    onSuccess: () => {
      toast.success("Contrato excluído com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
    onError: () => {
      toast.error("Erro ao excluir. Tente novamente.");
    }
  });
}
