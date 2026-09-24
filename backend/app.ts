import express from "express";
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

export default app;
