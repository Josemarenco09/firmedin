import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.ts";
import signatureRoutes from "./routes/signatures.routes.ts";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/signatures", signatureRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as { status?: number }).status;
  if (status && status >= 400 && status < 500) {
    return res.status(status).json({ error: "Petición inválida" });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

export default app;
