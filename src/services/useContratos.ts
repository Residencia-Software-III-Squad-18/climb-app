import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Contrato {
  id: number;
  titulo: string;
  descricao: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  empresaId: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreateContratoDTO {
  titulo: string;
  descricao: string;
  status: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  empresaId: number;
}

export function useContratos() {
  return useQuery<Contrato[]>({
    queryKey: ["contratos"],
    queryFn: async () => {
      const response = await api.get<Contrato[]>("/contratos");
      return response.data;
    },
  });
}

export function useContratoById(id: number) {
  return useQuery<Contrato>({
    queryKey: ["contratos", id],
    queryFn: async () => {
      const response = await api.get<Contrato>(`/contratos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useContratosByStatus(status: string) {
  return useQuery<Contrato[]>({
    queryKey: ["contratos", "status", status],
    queryFn: async () => {
      const response = await api.get<Contrato[]>(`/contratos/status/${status}`);
      return response.data;
    },
    enabled: !!status,
  });
}

export function useCreateContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContratoDTO) => {
      const response = await api.post<Contrato>("/contratos", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
  });
}

export function useUpdateContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateContratoDTO> }) => {
      const response = await api.put<Contrato>(`/contratos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
  });
}

export function useDeleteContrato() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/contratos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contratos"] });
    },
  });
}
