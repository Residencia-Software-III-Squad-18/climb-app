import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface Contrato {
  id: number;
  numero: string;
  nomeEmpresa: string;
  dataInicio: string;
  dataFim: string;
  valor: number;
  status: string;
}

const fetchContratos = async (): Promise<Contrato[]> => {
  const response = await api.get("/contratos");
  return response.data;
};

export const useContratos = () => {
  return useQuery<Contrato[], AxiosError>({
    queryKey: ["contratos"],
    queryFn: fetchContratos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
