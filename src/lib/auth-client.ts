import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, user, admin, financeadmin, superadmin } from "./permissions";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_APP_URL, // Must match the baseURL in auth.ts
  plugins: [
    adminClient({
      ac,
      roles: {
        user,
        admin,
        financeadmin,
        superadmin,
      },
      adminRoles: ["admin", "financeadmin", "superadmin"],
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;