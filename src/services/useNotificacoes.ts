import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";

interface NotificacaoRaw {
  idNotificacao?: number;
  id?: number;
  mensagem?: string;
  dataEnvio?: string;
  tipo?: string;
  usuario?: { id?: number };
}

export interface Notificacao {
  id: number;
  mensagem?: string;
  dataEnvio?: string;
  tipo?: string;
  usuarioId?: number;
  titulo?: string;
  lida?: boolean;
  dataCriacao?: string;
}

function normalizeNotificacao(n: NotificacaoRaw): Notificacao {
  return {
    id: n.idNotificacao ?? n.id ?? 0,
    mensagem: n.mensagem,
    dataEnvio: n.dataEnvio,
    tipo: n.tipo,
    usuarioId: n.usuario?.id,
  };
}

export function useNotificacoes() {
  return useQuery<Notificacao[]>({
    queryKey: ["notificacoes"],
    queryFn: async () => {
      const response = await api.get<NotificacaoRaw[] | { content: NotificacaoRaw[] }>("/notificacoes");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeNotificacao);
    },
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
