import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const COOKIE_NAME = "ajs_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secretKey() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

// Create a signed session token for an admin user.
export async function createSession(user) {
  const token = await new SignJWT({ sub: user.id, email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function destroySession() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

// Returns the session payload or null. Safe to call anywhere on the server.
export async function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload;
  } catch {
    return null;
  }
}

// Throwing guard for admin API routes.
export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return session;
}
