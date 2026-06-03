import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { handler, ok, bad } from "@/lib/api";

export const dynamic = "force-dynamic";

export const POST = handler(async (req) => {
  const { email, password } = await req.json();
  if (!email || !password) return bad("E-Mail und Passwort erforderlich");

  const user = await prisma.adminUser.findUnique({ where: { email: String(email).toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return bad("Ungültige Anmeldedaten", 401);
  }

  await createSession(user);
  return ok({ user: { email: user.email, name: user.name } });
});
