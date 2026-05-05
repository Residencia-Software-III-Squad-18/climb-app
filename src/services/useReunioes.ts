import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { api } from "@/api";
import {
  GOOGLE_ACCESS_TOKEN_STORAGE_KEY,
  syncGoogleAccessToken,
} from "@/lib/googleAccessToken";

export interface Reuniao {
  id: number;
  idReuniao?: number;
  titulo: string;
  descricao?: string;
  pauta?: string;
  dataHora: string;
  data?: string;
  hora?: string;
  local: string;
  empresaId: number;
  empresa?: {
    id?: number;
    idEmpresa?: number;
    nome?: string;
    nomeFantasia?: string;
    razaoSocial?: string;
  };
  presencial?: boolean;
  status?: string;
  googleEventId?: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

export interface CreateReuniaoDTO {
  titulo: string;
  pauta?: string;
  data: string;
  hora: string;
  presencial: boolean;
  local?: string;
  empresaId: number;
  status?: string;
}

type ReuniaoApi = Reuniao & {
  idReuniao?: number;
};

function buildDataHora(reuniao: ReuniaoApi) {
  if (reuniao.dataHora) return reuniao.dataHora;
  if (reuniao.data && reuniao.hora) return `${reuniao.data}T${reuniao.hora}`;
  return "";
}

function normalizeReuniao(reuniao: ReuniaoApi): Reuniao {
  const empresaId =
    reuniao.empresaId ??
    reuniao.empresa?.id ??
    reuniao.empresa?.idEmpresa ??
    0;

  return {
    ...reuniao,
    id: reuniao.id ?? reuniao.idReuniao ?? 0,
    idReuniao: reuniao.idReuniao ?? reuniao.id,
    empresaId,
    dataHora: buildDataHora(reuniao),
    descricao: reuniao.descricao ?? reuniao.pauta ?? "",
    local: reuniao.local ?? "",
  };
}

function buildCreatePayload(data: CreateReuniaoDTO) {
  return {
    titulo: data.titulo,
    pauta: data.pauta,
    data: data.data,
    hora: data.hora,
    presencial: data.presencial,
    local: data.local,
    status: data.status ?? "AGENDADA",
    empresa: {
      idEmpresa: data.empresaId,
    },
  };
}

function buildHeaders() {
  const googleAccessToken = getGoogleAccessToken();
  return googleAccessToken
    ? { "X-Google-Access-Token": googleAccessToken }
    : undefined;
}

function getGoogleAccessToken() {
  return localStorage.getItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY);
}

/** GET com X-Google-Access-Token quando existir — necessário para o backend mesclar eventos externos do Calendar. */
async function fetchReuniaoList(path: string): Promise<Reuniao[]> {
  const hadGoogleToken = !!getGoogleAccessToken();
  try {
    const response = await api.get<Reuniao[]>(path, {
      headers: buildHeaders(),
    });
    return response.data.map(normalizeReuniao);
  } catch (err) {
    if (
      hadGoogleToken &&
      isAxiosError(err) &&
      (err.response?.status === 401 || err.response?.status === 403)
    ) {
      syncGoogleAccessToken(null);
      const response = await api.get<Reuniao[]>(path);
      return response.data.map(normalizeReuniao);
    }
    throw err;
  }
}

async function fetchReuniaoOne(id: number): Promise<Reuniao> {
  const path = `/reunioes/${id}`;
  const hadGoogleToken = !!getGoogleAccessToken();
  try {
    const response = await api.get<Reuniao>(path, {
      headers: buildHeaders(),
    });
    return normalizeReuniao(response.data);
  } catch (err) {
    if (
      hadGoogleToken &&
      isAxiosError(err) &&
      (err.response?.status === 401 || err.response?.status === 403)
    ) {
      syncGoogleAccessToken(null);
      const response = await api.get<Reuniao>(path);
      return normalizeReuniao(response.data);
    }
    throw err;
  }
}

export function useReunioes() {
  return useQuery<Reuniao[]>({
    queryKey: ["reunioes"],
    queryFn: () => fetchReuniaoList("/reunioes"),
  });
}

export function useReuniaoById(id: number) {
  return useQuery<Reuniao>({
    queryKey: ["reunioes", id],
    queryFn: () => fetchReuniaoOne(id),
    enabled: !!id,
  });
}

export function useReunioesByEmpresa(empresaId: number) {
  return useQuery<Reuniao[]>({
    queryKey: ["reunioes", "empresa", empresaId],
    queryFn: () => fetchReuniaoList(`/reunioes/empresa/${empresaId}`),
    enabled: !!empresaId,
  });
}

export function useCreateReuniao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateReuniaoDTO) => {
      const response = await api.post<ReuniaoApi>(
        "/reunioes",
        buildCreatePayload(data),
        {
          headers: buildHeaders(),
        },
      );
      return normalizeReuniao(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunioes"] });
    },
  });
}

export function useUpdateReuniao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CreateReuniaoDTO }) => {
      const response = await api.put<ReuniaoApi>(
        `/reunioes/${id}`,
        buildCreatePayload(data),
        {
          headers: buildHeaders(),
        },
      );
      return normalizeReuniao(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunioes"] });
    },
  });
}

export function useDeleteReuniao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/reunioes/${id}`, {
        headers: buildHeaders(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunioes"] });
    },
  });
}
