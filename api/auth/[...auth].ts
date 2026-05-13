// api/auth/[...auth].ts
import { auth } from "../../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

// CRITICAL: Disable Vercel's automatic body parsing so better-auth can read the raw stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default toNodeHandler(auth);