import { NextResponse } from "next/server";

export function ok(data, init) {
  return NextResponse.json(data, init);
}

export function bad(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// Wrap an async handler so thrown errors (incl. requireAdmin's 401) become
// clean JSON responses instead of 500 stack traces.
export function handler(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      const status = e?.status || 500;
      if (status === 500) console.error("[api]", e);
      return NextResponse.json(
        { error: e?.message || "Server error" },
        { status }
      );
    }
  };
}

export function slugify(s) {
  return (
    String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "kategorie-" + Date.now()
  );
}

// Map between Prisma enum and the German labels used by the UI.
export const STATUS_LABEL = {
  NEU: "Neu",
  IN_BEARBEITUNG: "In Bearbeitung",
  ANGEBOT_GESENDET: "Angebot gesendet",
  ABGESCHLOSSEN: "Abgeschlossen",
};
export const STATUS_FROM_LABEL = Object.fromEntries(
  Object.entries(STATUS_LABEL).map(([k, v]) => [v, k])
);

// Generate the next human-readable reference like "AJS-2042".
export async function nextReference(prisma) {
  const count = await prisma.quoteRequest.count();
  return "AJS-" + (2042 + count);
}
