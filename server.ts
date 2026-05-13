import "dotenv/config";
import express from "express";
import { auth } from "./src/lib/auth";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

// AUTH ROUTES (BEFORE body parser)
app.all("/api/auth/*", toNodeHandler(auth));

// JSON middleware
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});