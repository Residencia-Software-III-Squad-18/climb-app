import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface Empresa {
  id: number;
  razaoSocial: string;
  cnpj: string;
}

const fetchEmpresas = async (): Promise<Empresa[]> => {
  const response = await api.get("/empresas");
  return response.data;
};

export const useEmpresas = () => {
  return useQuery<Empresa[], AxiosError>({
    queryKey: ["empresas"],
    queryFn: fetchEmpresas,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};
