import {
  Building2,
  Calendar as CalendarIcon,
  FileCheck,
  FileText,
  Home,
  Settings,
  Shield,
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
  { icon: Settings, label: "Configurações", path: "/configuracoes", module: "configuracoes" },
];

export function getNavItemsForRole(role: Role) {
  return NAV_ITEMS.filter((item) => canAccessModule(role, item.module));
}
