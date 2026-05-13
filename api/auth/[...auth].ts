// api/auth/[...auth].ts
import { auth } from "../../src/lib/auth"; // Adjust path to your auth config
import { toNodeHandler } from "better-auth/node";

export default toNodeHandler(auth);