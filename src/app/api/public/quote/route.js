import { prisma } from "@/lib/prisma";
import { handler, ok, bad, nextReference } from "@/lib/api";
import { sendQuoteNotification } from "@/lib/mail";
import { z } from "zod";

const schema = z.object({
  contactName: z.string().min(1, "Name erforderlich"),
  contactEmail: z.string().email("Gültige E-Mail erforderlich"),
  contactPhone: z.string().optional(),
  company: z.string().optional(),
  city: z.string().optional(),
  note: z.string().optional(),
  lines: z
    .array(
      z.object({
        name: z.string().min(1),
        variation: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1, "Mindestens eine Position erforderlich"),
});

export const POST = handler(async (req) => {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return bad(parsed.error.issues[0].message);
  const d = parsed.data;

  const reference = await nextReference(prisma);
  const quote = await prisma.quoteRequest.create({
    data: {
      reference,
      company: d.company || null,
      contactName: d.contactName,
      contactPhone: d.contactPhone || null,
      contactEmail: d.contactEmail,
      city: d.city || null,
      note: d.note || null,
      lines: { create: d.lines.map((l) => ({ name: l.name, variation: l.variation, qty: l.qty })) },
    },
    include: { lines: true },
  });

  // Fire-and-forget notification; failures are logged, not surfaced.
  await sendQuoteNotification(quote);

  return ok({ reference: quote.reference });
});
