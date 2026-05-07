import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Cargo {
  id: number;
  nome: string;
  descricao?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreateCargoDTO {
  nome: string;
  descricao?: string;
}

export function useCargos() {
  return useQuery<Cargo[]>({
    queryKey: ["cargos"],
    queryFn: async () => {
      const response = await api.get<Cargo[] | { content: Cargo[] }>("/cargos");
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
  });
}

export function useCreateCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCargoDTO) => {
      const response = await api.post<Cargo>("/cargos", data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cargos"] }),
  });
}

export function useUpdateCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateCargoDTO> }) => {
      const response = await api.put<Cargo>(`/cargos/${id}`, data);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cargos"] }),
  });
}

export function useDeleteCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cargos/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cargos"] }),
  });
}
