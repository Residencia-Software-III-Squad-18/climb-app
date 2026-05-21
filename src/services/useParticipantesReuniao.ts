import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api";

export interface ParticipanteReuniao {
  id: number;
  reuniao?: { id?: number; idReuniao?: number };
  usuario?: { id?: number; nomeCompleto?: string; email?: string };
}

export interface CreateParticipanteDTO {
  reuniaoId: number;
  usuarioId: number;
}

function normalize(p: ParticipanteReuniao & { reuniao?: { id?: number; idReuniao?: number }; usuario?: { id?: number } }): ParticipanteReuniao {
  return {
    id: p.id,
    reuniao: p.reuniao,
    usuario: p.usuario,
  };
}

export function useParticipantesReuniao(reuniaoId?: number) {
  return useQuery<ParticipanteReuniao[]>({
    queryKey: ["participantes-reuniao", reuniaoId],
    queryFn: async () => {
      const response = await api.get<ParticipanteReuniao[]>("/participantes-reuniao");
      const all = Array.isArray(response.data) ? response.data : [];
      if (reuniaoId == null) return all.map(normalize);
      return all
        .filter((p) => (p.reuniao?.id ?? p.reuniao?.idReuniao) === reuniaoId)
        .map(normalize);
    },
  });
}

export function useAddParticipante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reuniaoId, usuarioId }: CreateParticipanteDTO) => {
      const response = await api.post<ParticipanteReuniao>("/participantes-reuniao", {
        reuniao: { idReuniao: reuniaoId },
        usuario: { id: usuarioId },
      });
      return normalize(response.data);
    },
    onSuccess: () => {
      toast.success("Participante adicionado.");
      queryClient.invalidateQueries({ queryKey: ["participantes-reuniao"] });
    },
    onError: () => { toast.error("Erro ao adicionar participante."); },
  });
}

export function useRemoveParticipante() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/participantes-reuniao/${id}`);
    },
    onSuccess: () => {
      toast.success("Participante removido.");
      queryClient.invalidateQueries({ queryKey: ["participantes-reuniao"] });
    },
    onError: () => { toast.error("Erro ao remover participante."); },
  });
}
