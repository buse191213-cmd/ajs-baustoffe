import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";
import { persistImage } from "@/lib/upload";

export const PATCH = handler(async (req, { params }) => {
  await requireAdmin();
  const b = await req.json();
  const existing = await prisma.instagramPost.findUnique({ where: { id: params.id } });
  if (!existing) return bad("Beitrag nicht gefunden", 404);

  const data = {};
  if (b.name !== undefined) data.authorName = b.name.trim() || "AJS Baustoffe";
  if (b.caption !== undefined) data.caption = b.caption.trim();
  if (b.link !== undefined) data.link = b.link.trim() || "https://www.instagram.com/";
  if (b.video !== undefined) data.video = !!b.video;
  if (b.videoSrc !== undefined) data.videoSrc = b.video ? (b.videoSrc?.trim() || null) : null;
  if (b.image !== undefined) data.image = await persistImage(b.image, existing.image);

  const post = await prisma.instagramPost.update({ where: { id: params.id }, data });
  return ok({ post });
});

export const DELETE = handler(async (_req, { params }) => {
  await requireAdmin();
  await prisma.instagramPost.delete({ where: { id: params.id } });
  return ok({ ok: true });
});
