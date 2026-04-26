const AUTH_SESSION_STORAGE_KEY = "climb-auth-session";

export type AuthUser = {
  id: number;
  nomeCompleto: string;
  cpf?: string;
  email: string;
  contato?: string;
  situacao?: string;
  cargoNome?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  usuario: AuthUser;
  expiresIn: number;
  receivedAt: string;
};

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function getAuthSession() {
  const rawValue = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function getCurrentUser() {
  return getAuthSession()?.usuario ?? null;
}

export function getDisplayName() {
  return getCurrentUser()?.nomeCompleto || "Usuario Climb";
}

export function getUserInitials() {
  const name = getDisplayName().trim();
  const parts = name.split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "UC";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
