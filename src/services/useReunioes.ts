import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Reuniao {
  id: number;
  titulo: string;
  descricao: string;
  dataHora: string;
  local: string;
  empresaId: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreateReuniaoDTO {
  titulo: string;
  descricao: string;
  dataHora: string;
  local: string;
  empresaId: number;
}

export function useReunioes() {
  return useQuery<Reuniao[]>({
    queryKey: ["reunioes"],
    queryFn: async () => {
      const response = await api.get<Reuniao[]>("/reunioes");
      return response.data;
    },
  });
}

export function useReuniaoById(id: number) {
  return useQuery<Reuniao>({
    queryKey: ["reunioes", id],
    queryFn: async () => {
      const response = await api.get<Reuniao>(`/reunioes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useReunioesByEmpresa(empresaId: number) {
  return useQuery<Reuniao[]>({
    queryKey: ["reunioes", "empresa", empresaId],
    queryFn: async () => {
      const response = await api.get<Reuniao[]>(`/reunioes/empresa/${empresaId}`);
      return response.data;
    },
    enabled: !!empresaId,
  });
}

export function useCreateReuniao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReuniaoDTO) => {
      const response = await api.post<Reuniao>("/reunioes", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunioes"] });
    },
  });
}

export function useUpdateReuniao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateReuniaoDTO> }) => {
      const response = await api.put<Reuniao>(`/reunioes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunioes"] });
    },
  });
}

export function useDeleteReuniao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/reunioes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunioes"] });
    },
  });
}
