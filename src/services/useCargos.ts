import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

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
    onSuccess: () => {
      toast.success("Cargo criado.");
      queryClient.invalidateQueries({ queryKey: ["cargos"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useUpdateCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateCargoDTO> }) => {
      const response = await api.put<Cargo>(`/cargos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Cargo atualizado.");
      queryClient.invalidateQueries({ queryKey: ["cargos"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useDeleteCargo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/cargos/${id}`);
    },
    onSuccess: () => {
      toast.success("Cargo excluído.");
      queryClient.invalidateQueries({ queryKey: ["cargos"] });
    },
    onError: () => { toast.error("Erro ao excluir. Tente novamente."); },
  });
}
