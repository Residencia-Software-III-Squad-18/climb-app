export const GOOGLE_ACCESS_TOKEN_STORAGE_KEY = "@CLIMB:GOOGLE_ACCESS_TOKEN";

/**
 * Persiste o access token do Google Calendar usado em `X-Google-Access-Token`.
 *
 * - `string`: grava (login Google ou exchange que devolve o token).
 * - `null`: remove (logout, token inválido no GET /reunioes).
 * - `undefined`: não altera o valor já salvo — login por e-mail/senha não envia
 *   `googleAccessToken` na resposta; limpar aqui apagava o token e a agenda
 *   voltava a mostrar só reuniões do banco.
 */
export function syncGoogleAccessToken(token: string | null | undefined) {
  if (typeof token === "string" && token.length > 0) {
    localStorage.setItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY, token);
    return;
  }
  if (token === null) {
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY);
  }
}
