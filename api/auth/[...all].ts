import { auth } from "../../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

// This is the magic fix for 405/Body errors on Vercel
export const config = {
  api: {
    bodyParser: false,
  },
};

export default toNodeHandler(auth);