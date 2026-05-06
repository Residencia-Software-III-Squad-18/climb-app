import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import type { DocumentoStatus } from "@/lib/access";

export type { DocumentoStatus };

export interface Documento {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  caminho: string;
  dataUpload: string;
  dataAtualizacao?: string;
  usuarioId: number;
  empresaId: number;
  status?: DocumentoStatus;
  observacao?: string;
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
      const response = await api.get<Documento[] | { content: Documento[] }>("/documentos");
      const data = response.data;
      return Array.isArray(data) ? data : data?.content ?? [];
    },
  });
}

export function useDocumentosByEmpresa(empresaId?: number) {
  return useQuery<Documento[]>({
    queryKey: ["documentos", "empresa", empresaId],
    queryFn: async () => {
      const response = await api.get<Documento[] | { content: Documento[] }>("/documentos", {
        params: { empresaId },
      });
      const data = response.data;
      return Array.isArray(data) ? data : data?.content ?? [];
    },
    enabled: !!empresaId,
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

export function useUploadDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post<Documento>("/documentos/upload", formData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
  });
}

export function useAtualizarStatusDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      observacao,
    }: {
      id: number;
      status: DocumentoStatus;
      observacao?: string;
    }) => {
      const response = await api.patch<Documento>(`/documentos/${id}/status`, {
        status,
        observacao,
      });
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
