import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Permissao {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreatePermissaoDTO {
  codigo: string;
  nome: string;
  descricao: string;
}

export function usePermissoes() {
  return useQuery<Permissao[]>({
    queryKey: ["permissoes"],
    queryFn: async () => {
      const response = await api.get<Permissao[]>("/permissoes");
      return response.data;
    },
  });
}

export function usePermissaoById(id: number) {
  return useQuery<Permissao>({
    queryKey: ["permissoes", id],
    queryFn: async () => {
      const response = await api.get<Permissao>(`/permissoes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreatePermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePermissaoDTO) => {
      const response = await api.post<Permissao>("/permissoes", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissoes"] });
    },
  });
}

export function useUpdatePermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePermissaoDTO> }) => {
      const response = await api.put<Permissao>(`/permissoes/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissoes"] });
    },
  });
}

export function useDeletePermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/permissoes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissoes"] });
    },
  });
}

export interface UsuarioPermissao {
  usuarioId: number;
  permissoes: Permissao[];
}

export function usePermissoesPorUsuario(usuarioId: number) {
  return useQuery<UsuarioPermissao>({
    queryKey: ["usuario-permissoes", usuarioId],
    queryFn: async () => {
      const response = await api.get<UsuarioPermissao>(`/rbac/usuario/${usuarioId}/permissoes`);
      return response.data;
    },
    enabled: !!usuarioId,
  });
}

export function useTemPermissao(usuarioId: number, permissao: string) {
  return useQuery<boolean>({
    queryKey: ["usuario-permissoes", usuarioId, "tem-permissao", permissao],
    queryFn: async () => {
      const response = await api.get<boolean>(`/rbac/usuario/${usuarioId}/tem-permissao/${permissao}`);
      return response.data;
    },
    enabled: !!usuarioId && !!permissao,
  });
}
