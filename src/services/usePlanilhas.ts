import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api";
import { toast } from "sonner";

interface PlanilhaRaw {
  idPlanilha?: number;
  id?: number;
  contrato?: { idContrato?: number; id?: number };
  urlGoogleSheets: string;
  bloqueada: boolean;
  permissaoVisualizacao: string;
}

export interface Planilha {
  id: number;
  contratoId: number;
  urlGoogleSheets: string;
  bloqueada: boolean;
  permissaoVisualizacao: string;
}

export interface CreatePlanilhaDTO {
  contratoId: number;
  urlGoogleSheets: string;
  bloqueada?: boolean;
  permissaoVisualizacao?: string;
}

function normalizePlanilha(p: PlanilhaRaw): Planilha {
  return {
    id: p.idPlanilha ?? p.id ?? 0,
    contratoId: p.contrato?.idContrato ?? p.contrato?.id ?? 0,
    urlGoogleSheets: p.urlGoogleSheets,
    bloqueada: p.bloqueada,
    permissaoVisualizacao: p.permissaoVisualizacao,
  };
}

function buildPlanilhaPayload(dto: CreatePlanilhaDTO) {
  return {
    contrato: { idContrato: dto.contratoId },
    urlGoogleSheets: dto.urlGoogleSheets,
    bloqueada: dto.bloqueada ?? false,
    permissaoVisualizacao: dto.permissaoVisualizacao ?? "SOMENTE_LEITURA",
  };
}

export function usePlanilhas() {
  return useQuery<Planilha[]>({
    queryKey: ["planilhas"],
    queryFn: async () => {
      const response = await api.get<PlanilhaRaw[] | { content: PlanilhaRaw[] }>("/planilhas");
      const data = response.data;
      const items = Array.isArray(data) ? data : (data as any)?.content ?? [];
      return items.map(normalizePlanilha);
    },
  });
}

export function useCreatePlanilha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePlanilhaDTO) => {
      const response = await api.post<PlanilhaRaw>("/planilhas", buildPlanilhaPayload(data));
      return normalizePlanilha(response.data);
    },
    onSuccess: () => {
      toast.success("Planilha criada.");
      queryClient.invalidateQueries({ queryKey: ["planilhas"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useUpdatePlanilha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CreatePlanilhaDTO> }) => {
      const payload = data.contratoId
        ? buildPlanilhaPayload(data as CreatePlanilhaDTO)
        : {
            urlGoogleSheets: data.urlGoogleSheets,
            bloqueada: data.bloqueada,
            permissaoVisualizacao: data.permissaoVisualizacao,
          };
      const response = await api.put<PlanilhaRaw>(`/planilhas/${id}`, payload);
      return normalizePlanilha(response.data);
    },
    onSuccess: () => {
      toast.success("Planilha atualizada.");
      queryClient.invalidateQueries({ queryKey: ["planilhas"] });
    },
    onError: () => { toast.error("Erro ao salvar. Tente novamente."); },
  });
}

export function useDeletePlanilha() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/planilhas/${id}`);
    },
    onSuccess: () => {
      toast.success("Planilha excluída.");
      queryClient.invalidateQueries({ queryKey: ["planilhas"] });
    },
    onError: () => { toast.error("Erro ao excluir. Tente novamente."); },
  });
}
