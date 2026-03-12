import { getRoleFromSession } from "@/features/auth/session";

export function canManageBranches() {
  return getRoleFromSession() === "BusinessAdmin";
}

export function canCrudMenu() {
  const role = getRoleFromSession();
  return role === "BranchManager" || role === "BusinessAdmin";
}
