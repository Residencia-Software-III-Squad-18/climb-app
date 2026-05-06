export type Role = "ADMIN" | "GESTOR" | "ANALISTA" | "CLIENTE";

export const ROLES: Role[] = ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"];

export type ModuleKey =
  | "dashboard"
  | "contratos"
  | "agenda"
  | "permissoes"
  | "empresas"
  | "documentos"
  | "usuarios"
  | "configuracoes";

export type BlockKey =
  | "config.aparencia"
  | "config.notificacoes"
  | "config.conta"
  | "config.seguranca"
  | "config.gestao"
  | "config.administracao";

export type ActionKey = "usuario.criar" | "usuario.editar" | "empresa.criar" | "empresa.editar";

const MODULE_ACCESS: Record<ModuleKey, Role[]> = {
  dashboard: ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
  contratos: ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
  agenda: ["ADMIN", "GESTOR", "ANALISTA"],
  permissoes: ["ADMIN", "GESTOR"],
  empresas: ["ADMIN", "GESTOR", "ANALISTA"],
  documentos: ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
  usuarios: ["ADMIN", "GESTOR"],
  configuracoes: ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
};

const BLOCK_ACCESS: Record<BlockKey, Role[]> = {
  "config.aparencia": ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
  "config.notificacoes": ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
  "config.conta": ["ADMIN", "GESTOR", "ANALISTA", "CLIENTE"],
  "config.seguranca": ["ADMIN", "GESTOR", "ANALISTA"],
  "config.gestao": ["ADMIN", "GESTOR"],
  "config.administracao": ["ADMIN"],
};

const ACTION_ACCESS: Record<ActionKey, Role[]> = {
  "usuario.criar": ["ADMIN", "GESTOR"],
  "usuario.editar": ["ADMIN", "GESTOR"],
  "empresa.criar": ["ADMIN", "GESTOR"],
  "empresa.editar": ["ADMIN", "GESTOR"],
};

export function normalizeRole(value?: string | null): Role {
  if (!value) return "CLIENTE";
  const upper = value.toUpperCase();

  if ((ROLES as string[]).includes(upper)) {
    return upper as Role;
  }

  if (upper === "MANAGER") return "GESTOR";
  if (upper === "ANALYST") return "ANALISTA";
  if (upper === "CLIENT" || upper === "USER") return "CLIENTE";

  return "CLIENTE";
}

export function canAccessModule(role: Role, module: ModuleKey) {
  return MODULE_ACCESS[module]?.includes(role) ?? false;
}

export function canViewBlock(role: Role, block: BlockKey) {
  return BLOCK_ACCESS[block]?.includes(role) ?? false;
}

export function canPerformAction(role: Role, action: ActionKey) {
  return ACTION_ACCESS[action]?.includes(role) ?? false;
}
