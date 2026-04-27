import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Usuario {
  id: number;
  email: string;
  nomeCompleto: string;
  cargo: string;
  aceitouTermos: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreateUsuarioDTO {
  email: string;
  nomeCompleto: string;
  cargo: string;
  aceitouTermos: boolean;
}

export function useUsuarios() {
  return useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await api.get<Usuario[]>("/usuarios");
      return response.data;
    },
  });
}

export function useUsuarioById(id: number) {
  return useQuery<Usuario>({
    queryKey: ["usuarios", id],
    queryFn: async () => {
      const response = await api.get<Usuario>(`/usuarios/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUsuarioDTO) => {
      const response = await api.post<Usuario>("/usuarios", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateUsuarioDTO> }) => {
      const response = await api.put<Usuario>(`/usuarios/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/usuarios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
  });
}
