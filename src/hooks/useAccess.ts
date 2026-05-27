import { useMemo } from "react";

import { useRbacStore } from "@/store/useRbacStore";
import { useUserRoleStore } from "@/store/useUserRoleStore";
import {
  canAccessModule,
  canPerformActionWithRbac,
  canViewBlock,
  normalizeRole,
  type ActionKey,
  type BlockKey,
  type ModuleKey,
  type Role,
} from "@/lib/access";

export function useCurrentRole(): Role {
  const role = useUserRoleStore((state) => state.role);
  return useMemo(() => normalizeRole(role), [role]);
}

export function useCanAccess(module: ModuleKey) {
  const role = useCurrentRole();
  return canAccessModule(role, module);
}

export function useCanViewBlock(block: BlockKey) {
  const role = useCurrentRole();
  return canViewBlock(role, block);
}

export function useCanPerformAction(action: ActionKey) {
  const role = useCurrentRole();
  const permissoes = useRbacStore((state) => state.permissoes);
  return useMemo(
    () => canPerformActionWithRbac(role, action, permissoes),
    [role, action, permissoes]
  );
}
