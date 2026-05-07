import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  lida: boolean;
  tipo?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export function useNotificacoes() {
  return useQuery<Notificacao[]>({
    queryKey: ["notificacoes"],
    queryFn: async () => {
      const response = await api.get<Notificacao[] | { content: Notificacao[] }>("/notificacoes");
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
  });
}

export function useMarcarNotificacaoLida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.put<Notificacao>(`/notificacoes/${id}`, { lida: true });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
  });
}

export function useDeleteNotificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/notificacoes/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notificacoes"] }),
  });
}
