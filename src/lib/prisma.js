import { PrismaClient } from "@prisma/client";

// Lazily instantiate PrismaClient on first use. This avoids creating a client
// (and requiring the native query engine) at module-eval time, which would
// otherwise run during Next's build-time "collecting page data" step.
const globalForPrisma = globalThis;

function getClient() {
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.__prisma;
}

// A proxy that forwards every access to the real client, created on demand.
export const prisma = new Proxy(
  {},
  {
    get(_t, prop) {
      const client = getClient();
      const value = client[prop];
      return typeof value === "function" ? value.bind(client) : value;
    },
  }
);
