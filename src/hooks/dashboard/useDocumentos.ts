import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

export interface Documento {
  id: number;
  nome: string;
  tipo: string;
  dataCriacao: string;
}

const fetchDocumentos = async (): Promise<Documento[]> => {
  const response = await api.get("/documentos");
  return response.data;
};

export const useDocumentos = () => {
  return useQuery<Documento[], AxiosError>({
    queryKey: ["documentos"],
    queryFn: fetchDocumentos,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
