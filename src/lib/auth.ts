import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins"
import { Pool } from "pg";
import { ac, admin, financeadmin, superadmin, user } from "./permissions";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL is required for Supabase/Neon in production
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  }),
  
  // CRITICAL: Must be the full URL to the API folder
  baseURL: process.env.BETTER_AUTH_URL, 
  
  secret: process.env.BETTER_AUTH_SECRET,
  
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    // Add all current Vercel preview/production URLs
    "https://nurul-huda-webapp-3b5qis8xl-cdr-jies-projects.vercel.app",
    "https://nurul-huda-webapp-qg0jp7qa8-cdr-jies-projects.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 
    }
  },

  plugins: [
    adminPlugin({
      ac,
      roles: { user, admin, financeadmin, superadmin },
      adminRoles: ["admin", "financeadmin", "superadmin"]
    })
  ],
});