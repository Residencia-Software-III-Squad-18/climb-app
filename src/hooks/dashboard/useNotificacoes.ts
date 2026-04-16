import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface Notificacao {
  id: number;
  titulo: string;
  descricao: string;
  lida: boolean;
  tipo: string;
  dataCriacao: string;
}

const fetchNotificacoes = async (): Promise<Notificacao[]> => {
  const response = await api.get("/notificacoes");
  return response.data;
};

export const useNotificacoes = () => {
  return useQuery<Notificacao[], AxiosError>({
    queryKey: ["notificacoes"],
    queryFn: fetchNotificacoes,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};
