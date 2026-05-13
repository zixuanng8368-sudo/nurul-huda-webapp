import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins"
import { Pool } from "pg";
import { ac, admin, financeadmin, superadmin, user } from "./permissions";

// Log that auth is initializing
console.log("[AUTH] Initializing with DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Not set");
console.log("[AUTH] BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET ? "✓ Set" : "✗ Not set");
console.log("[AUTH] BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL || "using default");

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // SSL is required for Supabase/Neon in production
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  }),
  
  // CRITICAL: Must be the full URL to the API folder
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001/api/auth",
  
  secret: process.env.BETTER_AUTH_SECRET,
  
  trustedOrigins: [
    'https://nurul-huda-webapp-one.vercel.app',
    'http://localhost:5173', // for local dev
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