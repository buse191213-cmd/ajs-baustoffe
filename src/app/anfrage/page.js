"use client";
import React from "react";
import { motion, SPRING, Logo, Icon, PrimaryButton, SmartImage } from "@/components/ui";
import { api } from "@/lib/client";

export default function AnfragePage() {
  const [items, setItems] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", company: "", note: "" });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState("");
  const [done, setDone] = React.useState(null); // reference string once sent

  // Load the cart that the homepage stored in localStorage.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("ajs_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {}
    setLoaded(true);
  }, []);

  const total = items.reduce((s, i) => s + i.qty, 0);
  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const canSend = form.name.trim() && emailOk && items.length > 0 && !busy;

  const changeQty = (key, d) =>
    setItems((prev) => {
      const next = prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + d) } : i));
      try { localStorage.setItem("ajs_cart", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  const removeItem = (key) =>
    setItems((prev) => {
      const next = prev.filter((i) => i.key !== key);
      try { localStorage.setItem("ajs_cart", JSON.stringify(next)); } catch (e) {}
      return next;
    });

  const send = async () => {
    if (!form.name.trim()) { setErr("Bitte Ihren Namen eingeben."); return; }
    if (!emailOk) { setErr("Bitte eine gültige E-Mail-Adresse eingeben."); return; }
    if (items.length === 0) { setErr("Ihre Anfrageliste ist leer."); return; }
    setErr(""); setBusy(true);
    try {
      const res = await api.post("/api/public/quote", {
        contactName: form.name.trim(),
        contactEmail: form.email.trim(),
        contactPhone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        note: form.note.trim() || undefined,
        lines: items.map((i) => ({ name: i.name, variation: i.variation, qty: i.qty })),
      });
      try { localStorage.removeItem("ajs_cart"); } catch (e) {}
      setItems([]);
      setDone(res.reference);
    } catch (e) {
      setErr(e.message || "Senden fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  };

  const inCls = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[14px] tracking-wide text-[#111827] outline-none transition-colors placeholder:text-neutral-300 focus:border-[#111827]";

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-6 lg:px-10">
          <a href="/"><Logo /></a>
          <a href="/" className="flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-neutral-500 transition-colors hover:text-[#111827]">
            <Icon.arrow className="h-4 w-4 rotate-180" /> Zurück zum Shop
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-6 py-12 lg:px-10">
        {done ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="mx-auto max-w-[520px] rounded-[26px] border border-neutral-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600"><Icon.check className="h-8 w-8" /></div>
            <h1 className="mt-6 text-[24px] font-bold tracking-[-0.02em] text-[#111827]">Anfrage gesendet!</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">Vielen Dank. Ihre Anfrage <span className="font-semibold text-[#111827]">{done}</span> ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot.</p>
            <div className="mt-7"><a href="/"><PrimaryButton>Zurück zur Startseite <Icon.arrow className="h-4 w-4" /></PrimaryButton></a></div>
          </motion.div>
        ) : (
          <div className="mx-auto max-w-[980px]">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}>
              <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Angebot anfordern</p>
              <h1 className="mt-2 text-[clamp(1.8rem,3.5vw,2.4rem)] font-bold leading-tight tracking-[-0.02em] text-[#111827]">Ihre Anfrage</h1>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">Hinterlassen Sie Ihre Kontaktdaten. Sie erhalten innerhalb von 24 Stunden ein unverbindliches Angebot{loaded && items.length > 0 ? ` für ${total} ${total === 1 ? "Position" : "Positionen"}` : ""}.</p>
            </motion.div>

            {loaded && items.length === 0 ? (
              <div className="mt-8 rounded-[22px] border border-dashed border-neutral-200 bg-white py-12 text-center">
                <p className="text-[14px] font-medium text-[#111827]">Ihre Anfrageliste ist leer</p>
                <p className="mt-1 text-[12px] text-neutral-400">Fügen Sie im Katalog Produkte hinzu, bevor Sie eine Anfrage senden.</p>
                <a href="/#katalog" className="mt-4 inline-flex rounded-full border border-neutral-200 px-5 py-2 text-[12px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400">Zum Katalog</a>
              </div>
            ) : (
              <div className="mt-8 grid items-start gap-5 lg:grid-cols-[1fr_0.9fr]">
                {/* Visual list of requested products */}
                {loaded && items.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.05 }} className="rounded-[22px] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[15px] font-bold tracking-tight text-[#111827]">Ihre Produkte</h2>
                      <span className="rounded-full bg-[#111827] px-3 py-1 text-[12px] font-semibold tabular-nums text-white">{total}</span>
                    </div>
                    <ul className="mt-4 space-y-3">
                      {items.map((it) => (
                        <li key={it.key} className="flex gap-3.5 rounded-2xl border border-neutral-100 p-3">
                          <SmartImage src={it.image} alt={it.name} className="h-[64px] w-[64px] shrink-0 rounded-xl" imgClassName="h-full w-full object-cover" />
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[13px] font-semibold leading-snug text-[#111827]">{it.name}</p>
                              <button onClick={() => removeItem(it.key)} className="shrink-0 rounded-md p-1 text-neutral-300 hover:text-[#111827]"><Icon.trash className="h-4 w-4" /></button>
                            </div>
                            <p className="mt-0.5 text-[11px] tracking-wide text-neutral-400">{it.variation}</p>
                            <div className="mt-auto flex items-center gap-1 pt-2">
                              <div className="flex items-center gap-1 rounded-full border border-neutral-200 p-0.5">
                                <button onClick={() => changeQty(it.key, -1)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#111827] hover:bg-neutral-100"><Icon.minus className="h-3.5 w-3.5" /></button>
                                <span className="w-6 text-center text-[12px] font-semibold tabular-nums text-[#111827]">{it.qty}</span>
                                <button onClick={() => changeQty(it.key, 1)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#111827] hover:bg-neutral-100"><Icon.plus className="h-3.5 w-3.5" /></button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                      <span className="text-[12px] font-medium tracking-wide text-neutral-500">Gesamtmenge</span>
                      <span className="text-[14px] font-bold tabular-nums text-[#111827]">{total} {total === 1 ? "Einheit" : "Einheiten"}</span>
                    </div>
                  </motion.div>
                )}

                {/* Contact form */}
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.12 }} className="rounded-[22px] border border-neutral-200 bg-white p-7 shadow-sm sm:p-8">
                  <h2 className="text-[15px] font-bold tracking-tight text-[#111827]">Ihre Kontaktdaten</h2>
                  <div className="mt-4 space-y-3">
                    <input value={form.name} onChange={(e) => { setField("name", e.target.value); setErr(""); }} className={inCls} placeholder="Name *" />
                  <input type="email" value={form.email} onChange={(e) => { setField("email", e.target.value); setErr(""); }} className={inCls} placeholder="E-Mail *" />
                  <input value={form.phone} onChange={(e) => setField("phone", e.target.value)} className={inCls} placeholder="Telefon (optional)" />
                  <input value={form.company} onChange={(e) => setField("company", e.target.value)} className={inCls} placeholder="Firma (optional)" />
                  <textarea value={form.note} onChange={(e) => setField("note", e.target.value)} rows={4} className={inCls + " resize-none leading-relaxed"} placeholder="Notiz (z. B. Lieferadresse, Wunschtermin, Rückfragen) – optional" />
                </div>
                {err && <p className="mt-3 text-[12px] font-medium text-red-500">{err}</p>}
                <div className="mt-5">
                  <PrimaryButton full onClick={send} disabled={!canSend} className="!py-3.5">
                    {busy ? "Wird gesendet …" : "Anfrage absenden"}
                    {!busy && <Icon.check className="h-4 w-4" />}
                  </PrimaryButton>
                </div>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400">Unverbindlich · Antwort innerhalb von 24 Stunden</p>
                </motion.div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
