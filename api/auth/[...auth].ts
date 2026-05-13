// api/auth/[...auth].ts
import { auth } from "../../src/lib/auth";
import { toNodeHandler } from "better-auth/node";

export default toNodeHandler(auth);