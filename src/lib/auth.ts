import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins"
import { Pool } from "pg";
import { ac, admin, financeadmin, superadmin, user } from "./permissions";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL for Supabase production connections
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  }),
  baseURL: process.env.BETTER_AUTH_URL, 
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    "http://localhost:5173",
    "https://nurul-huda-webapp-3b5qis8xl-cdr-jies-projects.vercel.app", // Add your Vercel URL
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days
    updateAge: 60 * 60 * 24, // 1 days
    cookieCache: {
      enabled: true,
      maxAge: 60 // 10 seconds
    }
  },
  socialProviders: {
    
  },
  plugins:[adminPlugin({
    ac,
    roles: { user, admin, financeadmin, superadmin },
    adminRoles: ["admin", "financeadmin", "superadmin"]
  }
  )],
});
