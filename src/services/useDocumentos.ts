import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

export type DocumentoStatus = "PENDENTE" | "EM_ANALISE" | "APROVADO" | "REPROVADO";

export interface Documento {
  id: number;
  empresaId: number;
  nomeEmpresa: string;
  tipoDocumento: string;
  url: string | null;
  validado: DocumentoStatus;
  analistaId: number;
  nomeAnalista: string;
}

interface SolicitarDocumentoDTO {
  empresaId: number;
  tipoDocumento: string;
  analistaId: number;
}

export function useDocumentos() {
  return useQuery<Documento[]>({
    queryKey: ["documentos"],
    queryFn: async () => {
      const response = await api.get<Documento[] | { content: Documento[] }>("/documentos");
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
  });
}

export function useDocumentosByEmpresa(empresaId?: number) {
  return useQuery<Documento[]>({
    queryKey: ["documentos", "empresa", empresaId],
    queryFn: async () => {
      const response = await api.get<Documento[] | { content: Documento[] }>(
        `/documentos/empresa/${empresaId}`
      );
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
    enabled: !!empresaId,
  });
}

export function useSolicitarDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SolicitarDocumentoDTO) => {
      const response = await api.post<Documento>("/documentos/solicitar", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Documento solicitado.");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
    onError: () => { toast.error("Erro ao solicitar. Tente novamente."); },
  });
}

export function useEnviarArquivoDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const response = await api.patch<Documento>(`/documentos/${id}/enviar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Arquivo enviado.");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
    onError: () => { toast.error("Erro ao enviar. Tente novamente."); },
  });
}

export function useValidarDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, validado }: { id: number; validado: DocumentoStatus }) => {
      const response = await api.patch<Documento>(`/documentos/${id}/validar`, { validado });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Documento validado.");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
    onError: () => { toast.error("Erro ao validar. Tente novamente."); },
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/documentos/${id}`);
    },
    onSuccess: () => {
      toast.success("Documento excluído.");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
    },
    onError: () => { toast.error("Erro ao excluir. Tente novamente."); },
  });
}
