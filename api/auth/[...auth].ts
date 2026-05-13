// api/auth/[...auth].ts
import { auth } from "../../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

// Vercel specific: disable the default body parser so better-auth can read the raw stream
export const config = {
  api: {
    bodyParser: false,
  },
};

export default toNodeHandler(auth);