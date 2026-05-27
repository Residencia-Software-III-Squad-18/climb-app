import {
  BarChart3,
  Building2,
  Calendar as CalendarIcon,
  ClipboardList,
  FileCheck,
  FileText,
  Home,
  Settings,
  Shield,
  TableProperties,
  Users as UsersIcon,
  type LucideIcon,
} from "lucide-react";

import type { ModuleKey, Role } from "@/lib/access";
import { canAccessModule } from "@/lib/access";

export interface NavItem {
  icon: LucideIcon;
  label: string;
  module: ModuleKey;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "Home", path: "/dashboard", module: "dashboard" },
  { icon: FileText, label: "Contratos", path: "/contratos", module: "contratos" },
  { icon: CalendarIcon, label: "Agenda", path: "/agenda", module: "agenda" },
  { icon: Shield, label: "Permissões", path: "/permissoes", module: "permissoes" },
  { icon: Building2, label: "Empresas", path: "/empresas", module: "empresas" },
  { icon: FileCheck, label: "Documentos", path: "/documentos", module: "documentos" },
  { icon: UsersIcon, label: "Usuários", path: "/usuarios", module: "usuarios" },
  { icon: ClipboardList, label: "Propostas", path: "/propostas", module: "propostas" },
  { icon: BarChart3, label: "Relatórios", path: "/relatorios", module: "relatorios" },
  { icon: TableProperties, label: "Planilhas", path: "/planilhas", module: "planilhas" },
];

export function getNavItemsForRole(role: Role) {
  return NAV_ITEMS.filter((item) => canAccessModule(role, item.module));
}
