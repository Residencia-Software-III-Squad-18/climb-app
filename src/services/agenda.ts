import { API_BASE_URL } from "@/lib/env";
import { getAuthSession, saveAuthSession } from "@/services/session";
import { getGoogleOAuthSession } from "@/services/google-oauth";

export type EmpresaOption = {
  id: number;
  nomeFantasia: string;
  razaoSocial: string;
};

const FALLBACK_EMPRESAS: EmpresaOption[] = [
  { id: 1, nomeFantasia: "Nova Capital", razaoSocial: "Nova Capital Participacoes Ltda" },
  { id: 2, nomeFantasia: "Apex Ventures", razaoSocial: "Apex Ventures Consultoria Ltda" },
  { id: 3, nomeFantasia: "Horizon Group", razaoSocial: "Horizon Group Servicos Ltda" },
  { id: 4, nomeFantasia: "Solare Investimentos", razaoSocial: "Solare Investimentos Ltda" },
  { id: 5, nomeFantasia: "Meridian Partners", razaoSocial: "Meridian Partners Assessoria Ltda" },
  { id: 6, nomeFantasia: "Vertice Consultoria", razaoSocial: "Vertice Consultoria Empresarial Ltda" },
  { id: 7, nomeFantasia: "Atlas Participacoes", razaoSocial: "Atlas Participacoes Ltda" },
  { id: 8, nomeFantasia: "Jotanunes", razaoSocial: "Jotanunes Construtora Ltda" },
];

export type ReuniaoApi = {
  idReuniao: number;
  titulo: string;
  empresa?: {
    idEmpresa?: number;
    nomeFantasia?: string;
    razaoSocial?: string;
  };
  data?: string;
  hora?: string;
  presencial?: boolean;
  local?: string;
  pauta?: string;
  status?: string;
  googleEventId?: string;
};

export type ReuniaoPayload = {
  titulo: string;
  empresa: { idEmpresa: number };
  data: string;
  hora: string;
  presencial: boolean;
  local?: string;
  pauta?: string;
  status?: string;
};

function authHeaders() {
  const accessToken = getAuthSession()?.accessToken;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

async function refreshAccessToken() {
  const session = getAuthSession();

  if (!session?.refreshToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken: session.refreshToken }),
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    success?: boolean;
    data?: string;
  };

  if (!payload.success || !payload.data) {
    return null;
  }

  const refreshedSession = {
    ...session,
    accessToken: payload.data,
    receivedAt: new Date().toISOString(),
  };
  saveAuthSession(refreshedSession);

  return refreshedSession.accessToken;
}

async function apiFetch(path: string, init: RequestInit = {}) {
  const buildHeaders = () => ({
    Accept: "application/json",
    ...authHeaders(),
    ...(init.headers ?? {}),
  });

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(),
  });

  if (response.status !== 401 && response.status !== 403) {
    return response;
  }

  const refreshedToken = await refreshAccessToken();

  if (!refreshedToken) {
    return response;
  }

  response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(),
  });

  return response;
}

function hasSystemSession() {
  return Boolean(getAuthSession()?.accessToken || getAuthSession()?.refreshToken);
}

export async function listEmpresas() {
  const response = await apiFetch("/empresas");

  if (!response.ok) {
    return FALLBACK_EMPRESAS;
  }

  const empresas = (await response.json()) as EmpresaOption[];
  return empresas.length > 0 ? empresas : FALLBACK_EMPRESAS;
}

export async function listReunioes() {
  const response = await apiFetch("/reunioes");

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar reunioes.");
  }

  return (await response.json()) as ReuniaoApi[];
}

export async function createReuniao(payload: ReuniaoPayload) {
  if (!hasSystemSession()) {
    throw new Error("Entre no sistema com e-mail e senha antes de agendar reunioes.");
  }

  const googleAccessToken = getGoogleOAuthSession()?.accessToken;
  const response = await apiFetch("/reunioes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(googleAccessToken ? { "X-Google-Access-Token": googleAccessToken } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Nao foi possivel agendar a reuniao.";

    if (response.status === 401 || response.status === 403) {
      message = "Sua sessao do sistema expirou. Saia e entre novamente para agendar reunioes.";
    } else {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      message = body?.message || body?.error || message;
    }

    throw new Error(message);
  }

  return (await response.json()) as ReuniaoApi;
}

export async function deleteReuniao(id: number) {
  const response = await apiFetch(`/reunioes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = "Nao foi possivel remover a reuniao.";

    if (response.status === 401 || response.status === 403) {
      message = "Sua sessao do sistema expirou. Saia e entre novamente para sincronizar a agenda.";
    } else {
      const body = await response.json().catch(() => null) as { message?: string; error?: string } | null;
      message = body?.message || body?.error || message;
    }

    throw new Error(message);
  }
}

export async function listGoogleCalendarEvents(timeMin: string, timeMax: string) {
  const googleAccessToken = getGoogleOAuthSession()?.accessToken;

  if (!googleAccessToken) {
    return [];
  }

  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin,
    timeMax,
  });

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${googleAccessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel sincronizar o Google Calendar.");
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      summary?: string;
      location?: string;
      description?: string;
      hangoutLink?: string;
      start?: { date?: string; dateTime?: string };
      end?: { date?: string; dateTime?: string };
    }>;
  };

  return data.items ?? [];
}
