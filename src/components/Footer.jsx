"use client";
import React from "react";
import { motion, AnimatePresence, SPRING, Logo, Icon, PrimaryButton } from "./ui";
import { api } from "@/lib/client";

export function Footer({ settings, onExplore }) {
  const c = (settings && settings.company) || {};
  const s = (settings && settings.socials) || {};
  const socials = [
    { id: "linkedin", label: "LinkedIn", href: s.linkedin },
    { id: "instagram", label: "Instagram", href: s.instagram },
    { id: "xing", label: "Xing", href: s.xing },
    { id: "youtube", label: "YouTube", href: s.youtube },
  ].filter((x) => x.href);
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-10 border-t border-neutral-100 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[320px] text-[13px] leading-relaxed text-neutral-500">{c.tagline}</p>
            <div className="mt-6"><PrimaryButton onClick={onExplore}>Katalog ansehen<Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" /></PrimaryButton></div>
            <div className="mt-7 flex items-center gap-2.5">
              {socials.map((it) => (
                <motion.a key={it.id} href={it.href} target="_blank" rel="noopener noreferrer" aria-label={it.label} title={it.label} whileHover={{ y: -3 }} whileTap={{ scale: 0.92 }} transition={SPRING} className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition-colors hover:border-[#111827] hover:bg-[#111827] hover:text-white">
                  {Icon[it.id]({ className: "h-[18px] w-[18px]" })}
                </motion.a>
              ))}
            </div>
          </div>
          <FootCol title="Sortiment" links={["Trockenbau", "Dämmstoffe", "Putz & Fassade", "Werkzeuge"]} />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111827]">Kontakt</p>
            <ul className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-neutral-500">
              {(c.street || c.city) && (<li>{c.street}{c.street && <br />}{c.zip} {c.city}</li>)}
              {c.phone && (<li><a href={"tel:" + c.phone.replace(/\s/g, "")} className="transition-colors hover:text-[#111827]">{c.phone}</a></li>)}
              {c.email && (<li><a href={"mailto:" + c.email} className="transition-colors hover:text-[#111827]">{c.email}</a></li>)}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-100 py-7 sm:flex-row">
          <p className="text-[11px] tracking-wide text-neutral-400">© {new Date().getFullYear()} {c.name || "AJS Baustoffe"}</p>
          <div className="flex items-center gap-5">
            <a href="/impressum" className="text-[11px] tracking-wide text-neutral-400 hover:text-[#111827]">Impressum</a>
            <a href="/datenschutz" className="text-[11px] tracking-wide text-neutral-400 hover:text-[#111827]">Datenschutz</a>
            <a href="/admin" className="rounded-full border border-neutral-200 px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#111827] hover:border-neutral-400">Admin-Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FootCol({ title, links }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111827]">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (<li key={l}><span className="text-[13px] tracking-wide text-neutral-500">{l}</span></li>))}
      </ul>
    </div>
  );
}

export function TrustStrip() {
  const items = [
    { n: "24 Std", l: "Angebot per E-Mail" },
    { n: "2.400+", l: "Artikel ab Lager" },
    { n: "3", l: "Standorte in Bayern" },
    { n: "1998", l: "Familienbetrieb seit" },
  ];
  return (
    <section className="border-y border-neutral-100 bg-white">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-px px-6 lg:grid-cols-4 lg:px-10">
        {items.map((it, i) => (
          <motion.div key={it.l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: i * 0.06 }} className="py-9 pr-4">
            <p className="text-[28px] font-bold tracking-[-0.02em] text-[#111827]">{it.n}</p>
            <p className="mt-1 text-[12px] tracking-wide text-neutral-400">{it.l}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function ContactSection({ settings, onToast }) {
  const c = (settings && settings.company) || {};
  const [form, setForm] = React.useState({ name: "", email: "", firma: "", message: "" });
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const valid = form.name.trim() && form.email.trim() && form.message.trim();

  const send = async (e) => {
    e && e.preventDefault();
    if (!valid || busy) return;
    setBusy(true); setError("");
    try {
      await api.post("/api/public/contact", form);
      setSent(true);
      setForm({ name: "", email: "", firma: "", message: "" });
      onToast && onToast("Nachricht gesendet · wir melden uns in 24 Std");
      setTimeout(() => setSent(false), 3500);
    } catch (err) {
      setError(err.message || "Senden fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  };

  const inCls = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] tracking-wide text-[#111827] outline-none transition-colors placeholder:text-neutral-300 focus:border-[#111827]";
  const addr = [c.street, (c.zip || "") + " " + (c.city || "")].filter(Boolean).join(", ");

  return (
    <section id="kontakt" className="scroll-mt-20 bg-[#F8F9FA] py-20">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={SPRING} className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Kontakt</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.05 }} className="mt-2 text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-tight tracking-[-0.02em] text-[#111827]">Sprechen wir über Ihr Projekt.</motion.h2>
            <p className="mt-4 max-w-[380px] text-[14px] leading-relaxed text-neutral-500">Schreiben Sie uns – wir antworten innerhalb von 24 Stunden mit einem unverbindlichen Angebot.</p>
            <div className="mt-8 space-y-3">
              <a href={"tel:" + (c.phone || "").replace(/\s/g, "")} className="flex items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 transition-colors hover:border-[#111827]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#111827]"><Icon.phone className="h-[18px] w-[18px]" /></span>
                <div><p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Telefon</p><p className="text-[14px] font-semibold text-[#111827]">{c.phone}</p></div>
              </a>
              <a href={"mailto:" + (c.email || "")} className="flex items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5 transition-colors hover:border-[#111827]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#111827]"><Icon.mail className="h-[18px] w-[18px]" /></span>
                <div><p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">E-Mail</p><p className="text-[14px] font-semibold text-[#111827]">{c.email}</p></div>
              </a>
              <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white px-4 py-3.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-[#111827]"><Icon.box className="h-[18px] w-[18px]" /></span>
                <div><p className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">Adresse</p><p className="text-[14px] font-semibold text-[#111827]">{c.street}, {c.zip} {c.city}</p></div>
              </div>
            </div>
          </div>
          <motion.form onSubmit={send} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.1 }} className="rounded-[26px] border border-neutral-200 bg-white p-7 shadow-[0_24px_60px_-40px_rgba(17,24,39,0.3)] sm:p-9">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Name *</label><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inCls} placeholder="Ihr Name" /></div>
              <div><label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Firma</label><input value={form.firma} onChange={(e) => set("firma", e.target.value)} className={inCls} placeholder="Firmenname" /></div>
            </div>
            <div className="mt-4"><label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">E-Mail *</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inCls} placeholder="name@firma.de" /></div>
            <div className="mt-4"><label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Nachricht *</label><textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={4} className={inCls + " resize-none leading-relaxed"} placeholder="Welche Materialien benötigen Sie?" /></div>
            {error && <p className="mt-3 text-[12px] font-medium text-red-500">{error}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <PrimaryButton type="submit" className="!py-3.5" disabled={busy}>
                <AnimatePresence mode="wait" initial={false}>
                  {sent ? (
                    <motion.span key="ok" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING} className="flex items-center gap-2"><Icon.check className="h-4 w-4" /> Gesendet</motion.span>
                  ) : (
                    <motion.span key="send" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING} className="flex items-center gap-2"><Icon.mail className="h-4 w-4" /> {busy ? "Wird gesendet …" : "Nachricht senden"}</motion.span>
                  )}
                </AnimatePresence>
              </PrimaryButton>
              <span className="text-[11px] tracking-wide text-neutral-400">Wir antworten innerhalb von 24 Stunden</span>
            </div>
          </motion.form>
        </div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.15 }} className="relative mt-8 overflow-hidden rounded-[26px] border border-neutral-200 shadow-[0_24px_60px_-44px_rgba(17,24,39,0.3)]">
          <iframe title="Standort AJS Baustoffe" src={"https://www.google.com/maps?q=" + encodeURIComponent(addr) + "&z=15&output=embed"} className="h-[380px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          <div className="pointer-events-none absolute left-5 top-5 flex max-w-[280px] items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/95 px-4 py-3.5 shadow-lg backdrop-blur-sm">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF4438] text-white"><Icon.pin className="h-[18px] w-[18px]" /></span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Unser Standort</p>
              <p className="mt-0.5 text-[13.5px] font-bold tracking-tight text-[#111827]">{c.name || "AJS Baustoffe"}</p>
              <p className="text-[12px] leading-snug text-neutral-500">{c.street}, {c.zip} {c.city}</p>
            </div>
          </div>
          <a href={"https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(addr)} target="_blank" rel="noopener noreferrer" className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-[12.5px] font-semibold tracking-wide text-white shadow-xl transition-transform hover:scale-[1.03]"><Icon.pin className="h-4 w-4" /> Route planen</a>
        </motion.div>
      </div>
    </section>
  );
}
