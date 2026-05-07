import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

export interface Relatorio {
  id: number;
  titulo: string;
  tipo: string;
  status?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export function useRelatorios() {
  return useQuery<Relatorio[]>({
    queryKey: ["relatorios"],
    queryFn: async () => {
      const response = await api.get<Relatorio[] | { content: Relatorio[] }>("/relatorios");
      const data = response.data;
      return Array.isArray(data) ? data : (data as any)?.content ?? [];
    },
  });
}
