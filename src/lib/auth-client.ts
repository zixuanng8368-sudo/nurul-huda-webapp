import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, user, admin, financeadmin, superadmin } from "./permissions";

const getBaseURL = () => {
  if (import.meta.env.PROD) {
    // This ensures it always talks to the CURRENT deployment, 
    // not a hardcoded old one.
    return window.location.origin; 
  }
  return "http://localhost:3001";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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