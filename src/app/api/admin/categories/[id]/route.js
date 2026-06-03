import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const PATCH = handler(async (req, { params }) => {
  await requireAdmin();
  const b = await req.json();
  const existing = await prisma.category.findUnique({ where: { id: params.id } });
  if (!existing) return bad("Kategorie nicht gefunden", 404);

  const data = {};
  if (b.name !== undefined) data.name = b.name.trim();
  if (b.de !== undefined) data.de = b.de.trim();
  if (b.tagline !== undefined) data.tagline = b.tagline.trim();
  if (b.image !== undefined) data.image = await persistImage(b.image, existing.image);

  const category = await prisma.category.update({ where: { id: params.id }, data });
  return ok({ category });
});

export const DELETE = handler(async (_req, { params }) => {
  await requireAdmin();
  // Products in this category are cascade-deleted by the schema relation.
  await prisma.category.delete({ where: { id: params.id } });
  return ok({ ok: true });
});
