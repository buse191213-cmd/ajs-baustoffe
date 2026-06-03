import { getSession } from "@/lib/auth";
import { handler, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  const session = await getSession();
  if (!session) return ok({ user: null });
  return ok({ user: { email: session.email, name: session.name } });
});
