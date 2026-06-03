"use client";
import React from "react";
import { motion, AnimatePresence, SPRING, Icon, PrimaryButton, SmartImage } from "@/components/ui";
import { api } from "@/lib/client";

const inputCls = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13.5px] tracking-wide text-[#111827] outline-none transition-colors placeholder:text-neutral-300 focus:border-[#111827]";

function fade(delay = 0) {
  return { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { ...SPRING, delay } };
}
function Field({ label, children }) {
  return (<div><label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">{label}</label>{children}</div>);
}
function statusStyle(s) {
  switch (s) {
    case "Neu": return "bg-[#111827] text-white";
    case "In Bearbeitung": return "bg-amber-500/10 text-amber-600";
    case "Angebot gesendet": return "bg-blue-500/10 text-blue-600";
    default: return "bg-emerald-500/10 text-emerald-600";
  }
}
const readImg = (f, cb) => {  if (!f || !f.type || !f.type.startsWith("image/")) return;
  const r = new FileReader();
  r.onload = (ev) => cb(ev.target.result);
  r.readAsDataURL(f);
};

// Returns true/false if a link looks like an Instagram post, or null when empty.
function toIgEmbedCheck(link) {
  if (!link || !link.trim()) return null;
  return /instagram\.com\/(?:reel|reels|p|tv)\/[A-Za-z0-9_-]+/i.test(link);
}

export function AdminPanel({ user, onLogout }) {
  const [tab, setTab] = React.useState("dashboard");
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Icon.chart },
    { id: "requests", label: "Anfragen", icon: Icon.inbox },
    { id: "categories", label: "Kategorien", icon: Icon.layers },
    { id: "new", label: "Neues Produkt", icon: Icon.box },
    { id: "instagram", label: "Instagram", icon: Icon.instagram },
    { id: "settings", label: "Einstellungen", icon: Icon.cog },
  ];
  const initials = "A";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="min-h-screen bg-[#F8F9FA]">
      <div className="mx-auto flex max-w-[1240px] gap-6 px-6 py-8 lg:px-10">
        <aside className="hidden w-[228px] shrink-0 flex-col md:flex">
          <div className="flex items-center gap-2.5 px-2 pb-7"><img src="/assets/ajs-logo-dark.png" alt="AJS Baustoffe" className="h-8 w-auto" /></div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium tracking-wide transition-colors ${tab === t.id ? "text-[#111827]" : "text-neutral-400 hover:text-[#111827]"}`}>
                {tab === t.id && <motion.span layoutId="adminActive" transition={SPRING} className="absolute inset-0 rounded-xl bg-white shadow-sm" />}
                <t.icon className="relative h-[18px] w-[18px]" />
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-1 pt-6">
            <a href="/" className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-medium tracking-wide text-neutral-400 transition-colors hover:text-[#111827]"><Icon.arrow className="h-4 w-4 rotate-180" /> Zur Website</a>
            <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-medium tracking-wide text-neutral-400 transition-colors hover:text-red-500"><Icon.logout className="h-[18px] w-[18px]" /> Abmelden</button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-7 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-400">Backoffice</p>
              <h1 className="mt-1 text-[26px] font-bold tracking-[-0.02em] text-[#111827]">{tabs.find((t) => t.id === tab).label}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onLogout} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-medium tracking-wide text-[#111827] hover:border-neutral-400 md:hidden">Abmelden</button>
              <div className="hidden items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-1.5 pr-4 md:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-600">{initials}</span>
                <span className="text-[12px] font-medium tracking-wide text-[#111827]">Admin</span>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {tab === "dashboard" && <Dashboard key="d" />}
            {tab === "requests" && <Requests key="r" />}
            {tab === "categories" && <CategoriesManager key="c" />}
            {tab === "new" && <NewProduct key="n" />}
            {tab === "instagram" && <InstagramManager key="ig" />}
            {tab === "settings" && <SettingsPanel key="s" />}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}

// ---- Dashboard --------------------------------------------
function Dashboard() {
  const [stats, setStats] = React.useState(null);
  React.useEffect(() => { api.get("/api/admin/stats").then(setStats).catch(() => setStats(null)); }, []);
  if (!stats) return <motion.div {...fade()} className="text-[13px] text-neutral-400">Lädt …</motion.div>;

  const revenue = stats.revenue || [];
  const max = Math.max(1, ...revenue.map((r) => r.v));
  const kpis = [
    { l: "Offene Anfragen", v: stats.openCount, sub: "Status: Neu", accent: true },
    { l: "Produkte im Katalog", v: stats.productCount, sub: stats.categoryCount + " Kategorien" },
    { l: "Kategorien", v: stats.categoryCount, sub: "Im Sortiment" },
    { l: "Conversion", v: "8.4%", sub: "Illustrativ" },
  ];
  return (
    <motion.div {...fade()} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: i * 0.06 }} className={`rounded-2xl border p-5 ${k.accent ? "border-[#111827] bg-[#111827] text-white" : "border-neutral-200 bg-white"}`}>
            <p className={`text-[11px] tracking-wide ${k.accent ? "text-white/60" : "text-neutral-400"}`}>{k.l}</p>
            <p className="mt-2 text-[30px] font-bold tracking-[-0.02em]">{k.v}</p>
            <p className={`mt-1 text-[11px] tracking-wide ${k.accent ? "text-white/50" : "text-neutral-400"}`}>{k.sub}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div><h3 className="text-[15px] font-bold tracking-tight text-[#111827]">Umsatz (T€)</h3><p className="mt-0.5 text-[11px] tracking-wide text-neutral-400">Letzte 9 Monate · illustrativ</p></div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">+18%</span>
          </div>
          <div className="mt-7 flex h-[180px] items-end gap-2.5">
            {revenue.map((r, i) => (
              <div key={r.m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <motion.div style={{ height: `${(r.v / max) * 150}px`, transformOrigin: "bottom" }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ ...SPRING, delay: 0.2 + i * 0.05 }} className={`w-full rounded-t-md ${i === revenue.length - 1 ? "bg-[#111827]" : "bg-neutral-200"}`} />
                <span className="text-[10px] tracking-wide text-neutral-400">{r.m}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h3 className="text-[15px] font-bold tracking-tight text-[#111827]">Top Kategorien</h3>
          <p className="mt-0.5 text-[11px] tracking-wide text-neutral-400">Anteil Anfragen</p>
          <div className="mt-6 space-y-5">
            {(stats.topCats || []).map((c, i) => (
              <div key={c.l}>
                <div className="flex items-center justify-between text-[12px]"><span className="font-medium text-[#111827]">{c.l}</span><span className="tabular-nums text-neutral-400">{c.v}%</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <motion.div style={{ width: `${c.v}%`, transformOrigin: "left" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ ...SPRING, delay: 0.3 + i * 0.1 }} className="h-full rounded-full bg-[#111827]" />
                </div>
              </div>
            ))}
            {(!stats.topCats || stats.topCats.length === 0) && <p className="text-[12px] text-neutral-400">Noch keine Anfragedaten.</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Requests ---------------------------------------------
function Requests() {
  const [requests, setRequests] = React.useState([]);
  const [open, setOpen] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    setLoading(true);
    api.get("/api/admin/quotes").then((d) => setRequests(d.quotes)).catch(() => setRequests([])).finally(() => setLoading(false));
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    try { await api.patch("/api/admin/quotes/" + encodeURIComponent(id), { status }); } catch { load(); }
  };
  const remove = async (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setOpen(null);
    try { await api.del("/api/admin/quotes/" + encodeURIComponent(id)); } catch { load(); }
  };

  if (loading) return <motion.div {...fade()} className="text-[13px] text-neutral-400">Lädt …</motion.div>;
  if (!requests.length) return <motion.div {...fade()} className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-[13px] text-neutral-400">Noch keine Anfragen.</motion.div>;

  return (
    <motion.div {...fade()} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="hidden gap-px bg-neutral-50 sm:grid sm:grid-cols-[110px_1.4fr_0.7fr_1fr_90px_28px]">
        {["Nr.", "Firma", "Pos.", "Status", "Datum", ""].map((h, i) => (<div key={i} className={`py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 ${i === 0 ? "px-5" : "px-2"}`}>{h}</div>))}
      </div>
      <div className="divide-y divide-neutral-100">
        {requests.map((r, i) => {
          const isOpen = open === r.id;
          return (
            <motion.div key={r.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ ...SPRING, delay: i * 0.05 }}>
              <button onClick={() => setOpen(isOpen ? null : r.id)} className={`grid w-full grid-cols-[1fr_auto] items-center gap-2 px-5 py-4 text-left transition-colors hover:bg-neutral-50 sm:grid-cols-[110px_1.4fr_0.7fr_1fr_90px_28px] ${isOpen ? "bg-neutral-50" : ""}`}>
                <span className="hidden text-[12px] font-semibold tabular-nums text-[#111827] sm:block">{r.id}</span>
                <div className="min-w-0"><p className="text-[13px] font-semibold tracking-tight text-[#111827]">{r.company}</p><p className="text-[11px] tracking-wide text-neutral-400">{r.id} · {r.city}</p></div>
                <span className="hidden text-[12px] tabular-nums text-neutral-500 sm:block">{r.lines.length} Pos.</span>
                <span className={`hidden w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide sm:inline-flex ${statusStyle(r.status)}`}>{r.status}</span>
                <span className="hidden text-[11px] tracking-wide text-neutral-400 sm:block">{r.date}</span>
                <span className="flex items-center justify-end sm:justify-center"><motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={SPRING} className="text-neutral-400"><Icon.chevron className="h-4 w-4" /></motion.span></span>
              </button>
              {isOpen && <RequestDetail r={r} onUpdate={updateStatus} onRemove={remove} />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function RequestDetail({ r, onUpdate, onRemove }) {
  const totalQty = r.lines.reduce((s, l) => s + l.qty, 0);
  const STATI = ["Neu", "In Bearbeitung", "Angebot gesendet", "Abgeschlossen"];
  const phone = (r.contact.phone || "").replace(/\s/g, "");
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING} className="grid gap-5 border-t border-neutral-100 bg-neutral-50/60 px-5 py-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-4">
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Angefragte Produkte</p>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            {r.lines.map((l, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3 last:border-0">
                <div className="min-w-0"><p className="truncate text-[13px] font-semibold tracking-tight text-[#111827]">{l.name}</p><p className="text-[11px] tracking-wide text-neutral-400">{l.variation}</p></div>
                <span className="shrink-0 rounded-full bg-[#111827] px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white">{l.qty}×</span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-neutral-50 px-4 py-2.5"><span className="text-[11px] font-medium tracking-wide text-neutral-500">{r.lines.length} Positionen</span><span className="text-[12px] font-semibold tabular-nums text-[#111827]">{totalQty} Einheiten gesamt</span></div>
          </div>
        </div>
        {r.note && (<div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Notiz des Kunden</p><p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-900">{r.note}</p></div>)}
      </div>
      <div className="h-fit rounded-xl border border-neutral-200 bg-white p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Kontakt</p>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111827] text-[13px] font-bold text-white">{r.contact.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
          <div><p className="text-[13.5px] font-semibold tracking-tight text-[#111827]">{r.contact.name}</p><p className="text-[11px] tracking-wide text-neutral-400">{r.contact.role || "—"} · {r.company}</p></div>
        </div>
        <div className="mt-4 space-y-2">
          {r.contact.phone && (<a href={"tel:" + phone} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-[#111827] transition-colors hover:bg-neutral-50"><Icon.phone className="h-4 w-4 text-neutral-400" /> {r.contact.phone}</a>)}
          <a href={"mailto:" + r.contact.email} className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-[13px] text-[#111827] transition-colors hover:bg-neutral-50"><Icon.mail className="h-4 w-4 text-neutral-400" /> {r.contact.email}</a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <a href={"mailto:" + r.contact.email} className="flex items-center justify-center gap-1.5 rounded-full bg-[#111827] py-2.5 text-[12px] font-medium tracking-wide text-white"><Icon.mail className="h-3.5 w-3.5" /> Angebot senden</a>
          <a href={"tel:" + phone} className="flex items-center justify-center gap-1.5 rounded-full border border-neutral-200 py-2.5 text-[12px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400"><Icon.phone className="h-3.5 w-3.5" /> Anrufen</a>
        </div>
        <div className="mt-5 border-t border-neutral-100 pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Status ändern</p>
          <div className="flex flex-wrap gap-1.5">
            {STATI.map((s) => (<button key={s} onClick={() => onUpdate(r.id, s)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all ${r.status === s ? statusStyle(s) + " ring-1 ring-[#111827]/20" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"}`}>{s}</button>))}
          </div>
          <button onClick={() => { if (window.confirm("Anfrage " + r.id + " wirklich löschen?")) onRemove(r.id); }} className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border border-red-200 py-2.5 text-[12px] font-medium tracking-wide text-red-500 transition-colors hover:bg-red-50"><Icon.trash className="h-3.5 w-3.5" /> Anfrage löschen</button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- New / Edit product -----------------------------------
function NewProduct() {
  const [categories, setCategories] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [editId, setEditId] = React.useState(null);
  const [name, setName] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [rows, setRows] = React.useState([{ id: 1, label: "", sub: "" }]);
  const [badge, setBadge] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const nextId = React.useRef(2);
  const fileRef = React.useRef(null);

  const load = React.useCallback(() => {
    Promise.all([api.get("/api/admin/categories"), api.get("/api/admin/products")]).then(([c, p]) => {
      setCategories(c.categories.map((x) => ({ id: x.slug, name: x.name })));
      setProducts(p.products.map((x) => ({ id: x.id, name: x.name, short: x.short, image: x.image, category: x.category.slug, variations: x.variations })));
      setCategory((prev) => prev || (c.categories[0] ? c.categories[0].slug : ""));
    }).catch(() => {});
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const addRow = () => setRows((r) => [...r, { id: nextId.current++, label: "", sub: "" }]);
  const removeRow = (id) => setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
  const updateRow = (id, key, val) => setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: val } : x)));

  const validRows = rows.filter((r) => r.label.trim());
  const canPublish = name.trim() && validRows.length > 0 && !busy;

  const reset = () => {
    setEditId(null); setName(""); setDesc(""); setImage(null);
    setRows([{ id: 1, label: "", sub: "" }]); nextId.current = 2;
    setBadge(""); setFeatured(false);
    if (categories[0]) setCategory(categories[0].id);
  };
  const startEdit = (p) => {
    setEditId(p.id); setName(p.name); setDesc(p.short || ""); setCategory(p.category);
    setImage(p.image && p.image.indexOf("http") !== 0 ? p.image : p.image || null);
    setBadge(p.badge || ""); setFeatured(!!p.featured);
    let id = 1;
    setRows((p.variations || []).map((v) => ({ id: id++, label: v.label || "", sub: v.sub || "" })));
    nextId.current = id;
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = async () => {
    if (!canPublish) return;
    setBusy(true);
    const payload = { category, name: name.trim(), short: desc.trim(), image: image || undefined, badge: badge.trim(), featured, variations: validRows.map((r) => ({ label: r.label, sub: r.sub })) };
    try {
      if (editId) await api.patch("/api/admin/products/" + editId, payload);
      else await api.post("/api/admin/products", payload);
      setSaved(true);
      load();
      setTimeout(() => { setSaved(false); reset(); }, 1200);
    } catch (e) {
      alert("Fehler: " + e.message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try { await api.del("/api/admin/products/" + id); } catch { load(); }
  };

  const onFile = (e) => readImg(e.target.files && e.target.files[0], setImage);
  const onDrop = (e) => { e.preventDefault(); readImg(e.dataTransfer.files && e.dataTransfer.files[0], setImage); };
  const activeCat = categories.find((c) => c.id === category);

  return (
    <motion.div {...fade()} className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-7">
        <Field label="Produktname"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Knauf Diamant Hartgipsplatte" className={inputCls} /></Field>
        <Field label="Kurzbeschreibung"><input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="z. B. Schlagfeste Hochleistungsplatte für strapazierte Wände." className={inputCls} /></Field>
        <Field label="Produktbild">
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
          <div onDragOver={(e) => e.preventDefault()} onDrop={onDrop} onClick={() => fileRef.current && fileRef.current.click()} className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-neutral-300 p-3 transition-colors hover:border-[#111827]">
            <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              {image ? <img src={image} alt="Vorschau" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Icon.image className="h-6 w-6 text-neutral-300" /></div>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111827]"><Icon.upload className="h-4 w-4" /> {image ? "Bild ändern" : "Bild hochladen"}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-400">Klicken oder Datei hierher ziehen · JPG, PNG</p>
            </div>
            {image && (<button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="shrink-0 rounded-lg border border-neutral-200 p-2 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-[#111827]"><Icon.trash className="h-4 w-4" /></button>)}
          </div>
        </Field>
        <Field label="Kategorie">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (<button key={c.id} onClick={() => setCategory(c.id)} className={`rounded-full border px-4 py-2 text-[12px] font-medium tracking-wide transition-all ${category === c.id ? "border-[#111827] bg-[#111827] text-white" : "border-neutral-200 text-[#111827] hover:border-neutral-400"}`}>{c.name}</button>))}
          </div>
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Etikett / Badge (optional)">
            <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="z. B. Neu, Aktion, Bestseller" className={inputCls} />
            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400">Kleiner Aufkleber auf der Produktkarte. Leer lassen für keinen Badge.</p>
          </Field>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Hervorheben</label>
            <button
              onClick={() => setFeatured((v) => !v)}
              className={`flex w-full items-center justify-between gap-2 rounded-xl border px-4 py-3 text-[13px] font-medium tracking-wide transition-all ${featured ? "border-[#FF7F50] bg-[#FF7F50]/10 text-[#111827]" : "border-neutral-200 text-[#111827] hover:border-neutral-400"}`}
            >
              <span className="flex items-center gap-1.5">{featured ? <Icon.check className="h-4 w-4 text-[#FF7F50]" /> : <Icon.plus className="h-4 w-4" />} {featured ? "Wird hervorgehoben" : "Produkt hervorheben"}</span>
              <span className={`relative h-5 w-9 rounded-full transition-colors ${featured ? "bg-[#FF7F50]" : "bg-neutral-300"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${featured ? "left-[18px]" : "left-0.5"}`} /></span>
            </button>
            <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-400">Hervorgehobene Produkte erscheinen im Katalog ganz oben.</p>
          </div>
        </div>
        <div>
          <div className="mb-2.5 flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Maße / Varianten</span><span className="text-[11px] tracking-wide text-neutral-400">{rows.length} Zeile(n)</span></div>
          <div className="space-y-2.5">
            <AnimatePresence initial={false}>
              {rows.map((row) => (
                <motion.div key={row.id} layout initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING} className="flex items-center gap-2">
                  <input value={row.label} onChange={(e) => updateRow(row.id, "label", e.target.value)} placeholder="Maß (z. B. 12.5 mm)" className="w-[44%] rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] tracking-wide text-[#111827] outline-none transition-colors placeholder:text-neutral-300 focus:border-[#111827]" />
                  <input value={row.sub} onChange={(e) => updateRow(row.id, "sub", e.target.value)} placeholder="Detail (z. B. Paket 2.5 m²)" className="flex-1 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[13px] tracking-wide text-[#111827] outline-none transition-colors placeholder:text-neutral-300 focus:border-[#111827]" />
                  <button onClick={() => removeRow(row.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-[#111827]"><Icon.minus className="h-4 w-4" /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <motion.button onClick={addRow} whileTap={{ scale: 0.97 }} transition={SPRING} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-300 py-2.5 text-[12px] font-medium tracking-wide text-neutral-500 transition-colors hover:border-[#111827] hover:text-[#111827]"><Icon.plus className="h-4 w-4" /> Neue Maß-Zeile hinzufügen</motion.button>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <motion.button onClick={publish} whileTap={{ scale: canPublish ? 0.97 : 1 }} transition={SPRING} disabled={!canPublish} className={`group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-medium tracking-wide text-white transition-colors ${canPublish ? "bg-[#111827]" : "cursor-not-allowed bg-neutral-300"}`}>
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (<motion.span key="s" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING} className="flex items-center gap-2"><Icon.check className="h-4 w-4" /> {editId ? "Aktualisiert" : "Veröffentlicht"}</motion.span>) : (<motion.span key="p" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>{busy ? "Speichern …" : editId ? "Änderungen speichern" : "Produkt veröffentlichen"}</motion.span>)}
            </AnimatePresence>
          </motion.button>
          {editId ? (<button onClick={reset} className="rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400">Abbrechen</button>) : (<span className="text-[11px] tracking-wide text-neutral-400">{canPublish ? "Direkt im Katalog sichtbar" : "Name & mind. 1 Maß erforderlich"}</span>)}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-[#F8F9FA] p-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">Live-Vorschau</p>
        <div className="mt-4 overflow-hidden rounded-[20px] border border-neutral-200 bg-white">
          <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200">
            {image ? <img src={image} alt="Vorschau" className="h-full w-full object-cover" /> : <Icon.box className="h-10 w-10 text-neutral-300" />}
            <span className="absolute left-3.5 top-3.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#111827] backdrop-blur">{editId ? "Bearbeiten" : "Neu"}</span>
          </div>
          <div className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{(validRows.length || rows.length)} Varianten · {activeCat ? activeCat.name : "—"}</p>
            <h3 className="mt-1.5 text-[15px] font-semibold leading-snug tracking-tight text-[#111827]">{name || "Produktname …"}</h3>
            {desc && <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-500">{desc}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {validRows.slice(0, 4).map((r) => (<span key={r.id} className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] tracking-wide text-neutral-500">{r.label}</span>))}
              {validRows.length === 0 && <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] tracking-wide text-neutral-300">noch keine Maße</span>}
            </div>
          </div>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-neutral-400">Nach „Veröffentlichen“ erscheint das Produkt sofort im Katalog der Website.</p>
      </div>

      <div className="lg:col-span-2">
        <div className="mb-3 flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">Vorhandene Produkte ({products.length})</span></div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false}>
            {products.map((p) => {
              const cat = categories.find((c) => c.id === p.category);
              return (
                <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={SPRING} className={`flex items-center gap-3 rounded-2xl border bg-white p-2.5 ${editId === p.id ? "border-[#111827] ring-1 ring-[#111827]/15" : "border-neutral-200"}`}>
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100"><SmartImage src={p.image} alt={p.name} className="h-full w-full" imgClassName="h-full w-full object-cover" /></div>
                  <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-semibold tracking-tight text-[#111827]">{p.name}</p><p className="truncate text-[11px] tracking-wide text-neutral-400">{cat ? cat.name : "—"} · {p.variations.length} Var.</p></div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button onClick={() => startEdit(p)} title="Bearbeiten" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-[#111827] hover:text-[#111827]"><Icon.pencil className="h-4 w-4" /></button>
                    <button onClick={() => { if (window.confirm("„" + p.name + "“ löschen?")) remove(p.id); }} title="Löschen" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-red-300 hover:text-red-500"><Icon.trash className="h-4 w-4" /></button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Categories manager -----------------------------------
function CategoriesManager() {
  const [categories, setCategories] = React.useState([]);
  const [name, setName] = React.useState("");
  const [de, setDe] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [editId, setEditId] = React.useState(null);
  const [edit, setEdit] = React.useState({ name: "", de: "", tagline: "", image: null });
  const fileRef = React.useRef(null);
  const editFileRef = React.useRef(null);

  const load = React.useCallback(() => {
    api.get("/api/admin/categories").then((d) => setCategories(d.categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name, de: c.de, tagline: c.tagline, image: c.image, count: c._count?.products ?? 0 })))).catch(() => {});
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!name.trim()) return;
    try {
      await api.post("/api/admin/categories", { name: name.trim(), de: de.trim(), tagline: tagline.trim(), image: image || undefined });
      setName(""); setDe(""); setTagline(""); setImage(null);
      load();
    } catch (e) { alert("Fehler: " + e.message); }
  };
  const startEdit = (c) => { setEditId(c.id); setEdit({ name: c.name, de: c.de || "", tagline: c.tagline || "", image: null }); };
  const saveEdit = async () => {
    if (!edit.name.trim()) return;
    const patch = { name: edit.name.trim(), de: edit.de.trim(), tagline: edit.tagline.trim() };
    if (edit.image) patch.image = edit.image;
    try { await api.patch("/api/admin/categories/" + editId, patch); setEditId(null); load(); } catch (e) { alert("Fehler: " + e.message); }
  };
  const remove = async (c) => {
    if (!window.confirm("Kategorie „" + c.name + "“ löschen? Zugeordnete Produkte werden ebenfalls entfernt.")) return;
    setCategories((prev) => prev.filter((x) => x.id !== c.id));
    try { await api.del("/api/admin/categories/" + c.id); } catch { load(); }
  };

  return (
    <motion.div {...fade()} className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="rounded-2xl border border-neutral-200 bg-white p-2">
        <div className="grid grid-cols-[1fr_auto] bg-neutral-50 px-5 py-3"><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Kategorie</span><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Produkte</span></div>
        <div className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {categories.map((c) => (
              <motion.div key={c.id} layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={SPRING} className="px-3 py-2.5">
                {editId === c.id ? (
                  <div className="space-y-2 rounded-xl border border-[#111827]/15 bg-neutral-50 p-3">
                    <input value={edit.name} onChange={(e) => setEdit((s) => ({ ...s, name: e.target.value }))} placeholder="Name" className={inputCls} />
                    <div className="grid grid-cols-2 gap-2">
                      <input value={edit.de} onChange={(e) => setEdit((s) => ({ ...s, de: e.target.value }))} placeholder="Untertitel (EN)" className={inputCls} />
                      <input value={edit.tagline} onChange={(e) => setEdit((s) => ({ ...s, tagline: e.target.value }))} placeholder="Kurzbeschreibung" className={inputCls} />
                    </div>
                    <input ref={editFileRef} type="file" accept="image/*" onChange={(e) => readImg(e.target.files && e.target.files[0], (d) => setEdit((s) => ({ ...s, image: d })))} className="hidden" />
                    <div onClick={() => editFileRef.current && editFileRef.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); readImg(e.dataTransfer.files && e.dataTransfer.files[0], (d) => setEdit((s) => ({ ...s, image: d }))); }} className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white p-2.5 transition-colors hover:border-[#111827]">
                      <div className="h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">{edit.image ? <img src={edit.image} alt="" className="h-full w-full object-cover" /> : <SmartImage src={c.image} alt="" className="h-full w-full" imgClassName="h-full w-full object-cover" />}</div>
                      <p className="flex items-center gap-1.5 text-[12px] font-medium text-[#111827]"><Icon.upload className="h-3.5 w-3.5" /> {edit.image ? "Bild geändert" : "Bild ändern"}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button onClick={saveEdit} className="flex items-center gap-1.5 rounded-full bg-[#111827] px-4 py-2 text-[12px] font-medium tracking-wide text-white"><Icon.check className="h-3.5 w-3.5" /> Speichern</button>
                      <button onClick={() => setEditId(null)} className="rounded-full border border-neutral-200 px-4 py-2 text-[12px] font-medium tracking-wide text-[#111827] hover:border-neutral-400">Abbrechen</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="h-10 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100"><SmartImage src={c.image} alt={c.name} className="h-full w-full" imgClassName="h-full w-full object-cover" /></span>
                      <div className="min-w-0"><p className="truncate text-[13.5px] font-semibold tracking-tight text-[#111827]">{c.name}</p><p className="truncate text-[11px] tracking-wide text-neutral-400">{c.de}</p></div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-semibold tabular-nums text-[#111827]">{c.count}</span>
                      <button onClick={() => startEdit(c)} title="Bearbeiten" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 transition-colors hover:border-[#111827] hover:text-[#111827]"><Icon.pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(c)} title="Löschen" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-red-300 hover:text-red-500"><Icon.trash className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-neutral-200 bg-white p-7">
        <h3 className="text-[15px] font-bold tracking-tight text-[#111827]">Neue Kategorie</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-neutral-400">Erscheint sofort als Filter und im Sortiment der Website.</p>
        <div className="mt-5 space-y-4">
          <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Bodenbeläge" className={inputCls} /></Field>
          <Field label="Untertitel (EN)"><input value={de} onChange={(e) => setDe(e.target.value)} placeholder="z. B. Flooring" className={inputCls} /></Field>
          <Field label="Kurzbeschreibung"><input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="z. B. Vinyl-, Laminat- und Designböden." className={inputCls} /></Field>
          <Field label="Kategoriebild">
            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => readImg(e.target.files && e.target.files[0], setImage)} className="hidden" />
            <div onClick={() => fileRef.current && fileRef.current.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); readImg(e.dataTransfer.files && e.dataTransfer.files[0], setImage); }} className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-neutral-300 p-3 transition-colors hover:border-[#111827]">
              <div className="relative h-[64px] w-[84px] shrink-0 overflow-hidden rounded-xl bg-neutral-100">{image ? <img src={image} alt="Vorschau" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Icon.image className="h-6 w-6 text-neutral-300" /></div>}</div>
              <div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111827]"><Icon.upload className="h-4 w-4" /> {image ? "Bild ändern" : "Bild hochladen"}</p><p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-400">Klicken oder Datei hierher ziehen · JPG, PNG</p></div>
              {image && (<button onClick={(e) => { e.stopPropagation(); setImage(null); }} className="shrink-0 rounded-lg border border-neutral-200 p-2 text-neutral-400 transition-colors hover:border-neutral-400 hover:text-[#111827]"><Icon.trash className="h-4 w-4" /></button>)}
            </div>
          </Field>
          <PrimaryButton full onClick={submit}><Icon.plus className="h-4 w-4" /> Kategorie anlegen</PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Instagram manager ------------------------------------
function InstagramManager() {
  const [posts, setPosts] = React.useState([]);
  const [editId, setEditId] = React.useState(null);
  const [caption, setCaption] = React.useState("");
  const [link, setLink] = React.useState("");
  const [name, setName] = React.useState("AJS Baustoffe");
  const [video, setVideo] = React.useState(false);
  const [videoSrc, setVideoSrc] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [uploadErr, setUploadErr] = React.useState("");
  const fileRef = React.useRef(null);
  const videoFileRef = React.useRef(null);

  const load = React.useCallback(() => {
    api.get("/api/admin/instagram").then((d) => setPosts(d.posts.map((p) => ({ id: p.id, name: p.authorName, caption: p.caption, link: p.link, video: p.video, videoSrc: p.videoSrc, image: p.image, date: new Date(p.postedAt).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" }) })))).catch(() => {});
  }, []);
  React.useEffect(() => { load(); }, [load]);

  // Upload a video file directly to the server and use the returned URL.
  const onVideoFile = async (f) => {
    if (!f) return;
    setUploadErr("");
    if (!f.type.startsWith("video/")) { setUploadErr("Bitte eine Videodatei wählen (MP4, WebM, MOV)."); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/admin/upload", { method: "POST", credentials: "same-origin", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload fehlgeschlagen");
      setVideoSrc(data.url);
    } catch (e) {
      setUploadErr(e.message || "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  };

  const onFile = (f) => readImg(f, setImage);
  const resetForm = () => { setEditId(null); setCaption(""); setLink(""); setName("AJS Baustoffe"); setVideo(false); setVideoSrc(""); setImage(null); };
  const startEdit = (p) => { setEditId(p.id); setCaption(p.caption || ""); setLink(p.link || ""); setName(p.name || "AJS Baustoffe"); setVideo(!!p.video); setVideoSrc(p.videoSrc || ""); setImage(p.image && p.image.indexOf("http") !== 0 ? p.image : null); };
  const canAdd = caption.trim().length > 0;

  const submit = async () => {
    if (!canAdd) return;
    const payload = { name: name.trim() || "AJS Baustoffe", caption: caption.trim(), link: link.trim() || "https://www.instagram.com/", video, videoSrc: video ? videoSrc.trim() : "" };
    if (image) payload.image = image;
    try {
      if (editId) await api.patch("/api/admin/instagram/" + editId, payload);
      else await api.post("/api/admin/instagram", payload);
      resetForm(); load();
    } catch (e) { alert("Fehler: " + e.message); }
  };
  const remove = async (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    try { await api.del("/api/admin/instagram/" + id); } catch { load(); }
  };

  return (
    <motion.div {...fade()} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(360px,1.05fr)]">
      <div className="rounded-2xl border border-neutral-200 bg-white p-2">
        <div className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">Veröffentlichte Beiträge ({posts.length})</div>
        <div className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {posts.map((p) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={SPRING} className="flex items-center gap-3 px-3 py-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                  <SmartImage src={p.image} alt="" className="h-full w-full" imgClassName="h-full w-full object-cover" />
                  {p.video && (<span className="absolute inset-0 flex items-center justify-center"><Icon.play className="h-5 w-5 text-white drop-shadow" /></span>)}
                </div>
                <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-[#111827]">{p.caption}</p><p className="truncate text-[11px] tracking-wide text-neutral-400">{p.name} · {p.date}</p></div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button onClick={() => startEdit(p)} title="Bearbeiten" className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${editId === p.id ? "border-[#111827] text-[#111827]" : "border-neutral-200 text-neutral-500 hover:border-[#111827] hover:text-[#111827]"}`}><Icon.pencil className="h-4 w-4" /></button>
                  <button onClick={() => { if (window.confirm("Beitrag löschen?")) remove(p.id); }} title="Löschen" className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-400 transition-colors hover:border-red-300 hover:text-red-500"><Icon.trash className="h-4 w-4" /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-fit min-w-[340px] space-y-4 rounded-2xl border border-neutral-200 bg-white p-7">
        <div className="flex items-center gap-2"><Icon.instagram className="h-[18px] w-[18px] text-[#111827]" /><h3 className="text-[15px] font-bold tracking-tight text-[#111827]">{editId ? "Beitrag bearbeiten" : "Neuer Beitrag"}</h3></div>
        <Field label="Bildunterschrift"><textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={3} className={inputCls + " resize-none leading-relaxed"} placeholder="Text des Instagram-Beitrags …" /></Field>
        <Field label="Instagram-Link">
          <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 focus-within:border-[#111827]"><Icon.instagram className="h-[18px] w-[18px] text-neutral-400" /><input value={link} onChange={(e) => setLink(e.target.value)} className="w-full bg-transparent py-3 text-[13px] tracking-wide text-[#111827] outline-none placeholder:text-neutral-300" placeholder="https://www.instagram.com/p/…" /></div>
        </Field>
        <div className="space-y-4">
          <Field label="Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="AJS Baustoffe" /></Field>
          <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">Typ</label>
            <button onClick={() => setVideo((v) => !v)} className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-3 text-[13px] font-medium tracking-wide transition-all ${video ? "border-[#111827] bg-[#111827] text-white" : "border-neutral-200 text-[#111827] hover:border-neutral-400"}`}>{video ? <Icon.play className="h-4 w-4" /> : <Icon.image className="h-4 w-4" />} {video ? "Reel / Video" : "Bild"}</button>
          </div>
        </div>
        {video && (
          <>
            <Field label="Video-Datei (.mp4) — spielt im eigenen Design">
              <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 focus-within:border-[#111827]"><Icon.play className="h-[16px] w-[16px] shrink-0 text-neutral-400" /><input value={videoSrc} onChange={(e) => setVideoSrc(e.target.value)} className="w-full bg-transparent py-3 text-[13px] tracking-wide text-[#111827] outline-none placeholder:text-neutral-300" placeholder="https://… .mp4 oder hochladen" /></div>
              <input ref={videoFileRef} type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => onVideoFile(e.target.files && e.target.files[0])} className="hidden" />
              <button
                onClick={() => videoFileRef.current && videoFileRef.current.click()}
                disabled={uploading}
                className={`mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-8 text-[13px] font-medium tracking-wide transition-colors ${uploading ? "border-neutral-200 text-neutral-400" : "border-neutral-300 text-[#111827] hover:border-[#111827] hover:bg-neutral-50"}`}
              >
                <Icon.upload className="h-7 w-7" /> {uploading ? "Wird hochgeladen …" : "Videodatei hochladen (MP4)"}
                {!uploading && <span className="text-[11px] font-normal text-neutral-400">Klicken zum Auswählen · max. 200 MB</span>}
              </button>
              {uploadErr && <p className="mt-2 text-[11px] font-medium text-red-500">{uploadErr}</p>}
              {videoSrc && !uploading && (
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600"><Icon.check className="h-3.5 w-3.5" /> Video bereit: <span className="truncate text-neutral-500">{videoSrc}</span></p>
              )}
              <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">Laden Sie eine <strong>.mp4-Datei</strong> hoch oder fügen Sie einen direkten Link ein. Das Video läuft automatisch in der AJS-Karte. Leer lassen, um stattdessen ein Instagram-Reel einzubetten.</p>
            </Field>
            <div className="rounded-xl border border-[#111827]/15 bg-neutral-50 px-4 py-3.5">
              <p className="text-[12px] font-semibold text-[#111827]">Alternativ: Instagram-Reel einbetten</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-neutral-500">Ohne .mp4-Datei: Fügen Sie oben bei <strong>Instagram-Link</strong> den Reel-Link ein (z. B. <span className="text-neutral-600">instagram.com/reel/…</span>). Dann wird der offizielle Instagram-Player verwendet.</p>
              {toIgEmbedCheck(link) === false && link.trim() !== "" && (
                <p className="mt-2 text-[11px] font-medium text-amber-600">Dieser Link sieht nicht wie ein Instagram-Beitrag aus.</p>
              )}
              {toIgEmbedCheck(link) === true && (
                <p className="mt-2 text-[11px] font-medium text-emerald-600">✓ Gültiger Instagram-Link erkannt.</p>
              )}
            </div>
          </>
        )}
        <Field label="Bild (optional)">
          <input ref={fileRef} type="file" accept="image/*" onChange={(e) => onFile(e.target.files && e.target.files[0])} className="hidden" />
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files && e.dataTransfer.files[0]); }} onClick={() => fileRef.current && fileRef.current.click()} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-neutral-300 p-3 transition-colors hover:border-[#111827]">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><Icon.image className="h-5 w-5 text-neutral-300" /></div>}</div>
            <p className="text-[12px] leading-relaxed text-neutral-500">{image ? "Bild ausgewählt – klicken zum Ändern" : "Bild hochladen (sonst Platzhalter)"}</p>
          </div>
        </Field>
        <div className="flex items-center gap-2">
          <PrimaryButton full={!editId} onClick={submit} className={canAdd ? "" : "opacity-50"}>{editId ? <Icon.check className="h-4 w-4" /> : <Icon.plus className="h-4 w-4" />} {editId ? "Änderungen speichern" : "Beitrag hinzufügen"}</PrimaryButton>
          {editId && (<button onClick={resetForm} className="rounded-full border border-neutral-200 px-5 py-3 text-[13px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400">Abbrechen</button>)}
        </div>
      </div>
    </motion.div>
  );
}

// ---- Settings panel ---------------------------------------
function SettingsPanel() {
  const [company, setCompany] = React.useState(null);
  const [socials, setSocials] = React.useState({});
  const [heroImage, setHeroImage] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const heroRef = React.useRef(null);

  React.useEffect(() => {
    api.get("/api/admin/settings").then((d) => {
      const s = d.settings;
      if (!s) return;
      setCompany({ name: s.companyName, tagline: s.tagline, phone: s.phone, email: s.email, street: s.street, zip: s.zip, city: s.city });
      setSocials({ linkedin: s.linkedin, instagram: s.instagram, xing: s.xing, youtube: s.youtube });
      setHeroImage(s.heroImage);
    }).catch(() => {});
  }, []);

  if (!company) return <motion.div {...fade()} className="text-[13px] text-neutral-400">Lädt …</motion.div>;

  const setC = (k, v) => setCompany((p) => ({ ...p, [k]: v }));
  const setS = (k, v) => setSocials((p) => ({ ...p, [k]: v }));
  const onHero = (file) => readImg(file, setHeroImage);

  const save = async () => {
    setBusy(true);
    try {
      await api.put("/api/admin/settings", { company, socials, heroImage });
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    } catch (e) { alert("Fehler: " + e.message); } finally { setBusy(false); }
  };

  const socialFields = [
    { k: "linkedin", label: "LinkedIn", icon: Icon.linkedin },
    { k: "instagram", label: "Instagram", icon: Icon.instagram },
    { k: "xing", label: "Xing", icon: Icon.xing },
    { k: "youtube", label: "YouTube", icon: Icon.youtube },
  ];

  return (
    <motion.div {...fade()} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-7">
          <div className="flex items-center gap-2"><Icon.box className="h-[18px] w-[18px] text-[#111827]" /><h3 className="text-[15px] font-bold tracking-tight text-[#111827]">Firmendaten</h3></div>
          <Field label="Firmenname"><input value={company.name} onChange={(e) => setC("name", e.target.value)} className={inputCls} placeholder="AJS Baustoffe" /></Field>
          <Field label="Beschreibung (Footer)"><textarea value={company.tagline} onChange={(e) => setC("tagline", e.target.value)} rows={3} className={inputCls + " resize-none leading-relaxed"} placeholder="Kurzer Beschreibungstext …" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Telefon"><input value={company.phone} onChange={(e) => setC("phone", e.target.value)} className={inputCls} placeholder="+49 …" /></Field>
            <Field label="E-Mail"><input value={company.email} onChange={(e) => setC("email", e.target.value)} className={inputCls} placeholder="info@…" /></Field>
          </div>
          <Field label="Straße & Nr."><input value={company.street} onChange={(e) => setC("street", e.target.value)} className={inputCls} placeholder="Industriestraße 12" /></Field>
          <div className="grid grid-cols-[0.5fr_1fr] gap-3">
            <Field label="PLZ"><input value={company.zip} onChange={(e) => setC("zip", e.target.value)} className={inputCls} placeholder="86150" /></Field>
            <Field label="Stadt"><input value={company.city} onChange={(e) => setC("city", e.target.value)} className={inputCls} placeholder="Augsburg" /></Field>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-7">
            <div className="flex items-center gap-2"><Icon.linkedin className="h-[18px] w-[18px] text-[#111827]" /><h3 className="text-[15px] font-bold tracking-tight text-[#111827]">Social Media</h3></div>
            {socialFields.map((f) => (
              <div key={f.k}>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111827]">{f.label}</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-3.5 focus-within:border-[#111827]"><span className="text-neutral-400">{f.icon({ className: "h-[18px] w-[18px]" })}</span><input value={socials[f.k] || ""} onChange={(e) => setS(f.k, e.target.value)} className="w-full bg-transparent py-3 text-[13px] tracking-wide text-[#111827] outline-none placeholder:text-neutral-300" placeholder={"https://" + f.label.toLowerCase() + ".com/ajs"} /></div>
              </div>
            ))}
          </div>

          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-7">
            <div className="flex items-center gap-2"><Icon.image className="h-[18px] w-[18px] text-[#111827]" /><h3 className="text-[15px] font-bold tracking-tight text-[#111827]">Website-Bilder</h3></div>
            <Field label="Hero-Bild (Startseite)">
              <input ref={heroRef} type="file" accept="image/*" onChange={(e) => onHero(e.target.files && e.target.files[0])} className="hidden" />
              <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onHero(e.dataTransfer.files && e.dataTransfer.files[0]); }} onClick={() => heroRef.current && heroRef.current.click()} className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-neutral-300 p-3 transition-colors hover:border-[#111827]">
                <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-neutral-100"><SmartImage src={heroImage} alt="Hero" className="h-full w-full" imgClassName="h-full w-full object-cover" /></div>
                <div className="min-w-0 flex-1"><p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#111827]"><Icon.upload className="h-4 w-4" /> Bild ändern</p><p className="mt-0.5 text-[11.5px] leading-relaxed text-neutral-400">Klicken oder Datei hierher ziehen · JPG, PNG</p></div>
              </div>
            </Field>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <PrimaryButton onClick={save} className="!py-3.5" disabled={busy}>
          <AnimatePresence mode="wait" initial={false}>
            {saved ? (<motion.span key="s" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING} className="flex items-center gap-2"><Icon.check className="h-4 w-4" /> Gespeichert</motion.span>) : (<motion.span key="p" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={SPRING}>{busy ? "Speichern …" : "Änderungen speichern"}</motion.span>)}
          </AnimatePresence>
        </PrimaryButton>
        <span className="text-[11px] tracking-wide text-neutral-400">Wirkt sofort auf Hero-Bereich und Footer der Website.</span>
      </div>
    </motion.div>
  );
}
