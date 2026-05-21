import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

interface PermissaoRaw {
  idPermissao?: number;
  id?: number;
  codigo: string;
  descricao?: string;
}

export interface Permissao {
  id: number;
  codigo: string;
  descricao?: string;
  nome?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

interface CreatePermissaoDTO {
  codigo: string;
  descricao?: string;
  nome?: string;
}

function normalizePermissao(p: PermissaoRaw): Permissao {
  return {
    id: p.idPermissao ?? p.id ?? 0,
    codigo: p.codigo,
    descricao: p.descricao,
  };
}

export function usePermissoes() {
  return useQuery<Permissao[]>({
    queryKey: ["permissoes"],
    queryFn: async () => {
      const response = await api.get<PermissaoRaw[]>("/permissoes");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizePermissao);
    },
  });
}

export function usePermissaoById(id: number) {
  return useQuery<Permissao>({
    queryKey: ["permissoes", id],
    queryFn: async () => {
      const response = await api.get<PermissaoRaw>(`/permissoes/${id}`);
      return normalizePermissao(response.data);
    },
    enabled: !!id,
  });
}

export function useCreatePermissao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePermissaoDTO) => {
      const response = await api.post<PermissaoRaw>("/permissoes", data);
      return normalizePermissao(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissoes"] }),
  });
}

export function useUpdatePermissao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePermissaoDTO> }) => {
      const response = await api.put<PermissaoRaw>(`/permissoes/${id}`, data);
      return normalizePermissao(response.data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissoes"] }),
  });
}

export function useDeletePermissao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/permissoes/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["permissoes"] }),
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
