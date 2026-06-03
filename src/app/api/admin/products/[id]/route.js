import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const PATCH = handler(async (req, { params }) => {
  await requireAdmin();
  const { id } = params;
  const b = await req.json();

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return bad("Produkt nicht gefunden", 404);

  const data = {};
  if (b.name !== undefined) data.name = b.name.trim();
  if (b.short !== undefined) data.short = b.short.trim();
  if (b.badge !== undefined) data.badge = b.badge.trim() || null;
  if (b.featured !== undefined) data.featured = !!b.featured;
  if (b.category !== undefined) {
    const cat = await prisma.category.findUnique({ where: { slug: b.category } });
    if (cat) data.categoryId = cat.id;
  }
  if (b.image !== undefined) data.image = await persistImage(b.image, existing.image);

  // If variations supplied, replace the set atomically.
  if (Array.isArray(b.variations)) {
    const variations = b.variations.filter((v) => v.label?.trim());
    await prisma.$transaction([
      prisma.variation.deleteMany({ where: { productId: id } }),
      prisma.product.update({
        where: { id },
        data: {
          ...data,
          variations: {
            create: variations.map((v, i) => ({
              ref: v.label + (v.sub ? " · " + v.sub : ""),
              label: v.label,
              sub: v.sub || "Standardausführung",
              sortOrder: i,
            })),
          },
        },
      }),
    ]);
  } else {
    await prisma.product.update({ where: { id }, data });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variations: { orderBy: { sortOrder: "asc" } }, category: true },
  });
  return ok({ product });
});

export const DELETE = handler(async (_req, { params }) => {
  await requireAdmin();
  await prisma.product.delete({ where: { id: params.id } });
  return ok({ ok: true });
});
