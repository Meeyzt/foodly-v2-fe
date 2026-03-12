export type UserRole = "Customer" | "Staff" | "BranchManager" | "BusinessAdmin";

export const allRoles: UserRole[] = ["Customer", "Staff", "BranchManager", "BusinessAdmin"];

export const roleHome: Record<UserRole, string> = {
  Customer: "/customer/explore",
  Staff: "/staff/scan",
  BranchManager: "/manager/menu",
  BusinessAdmin: "/manager/branches",
};

export const routeRoleMap: Array<{ prefix: string; roles: UserRole[] }> = [
  { prefix: "/customer", roles: ["Customer"] },
  { prefix: "/staff", roles: ["Staff"] },
  { prefix: "/manager", roles: ["BranchManager", "BusinessAdmin"] },
];

export function canAccessPath(pathname: string, role?: UserRole): boolean {
  const matched = routeRoleMap.find((item) => pathname.startsWith(item.prefix));
  if (!matched) return true;
  if (!role) return false;
  return matched.roles.includes(role);
}
