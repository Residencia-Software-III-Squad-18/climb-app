import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Empresa {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface CreateEmpresaDTO {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
}

export function useEmpresas() {
  return useQuery<Empresa[]>({
    queryKey: ["empresas"],
    queryFn: async () => {
      const response = await api.get<Empresa[]>("/empresas");
      return response.data;
    },
  });
}

export function useEmpresaById(id: number) {
  return useQuery<Empresa>({
    queryKey: ["empresas", id],
    queryFn: async () => {
      const response = await api.get<Empresa>(`/empresas/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEmpresaDTO) => {
      const response = await api.post<Empresa>("/empresas", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateEmpresaDTO> }) => {
      const response = await api.put<Empresa>(`/empresas/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}

export function useDeleteEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/empresas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empresas"] });
    },
  });
}
