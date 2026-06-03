import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad, STATUS_FROM_LABEL, STATUS_LABEL } from "@/lib/api";

// :id here is the human reference (e.g. AJS-2041), matching the UI.
export const PATCH = handler(async (req, { params }) => {
  await requireAdmin();
  const b = await req.json();
  const data = {};
  if (b.status !== undefined) {
    const enumVal = STATUS_FROM_LABEL[b.status];
    if (!enumVal) return bad("Ungültiger Status");
    data.status = enumVal;
  }
  const updated = await prisma.quoteRequest.update({
    where: { reference: params.id },
    data,
  });
  return ok({ status: STATUS_LABEL[updated.status] });
});

export const DELETE = handler(async (_req, { params }) => {
  await requireAdmin();
  await prisma.quoteRequest.delete({ where: { reference: params.id } });
  return ok({ ok: true });
});
