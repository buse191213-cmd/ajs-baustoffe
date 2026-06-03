import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

// Accepts either an http(s) URL (kept as-is) or a data: URL (decoded and saved
// to /public/uploads, returning the public path). This lets the admin forms
// keep using <input type=file> → FileReader.readAsDataURL on the client.
//
// NOTE: For production at scale, swap this for object storage (S3/R2). On
// Vercel the filesystem is ephemeral, so configure a persistent volume or use
// blob storage. For a single small VPS this is fine.
export async function persistImage(input, fallback) {
  if (!input) return fallback;
  if (typeof input !== "string") return fallback;
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  if (input.startsWith("/uploads/")) return input; // already stored

  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(input);
  if (!m) return fallback;

  const [, mime, b64] = m;
  const ext = mime.split("/")[1].replace("jpeg", "jpg").replace("+xml", "");
  const buf = Buffer.from(b64, "base64");
  const name = crypto.randomBytes(8).toString("hex") + "." + ext;

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buf);
  return "/uploads/" + name;
}
