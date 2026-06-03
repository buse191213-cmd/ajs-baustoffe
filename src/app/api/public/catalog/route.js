import { prisma } from "@/lib/prisma";
import { handler, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

// One call powers the whole public homepage.
export const GET = handler(async () => {
  const [categories, products, instagram, settings] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      include: { variations: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    prisma.instagramPost.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
  ]);

  return ok({
    categories: categories.map((c) => ({
      id: c.slug, // UI keys on slug
      name: c.name,
      de: c.de,
      tagline: c.tagline,
      image: c.image,
    })),
    products: products.map((p) => ({
      id: p.id,
      category: p.category.slug,
      name: p.name,
      short: p.short,
      image: p.image,
      badge: p.badge || undefined,
      featured: p.featured,
      variations: p.variations.map((v) => ({ ref: v.ref, label: v.label, sub: v.sub })),
    })),
    instagram: instagram.map((p) => ({
      id: p.id,
      name: p.authorName,
      image: p.image,
      video: p.video,
      videoSrc: p.videoSrc || undefined,
      caption: p.caption,
      likes: p.likes,
      comments: p.comments,
      date: new Date(p.postedAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }),
      link: p.link,
    })),
    settings: settings
      ? {
          company: {
            name: settings.companyName,
            tagline: settings.tagline,
            phone: settings.phone,
            email: settings.email,
            street: settings.street,
            zip: settings.zip,
            city: settings.city,
          },
          socials: {
            linkedin: settings.linkedin,
            instagram: settings.instagram,
            xing: settings.xing,
            youtube: settings.youtube,
          },
          heroImage: settings.heroImage,
        }
      : null,
  });
});
