// /api/auth/[...all].ts
import { auth } from "../../src/lib/auth";

export const config = { api: { bodyParser: false } };

export default auth.handler;