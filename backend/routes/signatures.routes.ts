import { Router } from "express";
import type { Response, NextFunction } from "express";
import multer from "multer";
import prisma from "../lib/prisma.ts";
import { uploadImage, deleteImage } from "../lib/cloudinary.ts";
import { SignatureCategory } from "../../src/generated/prisma/client.ts";
import { requireAuth } from "../middleware/auth.ts";
import type { AuthRequest } from "../middleware/auth.ts";

const router = Router();
const VALID_CATEGORIES = Object.values(SignatureCategory);
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

function handleUpload(req: AuthRequest, res: Response, next: NextFunction) {
  upload.single("image")(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const msg = err.code === "LIMIT_FILE_SIZE" ? "La imagen supera 5 MB" : err.message;
      return res.status(400).json({ error: msg });
    }
    if (err) return next(err);
    next();
  });
}

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

router.post("/", handleUpload, async (req: AuthRequest, res) => {
  const { label, category, notes } = req.body ?? {};

  if (!label || !req.file) {
    return res.status(400).json({ error: "label e image son obligatorios" });
  }

  if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "La imagen debe ser PNG, JPG o WEBP" });
  }

  if (category && !VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category debe ser una de: ${VALID_CATEGORIES.join(", ")}` });
  }

  const { url, publicId } = await uploadImage(req.file.buffer, req.userId!);

  const signature = await prisma.signature.create({
    data: {
      label,
      imageData: url,
      imagePublicId: publicId,
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
  const { label, category, notes } = req.body ?? {};

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

  if (existing.imagePublicId) {
    await deleteImage(existing.imagePublicId).catch(() => {});
  }

  res.status(204).send();
});

export default router;