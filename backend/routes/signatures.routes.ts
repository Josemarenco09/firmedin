import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { SignatureCategory } from "../../src/generated/prisma/client.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { AuthRequest } from "../middleware/auth.ts";

const router = Router();
const VALID_CATEGORIES = Object.values(SignatureCategory);

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const { category } = req.query;

  const signatures = await prisma.signature.findMany({
    where: {
      userId: req.userId!,
      ...(category ? { category: category as SignatureCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(signatures);
});

router.post("/", async (req: AuthRequest, res) => {
  const { label, imageData, category, notes } = req.body ?? {};

  if (!label || !imageData) {
    return res.status(400).json({ error: "label e imageData son obligatorios" });
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category debe ser una de: ${VALID_CATEGORIES.join(", ")}` });
  }

  const signature = await prisma.signature.create({
    data: {
      label,
      imageData,
      notes: notes ?? null,
      category: category ?? SignatureCategory.OTRO,
      userId: req.userId!,
    },
  });

  res.status(201).json(signature);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const signature = await prisma.signature.findFirst({
    where: { id: String(req.params.id), userId: req.userId! },
  });

  if (!signature) {
    return res.status(404).json({ error: "Firma no encontrada" });
  }

  res.json(signature);
});

router.put("/:id", async (req: AuthRequest, res) => {
  const { label, imageData, category, notes } = req.body ?? {};

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category debe ser una de: ${VALID_CATEGORIES.join(", ")}` });
  }

  const existing = await prisma.signature.findFirst({
    where: { id: String(req.params.id), userId: req.userId! },
  });

  if (!existing) {
    return res.status(404).json({ error: "Firma no encontrada" });
  }

  const signature = await prisma.signature.update({
    where: { id: existing.id },
    data: {
      ...(label !== undefined ? { label } : {}),
      ...(imageData !== undefined ? { imageData } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  res.json(signature);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const existing = await prisma.signature.findFirst({
    where: { id: String(req.params.id), userId: req.userId! },
  });

  if (!existing) {
    return res.status(404).json({ error: "Firma no encontrada" });
  }

  await prisma.signature.delete({ where: { id: existing.id } });

  res.status(204).send();
});

export default router;