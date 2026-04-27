import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Documento {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  caminho: string;
  dataUpload: string;
  usuarioId: number;
  empresaId: number;
}

interface CreateDocumentoDTO {
  nome: string;
  descricao: string;
  tipo: string;
  caminho: string;
  usuarioId: number;
  empresaId: number;
}

export function useDocumentos() {
  return useQuery<Documento[]>({
    queryKey: ["documentos"],
    queryFn: async () => {
      const response = await api.get<Documento[]>("/documentos");
      return response.data;
    },
  });
}

export function useDocumentoById(id: number) {
  return useQuery<Documento>({
    queryKey: ["documentos", id],
    queryFn: async () => {
      const response = await api.get<Documento>(`/documentos/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDocumentoDTO) => {
      const response = await api.post<Documento>("/documentos", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}

export function useUpdateDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreateDocumentoDTO> }) => {
      const response = await api.put<Documento>(`/documentos/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/documentos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}
