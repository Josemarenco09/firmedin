import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.ts";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRY = "7d";

function issueToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

router.post("/register", async (req, res) => {
  const { email, password, name } = req.body ?? {};

  if (!email || !password || !name) {
    return res.status(400).json({ error: "email, password y name son obligatorios" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese email" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, name, passwordHash },
  });

  const token = issueToken(user.id);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "email y password son obligatorios" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = issueToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export default router;
