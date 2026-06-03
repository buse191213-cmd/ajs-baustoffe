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

// Accepts multipart/form-data with a single "file" field, stores it under
// /public/uploads, and returns its public path. Used by the admin forms for
// direct video/image uploads (base64 is impractical for large videos).
export const POST = handler(async (req) => {
  await requireAdmin();

  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return bad("Keine Datei empfangen");

  const ext = ALLOWED[file.type];
  if (!ext) return bad("Dateityp nicht erlaubt (nur MP4, WebM, MOV, JPG, PNG, WebP, GIF)");

  // Guard size: 100 MB cap.
  const maxBytes = 200 * 1024 * 1024;
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length > maxBytes) return bad("Datei zu groß (max. 200 MB)");

  const name = crypto.randomBytes(8).toString("hex") + "." + ext;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);

  return ok({ url: "/uploads/" + name });
});
