import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface Reuniao {
  id: number;
  assunto: string;
  dataHora: string;
  local?: string;
  descricao?: string;
}

const fetchReunioes = async (): Promise<Reuniao[]> => {
  const response = await api.get("/reunioes");
  return response.data;
};

export const useReunioes = () => {
  return useQuery<Reuniao[], AxiosError>({
    queryKey: ["reunioes"],
    queryFn: fetchReunioes,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
