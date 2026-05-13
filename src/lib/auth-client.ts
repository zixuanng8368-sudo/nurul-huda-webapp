import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, user, admin, financeadmin, superadmin } from "./permissions";

const getBaseURL = () => {
  // If we are in production (on Vercel), use the relative path /api/auth
  // If we are in development, use the local dev server
  if (import.meta.env.PROD) {
    return "https://nurul-huda-webapp-qg0jp7qa8-cdr-jies-projects.vercel.app";
  }
  return "http://localhost:3001"; // Or whatever your local port is
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