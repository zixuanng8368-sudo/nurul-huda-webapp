import { auth } from "../../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

/**
 * The [...all].ts filename is a "catch-all" segment.
 * It ensures that GET /api/auth/get-session 
 * and POST /api/auth/sign-in/email
 * are all handled by this one function.
 */
export default toNodeHandler(auth);