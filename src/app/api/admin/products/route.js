import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { variations: { orderBy: { sortOrder: "asc" } }, category: true },
  });
  return ok({ products });
});

export const POST = handler(async (req) => {
  await requireAdmin();
  const b = await req.json();
  if (!b.name?.trim()) return bad("Name erforderlich");

  // category arrives as slug from the UI
  const category = await prisma.category.findUnique({ where: { slug: b.category } });
  if (!category) return bad("Kategorie nicht gefunden");

  const variations = (b.variations || []).filter((v) => v.label?.trim());
  if (variations.length === 0) return bad("Mindestens eine Variante erforderlich");

  const image = await persistImage(b.image, category.image);
  const max = await prisma.product.aggregate({ _max: { sortOrder: true } });

  const product = await prisma.product.create({
    data: {
      name: b.name.trim(),
      short: b.short?.trim() || "Neues Produkt im AJS-Sortiment.",
      image,
      badge: b.badge !== undefined ? (b.badge.trim() || null) : "Neu",
      featured: !!b.featured,
      categoryId: category.id,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
      variations: {
        create: variations.map((v, i) => ({
          ref: v.label + (v.sub ? " · " + v.sub : ""),
          label: v.label,
          sub: v.sub || "Standardausführung",
          sortOrder: i,
        })),
      },
    },
    include: { variations: true, category: true },
  });
  return ok({ product });
});
