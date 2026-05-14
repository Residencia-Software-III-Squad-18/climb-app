import { api } from "@/api";

export interface RbacProfile {
  usuarioId: number;
  nomeUsuario: string;
  nomeCargo: string;
  permissoesEfetivas: string[];
}

export async function fetchRbacProfile(usuarioId: number): Promise<RbacProfile> {
  const response = await api.get<RbacProfile>(`/rbac/usuario/${usuarioId}/perfil`);
  return response.data;
}
