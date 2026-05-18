import { supabase } from "../supabaseClient";
import type { User } from "@supabase/supabase-js";

/**
 * User roles in the system
 */
export const statement = {
  ...defaultStatements,
  // the defaultStatements permissions
  // user: create list set-role ban impersonate impersonate-admins delete set-password
  // session: list revoke delete
  // Add new permissions below (event)
  admin: ["view"],
  event: ["create", "view", "share", "update", "delete"],
  finance: ["view", "add"]
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  ...userAc.statements,
  event: ["create", "view", "share"],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  admin: ["view"],
  event: ["create", "view", "share", "update", "delete"],
});

// The superAdmin will have the same permission as the admin for now
export const superadmin = ac.newRole({
  ...adminAc.statements,
  admin: ["view"],
  event: ["create", "view", "share", "update", "delete"],
  finance: ["view", "add"]
});

// The financeAdmin will have the same permission as the admin and addition permission to access finance add and view
export const financeadmin = ac.newRole({
    ...adminAc.statements,
    admin: ["view"],
    finance: ["view", "add"]
})
