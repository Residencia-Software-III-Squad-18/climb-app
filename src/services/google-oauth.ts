import type { AuthSession } from "@/services/session";

const GOOGLE_OAUTH_STORAGE_KEY = "climb-google-oauth";

export type StoredGoogleOAuthSession = {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  scope?: string;
  receivedAt: string;
};

export type GoogleOAuthSuccessResult = {
  status: "success";
  session: StoredGoogleOAuthSession;
  authSession?: AuthSession;
};

export type GoogleOAuthErrorResult = {
  status: "error";
  error: string;
};

export type GoogleOAuthResult = GoogleOAuthSuccessResult | GoogleOAuthErrorResult;

export function parseGoogleOAuthHash(value: string): GoogleOAuthResult | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.startsWith("#") || value.startsWith("?") ? value.slice(1) : value;

  const params = new URLSearchParams(normalized);
  const status = params.get("google_oauth");

  if (status === "success") {
    const accessToken = params.get("google_access_token");

    if (!accessToken) {
      return {
        status: "error",
        error: "O backend retornou sucesso no Google, mas sem access token.",
      };
    }

    const expiresInValue = params.get("google_expires_in");
    const expiresIn = expiresInValue ? Number(expiresInValue) : undefined;

    return {
      status: "success",
      session: {
        accessToken,
        refreshToken: params.get("google_refresh_token") || undefined,
        tokenType: params.get("google_token_type") || undefined,
        expiresIn: Number.isFinite(expiresIn) ? expiresIn : undefined,
        scope: params.get("google_scope") || undefined,
        receivedAt: new Date().toISOString(),
      },
      authSession: parseAuthSession(params),
    };
  }

  if (status === "error") {
    return {
      status: "error",
      error: params.get("google_oauth_error") || "Nao foi possivel concluir o login com Google.",
    };
  }

  return undefined;
}

function parseAuthSession(params: URLSearchParams): AuthSession | undefined {
  const accessToken = params.get("app_access_token");
  const refreshToken = params.get("app_refresh_token");
  const userId = params.get("app_user_id");
  const email = params.get("app_user_email");
  const nomeCompleto = params.get("app_user_name");

  if (!accessToken || !refreshToken || !userId || !email || !nomeCompleto) {
    return undefined;
  }

  const expiresInValue = params.get("app_expires_in");
  const expiresIn = expiresInValue ? Number(expiresInValue) : 0;

  return {
    accessToken,
    refreshToken,
    expiresIn: Number.isFinite(expiresIn) ? expiresIn : 0,
    receivedAt: new Date().toISOString(),
    usuario: {
      id: Number(userId),
      nomeCompleto,
      email,
      situacao: params.get("app_user_status") || undefined,
      cargoNome: params.get("app_user_role") || undefined,
    },
  };
}

export function saveGoogleOAuthSession(session: StoredGoogleOAuthSession) {
  localStorage.setItem(GOOGLE_OAUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getGoogleOAuthSession() {
  const rawValue = localStorage.getItem(GOOGLE_OAUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as StoredGoogleOAuthSession;
  } catch {
    localStorage.removeItem(GOOGLE_OAUTH_STORAGE_KEY);
    return null;
  }
}

export function clearGoogleOAuthSession() {
  localStorage.removeItem(GOOGLE_OAUTH_STORAGE_KEY);
}

export function clearGoogleOAuthHashFromUrl() {
  window.history.replaceState({}, document.title, window.location.pathname);
}
