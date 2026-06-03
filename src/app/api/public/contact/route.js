import { prisma } from "@/lib/prisma";
import { handler, ok, bad } from "@/lib/api";
import { sendContactNotification } from "@/lib/mail";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name erforderlich"),
  email: z.string().email("Gültige E-Mail erforderlich"),
  firma: z.string().optional(),
  message: z.string().min(1, "Nachricht erforderlich"),
});

export const POST = handler(async (req) => {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return bad(parsed.error.issues[0].message);
  const d = parsed.data;

  const msg = await prisma.contactMessage.create({
    data: { name: d.name, email: d.email, firma: d.firma || null, message: d.message },
  });
  await sendContactNotification(msg);
  return ok({ ok: true });
});
