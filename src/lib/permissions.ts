import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

/**
 * User roles in the system
 */
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  FINANCE_ADMIN: "finance_admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/**
 * Permission definitions for each role
 */
export const rolePermissions = {
  [ROLES.USER]: {
    event: ["view"],
  },
  [ROLES.ADMIN]: {
    user: ["create", "list", "set-role", "ban", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
    event: ["create", "view", "share", "update", "delete"],
    finance: ["create", "view", "share", "update", "delete"],
  },
  [ROLES.FINANCE_ADMIN]: {
    user: ["create", "list", "set-role", "ban", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
    event: ["create", "view", "share", "update", "delete"],
    finance: ["view", "add"],
  },
  [ROLES.SUPER_ADMIN]: {
    user: ["create", "list", "set-role", "ban", "delete", "set-password"],
    session: ["list", "revoke", "delete"],
    event: ["create", "view", "share", "update", "delete"],
    finance: ["view", "add"],
  },
} as const;

/**
 * Get user role from Supabase auth metadata
 */
export const getUserRole = (user: User | null): UserRole => {
  if (!user) return ROLES.USER;
  return (user.user_metadata?.role as UserRole) || ROLES.USER;
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (
  user: User | null,
  resource: string,
  action: string
): boolean => {
  if (!user) return false;

  const role = getUserRole(user);
  const permissions = rolePermissions[role];

  if (!permissions || !(resource in permissions)) {
    return false;
  }

  const resourcePermissions = permissions[resource as keyof typeof permissions];
  return Array.isArray(resourcePermissions) && resourcePermissions.includes(action);
};

/**
 * Check if user has any of the specified roles
 */
export const hasRole = (
  user: User | null,
  roles: UserRole[]
): boolean => {
  if (!user) return false;
  const userRole = getUserRole(user);
  return roles.includes(userRole);
};

/**
 * Get all permissions for a user's role
 */
export const getUserPermissions = (user: User | null) => {
  if (!user) return {};
  const role = getUserRole(user);
  return rolePermissions[role];
};

/**
 * Update user role in Supabase
 * Note: This should be called from an admin context only
 */
export const updateUserRole = async (userId: string, role: UserRole) => {
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });
  if (error) throw error;
};
