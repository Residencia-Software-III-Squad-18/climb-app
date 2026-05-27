import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

export interface Usuario {
  id: number;
  email: string;
  nomeCompleto: string;
  cargo: string;
  cargoNome?: string;
  cpf?: string;
  contato?: string;
  situacao?: "ATIVO" | "INATIVO";
  aceitouTermos?: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export type SituacaoUsuario = "ATIVO" | "INATIVO";

export interface CreateUsuarioDTO {
  nomeCompleto: string;
  cpf: string;
  email: string;
  contato?: string;
  senha: string;
  situacao?: SituacaoUsuario;
  cargoId: number;
}

interface UsuarioApiResponse {
  id: number;
  nomeCompleto: string;
  cpf?: string;
  email: string;
  contato?: string;
  situacao?: SituacaoUsuario;
  cargoNome?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

function normalizeUsuario(usuario: UsuarioApiResponse): Usuario {
  return {
    id: usuario.id,
    email: usuario.email,
    nomeCompleto: usuario.nomeCompleto,
    cargo: usuario.cargoNome ?? "",
    cargoNome: usuario.cargoNome,
    cpf: usuario.cpf,
    contato: usuario.contato,
    situacao: usuario.situacao,
    aceitouTermos: false,
    dataCriacao: usuario.dataCriacao,
    dataAtualizacao: usuario.dataAtualizacao,
  };
}

export function useUsuarios() {
  return useQuery<Usuario[]>({
    queryKey: ["usuarios"],
    queryFn: async () => {
      const response = await api.get<UsuarioApiResponse[] | { content: UsuarioApiResponse[] }>("/usuarios");
      const data = response.data;
      const usuarios = Array.isArray(data) ? data : data?.content ?? [];
      return usuarios.map(normalizeUsuario);
    },
  });
}

export function useUsuarioById(id: number) {
  return useQuery<Usuario>({
    queryKey: ["usuarios", id],
    queryFn: async () => {
      const response = await api.get<UsuarioApiResponse>(`/usuarios/${id}`);
      return normalizeUsuario(response.data);
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
      toast.success("Usuário criado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
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
      toast.success("Usuário atualizado com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/usuarios/${id}`);
    },
    onSuccess: () => {
      toast.success("Usuário excluído com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
    },
    onError: () => { toast.error("Erro ao excluir. Tente novamente."); },
  });
}
