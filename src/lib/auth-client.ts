import { createAuthClient } from "better-auth/react";

import { adminClient } from "better-auth/client/plugins";

import { ac, user, admin, financeadmin, superadmin } from "./permissions";

const getBaseURL = () => {
  // If we are on Vercel, use the Vercel URL, otherwise use localhost
  if (import.meta.env.VITE_AUTH_URL) return import.meta.env.VITE_AUTH_URL;
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
