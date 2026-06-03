"use client";
import React from "react";
import { api } from "@/lib/client";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminPage() {
  const [user, setUser] = React.useState(undefined); // undefined = loading

  const refresh = React.useCallback(() => {
    api.get("/api/auth/me").then((d) => setUser(d.user)).catch(() => setUser(null));
  }, []);
  React.useEffect(() => { refresh(); }, [refresh]);

  if (user === undefined) {
    return <div className="flex min-h-screen items-center justify-center text-[13px] text-neutral-400">Lädt …</div>;
  }
  if (!user) {
    return <AdminLogin onAuth={refresh} />;
  }
  return <AdminPanel user={user} onLogout={() => { api.post("/api/auth/logout").finally(() => setUser(null)); }} />;
}
