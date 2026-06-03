import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, STATUS_LABEL } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireAdmin();
  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { lines: true },
  });
  return ok({
    quotes: quotes.map((q) => ({
      id: q.reference,
      _id: q.id,
      company: q.company || q.contactName,
      items: q.lines.length,
      status: STATUS_LABEL[q.status],
      date: new Date(q.createdAt).toLocaleDateString("de-DE"),
      city: q.city || "",
      contact: {
        name: q.contactName,
        role: q.contactRole || "",
        phone: q.contactPhone || "",
        email: q.contactEmail,
      },
      note: q.note || "",
      lines: q.lines.map((l) => ({ name: l.name, variation: l.variation, qty: l.qty })),
    })),
  });
});
