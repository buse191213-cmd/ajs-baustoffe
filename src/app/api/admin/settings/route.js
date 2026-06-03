import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireAdmin();
  const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return ok({ settings: s });
});

export const PUT = handler(async (req) => {
  await requireAdmin();
  const b = await req.json();
  const c = b.company || {};
  const soc = b.socials || {};

  const current = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const heroImage = await persistImage(b.heroImage, current?.heroImage);

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      companyName: c.name, tagline: c.tagline, phone: c.phone, email: c.email,
      street: c.street, zip: c.zip, city: c.city,
      linkedin: soc.linkedin || "", instagram: soc.instagram || "",
      xing: soc.xing || "", youtube: soc.youtube || "", heroImage,
    },
    create: {
      id: "singleton",
      companyName: c.name || "AJS Baustoffe", tagline: c.tagline || "", phone: c.phone || "",
      email: c.email || "", street: c.street || "", zip: c.zip || "", city: c.city || "",
      linkedin: soc.linkedin || "", instagram: soc.instagram || "",
      xing: soc.xing || "", youtube: soc.youtube || "", heroImage: heroImage || "",
    },
  });
  return ok({ settings });
});
