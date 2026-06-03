import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireAdmin();
  const [openCount, productCount, categoryCount, quotesByCat] = await Promise.all([
    prisma.quoteRequest.count({ where: { status: "NEU" } }),
    prisma.product.count(),
    prisma.category.count(),
    // Top categories by number of quote lines whose product name matches.
    prisma.quoteRequest.findMany({ include: { lines: true } }),
  ]);

  // Derive a simple "share of requests" per category from line product names.
  const products = await prisma.product.findMany({ include: { category: true } });
  const nameToCat = Object.fromEntries(products.map((p) => [p.name, p.category.name]));
  const counts = {};
  let total = 0;
  for (const q of quotesByCat) {
    for (const l of q.lines) {
      const cat = nameToCat[l.name];
      if (!cat) continue;
      counts[cat] = (counts[cat] || 0) + 1;
      total++;
    }
  }
  const topCats = Object.entries(counts)
    .map(([l, n]) => ({ l, v: total ? Math.round((n / total) * 100) : 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 4);

  // Revenue series is illustrative — replace with real order data when available.
  const revenue = [
    { m: "Jan", v: 62 }, { m: "Feb", v: 71 }, { m: "Mär", v: 58 },
    { m: "Apr", v: 84 }, { m: "Mai", v: 96 }, { m: "Jun", v: 88 },
    { m: "Jul", v: 104 }, { m: "Aug", v: 92 }, { m: "Sep", v: 118 },
  ];

  return ok({ openCount, productCount, categoryCount, topCats, revenue });
});
