/**
 * Gerencia a alocação de empresas por analista (frontend-only via localStorage).
 * Chave: "carteira:<usuarioId>" → array de empresaIds alocados.
 */

const PREFIX = "carteira:";

function getKey(usuarioId: number) {
  return `${PREFIX}${usuarioId}`;
}

export function getCarteira(usuarioId: number): number[] {
  try {
    const raw = localStorage.getItem(getKey(usuarioId));
    return raw ? (JSON.parse(raw) as number[]) : [];
  } catch {
    return [];
  }
}

export function setCarteira(usuarioId: number, empresaIds: number[]): void {
  localStorage.setItem(getKey(usuarioId), JSON.stringify(empresaIds));
}

export function addEmpresaToCarteira(usuarioId: number, empresaId: number): void {
  const current = getCarteira(usuarioId);
  if (!current.includes(empresaId)) {
    setCarteira(usuarioId, [...current, empresaId]);
  }
}

export function removeEmpresaFromCarteira(usuarioId: number, empresaId: number): void {
  const current = getCarteira(usuarioId);
  setCarteira(usuarioId, current.filter((id) => id !== empresaId));
}

export function getAllCarteiraMap(): Record<number, number[]> {
  const map: Record<number, number[]> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) {
      const usuarioId = Number(key.slice(PREFIX.length));
      if (!isNaN(usuarioId)) {
        map[usuarioId] = getCarteira(usuarioId);
      }
    }
  }
  return map;
}
