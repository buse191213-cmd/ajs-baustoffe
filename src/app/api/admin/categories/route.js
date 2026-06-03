import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad, slugify } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return ok({ categories });
});

export const POST = handler(async (req) => {
  await requireAdmin();
  const b = await req.json();
  if (!b.name?.trim()) return bad("Name erforderlich");

  let slug = slugify(b.name);
  // ensure unique slug
  const clash = await prisma.category.findUnique({ where: { slug } });
  if (clash) slug = slug + "-" + Date.now().toString(36);

  const image = await persistImage(
    b.image,
    "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=1200&q=80"
  );
  const max = await prisma.category.aggregate({ _max: { sortOrder: true } });

  const category = await prisma.category.create({
    data: {
      slug,
      name: b.name.trim(),
      de: b.de?.trim() || b.name.trim(),
      tagline: b.tagline?.trim() || "Neue Kategorie im Sortiment.",
      image,
      sortOrder: (max._max.sortOrder ?? 0) + 1,
    },
  });
  return ok({ category });
});
