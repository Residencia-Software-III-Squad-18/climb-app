export const GOOGLE_ACCESS_TOKEN_STORAGE_KEY = "@CLIMB:GOOGLE_ACCESS_TOKEN";

export function syncGoogleAccessToken(token: string | null | undefined) {
  if (token) {
    localStorage.setItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY);
  }
}
