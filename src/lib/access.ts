export type Role = "ADMIN" | "GESTOR" | "ANALISTA";

export const ROLES: Role[] = ["ADMIN", "GESTOR", "ANALISTA"];

export type ModuleKey =
  | "dashboard"
  | "contratos"
  | "agenda"
  | "permissoes"
  | "empresas"
  | "documentos"
  | "usuarios"
  | "configuracoes"
  | "propostas"
  | "relatorios"
  | "planilhas";

export type BlockKey =
  | "config.aparencia"
  | "config.notificacoes"
  | "config.conta"
  | "config.seguranca"
  | "config.gestao"
  | "config.administracao";

export type ActionKey =
  | "usuario.criar"
  | "usuario.editar"
  | "usuario.excluir"
  | "empresa.criar"
  | "empresa.editar"
  | "empresa.excluir"
  | "documento.upload"
  | "documento.aprovar"
  | "documento.reprovar"
  | "documento.comentar"
  | "proposta.criar"
  | "proposta.editar"
  | "proposta.excluir"
  | "contrato.criar"
  | "contrato.editar"
  | "contrato.excluir"
  | "permissao.criar"
  | "permissao.editar"
  | "permissao.excluir"
  | "planilha.criar"
  | "planilha.editar"
  | "planilha.excluir";

export type DocumentoStatus =
  | "PENDENTE"
  | "EM_ANALISE"
  | "APROVADO"
  | "REPROVADO"
  | "NECESSITA_CORRECAO"
  | "EXPIRADO"
  | "INVALIDO";

const MODULE_ACCESS: Record<ModuleKey, Role[]> = {
  dashboard: ["ADMIN", "GESTOR", "ANALISTA"],
  contratos: ["ADMIN", "GESTOR", "ANALISTA"],
  agenda: ["ADMIN", "GESTOR", "ANALISTA"],
  permissoes: ["ADMIN", "GESTOR"],
  empresas: ["ADMIN", "GESTOR", "ANALISTA"],
  documentos: ["ADMIN", "GESTOR", "ANALISTA"],
  usuarios: ["ADMIN", "GESTOR"],
  configuracoes: ["ADMIN", "GESTOR", "ANALISTA"],
  propostas: ["ADMIN", "GESTOR", "ANALISTA"],
  relatorios: ["ADMIN", "GESTOR"],
  planilhas: ["ADMIN", "GESTOR"],
};

const BLOCK_ACCESS: Record<BlockKey, Role[]> = {
  "config.aparencia": ["ADMIN", "GESTOR", "ANALISTA"],
  "config.notificacoes": ["ADMIN", "GESTOR", "ANALISTA"],
  "config.conta": ["ADMIN", "GESTOR", "ANALISTA"],
  "config.seguranca": ["ADMIN", "GESTOR", "ANALISTA"],
  "config.gestao": ["ADMIN", "GESTOR"],
  "config.administracao": ["ADMIN"],
};

const ACTION_ACCESS: Record<ActionKey, Role[]> = {
  "usuario.criar": ["ADMIN", "GESTOR"],
  "usuario.editar": ["ADMIN", "GESTOR"],
  "usuario.excluir": ["ADMIN"],
  "empresa.criar": ["ADMIN", "GESTOR"],
  "empresa.editar": ["ADMIN", "GESTOR"],
  "empresa.excluir": ["ADMIN"],
  "documento.upload": ["ANALISTA", "ADMIN"],
  "documento.aprovar": ["ANALISTA", "ADMIN"],
  "documento.reprovar": ["ANALISTA", "ADMIN"],
  "documento.comentar": ["ANALISTA", "ADMIN"],
  "proposta.criar": ["ADMIN", "GESTOR", "ANALISTA"],
  "proposta.editar": ["ADMIN", "GESTOR", "ANALISTA"],
  "proposta.excluir": ["ADMIN", "GESTOR"],
  "contrato.criar": ["ADMIN", "GESTOR", "ANALISTA"],
  "contrato.editar": ["ADMIN", "GESTOR", "ANALISTA"],
  "contrato.excluir": ["ADMIN", "GESTOR"],
  "permissao.criar": ["ADMIN"],
  "permissao.editar": ["ADMIN"],
  "permissao.excluir": ["ADMIN"],
  "planilha.criar": ["ADMIN", "GESTOR"],
  "planilha.editar": ["ADMIN", "GESTOR"],
  "planilha.excluir": ["ADMIN", "GESTOR"],
};

export type PermissaoCodigo =
  | "CONTRATO_CRUD"
  | "CARGO_CRUD"
  | "DOCUMENTO_JURIDICO_CRUD"
  | "CONTRATO_NIVEL_COMPLEXIDADE"
  | "PLANILHA_EDICAO_RESTRITA"
  | "REUNIAO_AGENDAMENTO"
  | "RELATORIO_CRUD"
  | "ARQUIVO_UPLOAD"
  | "ARQUIVO_DOWNLOAD"
  | "PROPOSTA_CRUD";

export const RBAC_ACTION_MAP: Partial<Record<ActionKey, PermissaoCodigo>> = {
  "planilha.criar": "PLANILHA_EDICAO_RESTRITA",
  "planilha.editar": "PLANILHA_EDICAO_RESTRITA",
  "planilha.excluir": "PLANILHA_EDICAO_RESTRITA",
  "documento.upload": "ARQUIVO_UPLOAD",
  "documento.aprovar": "DOCUMENTO_JURIDICO_CRUD",
  "documento.reprovar": "DOCUMENTO_JURIDICO_CRUD",
  "documento.comentar": "DOCUMENTO_JURIDICO_CRUD",
  "proposta.criar": "PROPOSTA_CRUD",
  "proposta.editar": "PROPOSTA_CRUD",
  "proposta.excluir": "PROPOSTA_CRUD",
  "contrato.criar": "CONTRATO_CRUD",
  "contrato.editar": "CONTRATO_CRUD",
  "contrato.excluir": "CONTRATO_CRUD",
  "permissao.criar": "CARGO_CRUD",
  "permissao.editar": "CARGO_CRUD",
  "permissao.excluir": "CARGO_CRUD",
};

export function normalizeRole(value?: string | null): Role {
  if (!value) return "ANALISTA";
  const upper = value.toUpperCase();

  if ((ROLES as string[]).includes(upper)) {
    return upper as Role;
  }

  if (upper === "MANAGER" || upper === "ADMINISTRADOR") return "GESTOR";
  if (upper === "ANALYST" || upper === "ANALISTA") return "ANALISTA";
  if (upper === "ADMIN" || upper === "ADMINISTRATOR") return "ADMIN";

  return "ANALISTA";
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

export function canPerformActionWithRbac(
  role: Role,
  action: ActionKey,
  permissoes: string[]
): boolean {
  const rbacCode = RBAC_ACTION_MAP[action];
  if (rbacCode && permissoes.length > 0) {
    return permissoes.includes(rbacCode);
  }
  return canPerformAction(role, action);
}
