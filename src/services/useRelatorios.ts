import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";

interface RelatorioRaw {
  idRelatorio?: number;
  id?: number;
  contrato?: {
    idContrato?: number;
    status?: string;
  };
  urlPdf?: string;
  dataEnvio?: string;
}

export interface Relatorio {
  id: number;
  contratoId?: number;
  urlPdf?: string;
  dataEnvio?: string;
  titulo?: string;
  tipo?: string;
  status?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

function normalizeRelatorio(r: RelatorioRaw): Relatorio {
  return {
    id: r.idRelatorio ?? r.id ?? 0,
    contratoId: r.contrato?.idContrato,
    urlPdf: r.urlPdf,
    dataEnvio: r.dataEnvio,
  };
}

export function useRelatorios() {
  return useQuery<Relatorio[]>({
    queryKey: ["relatorios"],
    queryFn: async () => {
      const response = await api.get<RelatorioRaw[] | { content: RelatorioRaw[] }>("/relatorios");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizeRelatorio);
    },
  });
}
