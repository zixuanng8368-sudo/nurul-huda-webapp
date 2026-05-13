// api/auth/[...auth].ts
import { auth } from "./better-auth"; // No more ../../src/lib/
import { toNodeHandler } from "better-auth/node";

export default toNodeHandler(auth);