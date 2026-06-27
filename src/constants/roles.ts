/**
 * Mirrors the backend `Role` enum (src/common/enums/role.enum.ts). Keep in sync.
 * Using a const object (not TS `enum`) for tree-shakeable, literal-typed values.
 */
export const Role = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  CUSTOMER_SUPPORT: "CUSTOMER_SUPPORT",
  MARKETING_MANAGER: "MARKETING_MANAGER",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/** Roles that may access the admin panel at all (further gated per-section). */
export const STAFF_ROLES: readonly Role[] = [
  Role.ADMIN,
  Role.INVENTORY_MANAGER,
  Role.CUSTOMER_SUPPORT,
  Role.MARKETING_MANAGER,
];

export const ROLE_LABELS: Record<Role, string> = {
  CUSTOMER: "Customer",
  ADMIN: "Administrator",
  INVENTORY_MANAGER: "Inventory Manager",
  CUSTOMER_SUPPORT: "Customer Support",
  MARKETING_MANAGER: "Marketing Manager",
};

export function isStaff(roles: readonly Role[] | undefined | null): boolean {
  if (!roles) return false;
  return roles.some((r) => STAFF_ROLES.includes(r));
}

export function hasRole(roles: readonly Role[] | undefined | null, ...required: Role[]): boolean {
  if (!roles) return false;
  return required.some((r) => roles.includes(r));
}
