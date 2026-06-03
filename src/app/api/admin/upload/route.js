import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { requireAdmin } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";

export const dynamic = "force-dynamic";
// Allow larger bodies for video uploads.
export const maxDuration = 60;

const ALLOWED = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

// Accepts multipart/form-data with a single "file" field.
//
// Storage strategy:
//  - In production (Vercel), files are stored in Vercel Blob — durable and
//    served from a global CDN, survives every redeploy.
//  - In local development (no Blob token), files are written to /public/uploads
//    so you can keep working on your machine without any cloud setup.
export const POST = handler(async (req) => {
  await requireAdmin();

  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return bad("Keine Datei empfangen");

  const ext = ALLOWED[file.type];
  if (!ext) return bad("Dateityp nicht erlaubt (nur MP4, WebM, MOV, JPG, PNG, WebP, GIF)");

  // Size guard: 200 MB.
  const maxBytes = 200 * 1024 * 1024;
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > maxBytes) return bad("Datei zu groß (max. 200 MB)");

  const name = crypto.randomBytes(8).toString("hex") + "." + ext;

  // Use Vercel Blob when a token is configured (i.e. on Vercel).
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put("uploads/" + name, buf, {
      access: "public",
      contentType: file.type,
    });
    return ok({ url: blob.url });
  }

  // Fallback for local development: write to /public/uploads.
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);
  return ok({ url: "/uploads/" + name });
});
