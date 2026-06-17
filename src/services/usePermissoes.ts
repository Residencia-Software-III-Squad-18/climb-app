import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Permissao {
  idPermissao: number;
  codigo: string;
  descricao: string;
}

interface CreatePermissaoDTO {
  codigo: string;
  descricao: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface UsuarioPermissaoAssociacao {
  id: number;
  usuarioId: number;
  permissaoId: number;
  usuario?: unknown;
  permissao?: Permissao;
}

interface CreateUsuarioPermissaoDTO {
  usuarioId: number;
  permissaoId: number;
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

export function usePermissoesPorUsuario(usuarioId: number) {
  return useQuery<string[]>({
    queryKey: ["usuario-permissoes", usuarioId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<string[]>>(`/rbac/usuario/${usuarioId}/permissoes`);
      return response.data.data;
    },
    enabled: !!usuarioId,
  });
}

export function useUsuarioPermissoesAssociacoes(usuarioId: number) {
  return useQuery<UsuarioPermissaoAssociacao[]>({
    queryKey: ["usuario-permissoes-associacoes", usuarioId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<UsuarioPermissaoAssociacao[]>>(
        `/usuario-permissoes/usuario/${usuarioId}`
      );
      return response.data.data;
    },
    enabled: !!usuarioId,
  });
}

export function useCreateUsuarioPermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUsuarioPermissaoDTO) => {
      const response = await api.post<ApiResponse<UsuarioPermissaoAssociacao>>("/usuario-permissoes", data);
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["usuario-permissoes", variables.usuarioId] });
      queryClient.invalidateQueries({ queryKey: ["usuario-permissoes-associacoes", variables.usuarioId] });
    },
  });
}

export function useDeleteUsuarioPermissao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number; usuarioId?: number }) => {
      await api.delete(`/usuario-permissoes/${id}`);
    },
    onSuccess: (_, variables) => {
      if (variables.usuarioId) {
        queryClient.invalidateQueries({ queryKey: ["usuario-permissoes", variables.usuarioId] });
        queryClient.invalidateQueries({ queryKey: ["usuario-permissoes-associacoes", variables.usuarioId] });
      }
    },
  });
}

export function useTemPermissao(usuarioId: number, permissao: string) {
  return useQuery<boolean>({
    queryKey: ["usuario-permissoes", usuarioId, "tem-permissao", permissao],
    queryFn: async () => {
      const response = await api.get<ApiResponse<boolean>>(`/rbac/usuario/${usuarioId}/tem-permissao/${permissao}`);
      return response.data.data;
    },
    enabled: !!usuarioId && !!permissao,
  });
}
