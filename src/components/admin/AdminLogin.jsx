"use client";
import React from "react";
import { motion, SPRING, Icon, PrimaryButton } from "@/components/ui";
import { api } from "@/lib/client";

export function AdminLogin({ onAuth }) {
  const [email, setEmail] = React.useState("");
  const [pw, setPw] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    if (!email || !pw) { setErr("Bitte E-Mail und Passwort eingeben."); return; }
    setBusy(true); setErr("");
    try {
      await api.post("/api/auth/login", { email, password: pw });
      onAuth();
    } catch (e) {
      setErr(e.message || "Anmeldung fehlgeschlagen.");
      setBusy(false);
    }
  };

  const inWrap = "flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 focus-within:border-[#111827]";
  const inCls = "w-full bg-transparent py-3 text-[13.5px] tracking-wide text-[#111827] outline-none placeholder:text-neutral-300";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-6">
      <motion.div initial={{ opacity: 0, y: 18, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={SPRING} className="w-full max-w-[400px] rounded-[26px] border border-neutral-200 bg-white p-8 shadow-[0_24px_60px_-30px_rgba(17,24,39,0.25)]">
        <div className="flex items-center gap-3">
          <img src="/assets/ajs-logo-dark.png" alt="AJS Baustoffe" className="h-9 w-auto" />
          <span className="h-7 w-px bg-neutral-200" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Backoffice</span>
        </div>
        <h2 className="mt-7 text-[22px] font-bold tracking-[-0.02em] text-[#111827]">Willkommen zurück</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">Melden Sie sich an, um den Katalog und Anfragen zu verwalten.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">E-Mail</label>
            <div className={inWrap}>
              <Icon.user className="h-[18px] w-[18px] text-neutral-400" />
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }} className={inCls} placeholder="name@firma.de" autoFocus />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Passwort</label>
            <div className={inWrap}>
              <Icon.lock className="h-[18px] w-[18px] text-neutral-400" />
              <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} className={inCls} placeholder="••••••••" />
            </div>
          </div>
          {err && <p className="text-[12px] font-medium text-red-500">{err}</p>}
          <PrimaryButton full type="submit" className="!py-3.5" disabled={busy}>
            {busy ? "Anmelden …" : "Anmelden"}
            {!busy && <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </PrimaryButton>
        </form>
        <div className="mt-5 flex items-center justify-end">
          <a href="/" className="text-[12px] font-medium tracking-wide text-neutral-400 transition-colors hover:text-[#111827]">Zurück zur Website</a>
        </div>
      </motion.div>
    </motion.div>
  );
}
