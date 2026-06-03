import { destroySession } from "@/lib/auth";
import { handler, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export const POST = handler(async () => {
  destroySession();
  return ok({ ok: true });
});
