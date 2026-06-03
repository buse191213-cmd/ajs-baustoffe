import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireAdmin();
  const posts = await prisma.instagramPost.findMany({ orderBy: { sortOrder: "asc" } });
  return ok({ posts });
});

export const POST = handler(async (req) => {
  await requireAdmin();
  const b = await req.json();
  if (!b.caption?.trim()) return bad("Bildunterschrift erforderlich");

  const image = await persistImage(
    b.image,
    "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=1200&q=80"
  );
  const min = await prisma.instagramPost.aggregate({ _min: { sortOrder: true } });

  const post = await prisma.instagramPost.create({
    data: {
      authorName: b.name?.trim() || "AJS Baustoffe",
      caption: b.caption.trim(),
      link: b.link?.trim() || "https://www.instagram.com/",
      video: !!b.video,
      videoSrc: b.video ? b.videoSrc?.trim() || null : null,
      image,
      likes: Math.floor(40 + Math.random() * 260),
      comments: Math.floor(2 + Math.random() * 30),
      sortOrder: (min._min.sortOrder ?? 0) - 1, // newest first
    },
  });
  return ok({ post });
});
