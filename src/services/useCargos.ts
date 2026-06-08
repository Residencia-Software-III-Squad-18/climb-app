import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

export interface Cargo {
  id: number;
  nome: string;
}

export function useCargos() {
  return useQuery<Cargo[]>({
    queryKey: ["cargos"],
    queryFn: async () => {
      const response = await api.get<Cargo[]>("/cargos");
      return response.data;
    },
  });
}
