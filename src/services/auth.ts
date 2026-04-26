import { API_BASE_URL } from "@/lib/env";
import type { AuthSession, AuthUser } from "@/services/session";

type GoogleAuthUrlResponse = {
  authorizationUrl?: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  usuario: AuthUser;
  expiresIn: number;
};

export async function loginWithPassword(email: string, senha: string): Promise<AuthSession> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<LoginResponse> | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(payload?.message || "Nao foi possivel acessar a plataforma.");
  }

  return {
    ...payload.data,
    receivedAt: new Date().toISOString(),
  };
}

export async function getGoogleAuthorizationUrl() {
  const response = await fetch(`${API_BASE_URL}/auth/google/url`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel iniciar o login com Google.");
  }

  const data = (await response.json()) as GoogleAuthUrlResponse;

  if (!data.authorizationUrl) {
    throw new Error("Resposta invalida do backend para o login com Google.");
  }

  return data.authorizationUrl;
}
