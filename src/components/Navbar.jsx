"use client";
import React from "react";
import { motion, AnimatePresence, SPRING, Logo, Icon, PrimaryButton, SmartImage } from "./ui";

function NavLink({ l, onNav, light }) {
  return (
    <button
      onClick={() => onNav(l.id)}
      className={`group relative rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
        light ? "text-white/80 hover:text-white" : "text-neutral-600 hover:text-[#111827]"
      }`}
    >
      {l.label}
      <span className={`absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${light ? "bg-white" : "bg-[#111827]"}`} />
    </button>
  );
}

export function Navbar({ onNav, onOpenCart, cartCount, view, scrolled }) {
  const links = [
    { id: "katalog", label: "Katalog" },
    { id: "kategorien", label: "Kategorien" },
    { id: "instagram", label: "Instagram" },
    { id: "kontakt", label: "Kontakt" },
  ];
  const light = !scrolled && view !== "admin";
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...SPRING, delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "border-b border-neutral-200/70 bg-white/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center justify-between px-6 lg:px-10">
        <Logo onClick={() => onNav("home")} light={light} navMarker />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (<NavLink key={l.id} l={l} onNav={onNav} light={light} />))}
        </nav>
        <div className="flex items-center gap-2.5">
          <motion.button
            onClick={() => onNav("kontakt")}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="hidden items-center gap-1.5 rounded-full bg-[#FF7F50] px-4 py-2 text-[12px] font-semibold tracking-wide text-white lg:inline-flex"
          >
            Angebot anfordern
          </motion.button>
          <motion.button
            onClick={onOpenCart}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            className={`group relative flex items-center gap-2 rounded-full border py-2 pl-3.5 pr-4 transition-colors ${
              light ? "border-white/30 bg-white/10 backdrop-blur-sm hover:border-white/60" : "border-neutral-200 bg-white hover:border-neutral-400"
            }`}
          >
            <Icon.cart className={`h-[18px] w-[18px] ${light ? "text-white" : "text-[#111827]"}`} />
            <span className={`hidden text-[12px] font-medium tracking-wide sm:block ${light ? "text-white" : "text-[#111827]"}`}>Anfrageliste</span>
            <span className={`relative flex h-5 min-w-[20px] items-center justify-center overflow-hidden rounded-full px-1.5 text-[11px] font-semibold ${light ? "bg-white text-[#111827]" : "bg-[#111827] text-white"}`}>
              <motion.span key={cartCount} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>{cartCount}</motion.span>
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}

export function CartDrawer({ open, onClose, items, onQty, onRemove, onSubmit, submitting }) {
  const total = items.reduce((s, i) => s + i.qty, 0);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} onClick={onClose} className="fixed inset-0 z-50 bg-[#111827]/25 backdrop-blur-[2px]" />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={SPRING} className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-[440px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-7 py-6">
              <div>
                <h2 className="text-[18px] font-bold tracking-tight text-[#111827]">Anfrageliste</h2>
                <p className="mt-0.5 text-[12px] tracking-wide text-neutral-400">{total} {total === 1 ? "Position" : "Positionen"} · unverbindlich</p>
              </div>
              <button onClick={onClose} className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-[#111827]"><Icon.close className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50"><Icon.cart className="h-7 w-7 text-neutral-300" /></div>
                  <p className="mt-5 text-[14px] font-medium text-[#111827]">Ihre Anfrageliste ist leer</p>
                  <p className="mt-1 max-w-[240px] text-[12px] leading-relaxed text-neutral-400">Fügen Sie Produkte hinzu, um ein individuelles Angebot anzufordern.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.li key={it.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }} transition={SPRING} className="flex gap-3.5 rounded-2xl border border-neutral-100 p-3">
                        <SmartImage src={it.image} alt={it.name} className="h-[68px] w-[68px] shrink-0 rounded-xl" imgClassName="h-full w-full object-cover" />
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[13px] font-semibold leading-snug text-[#111827]">{it.name}</p>
                            <button onClick={() => onRemove(it.key)} className="shrink-0 rounded-md p-1 text-neutral-300 hover:text-[#111827]"><Icon.trash className="h-4 w-4" /></button>
                          </div>
                          <p className="mt-0.5 text-[11px] tracking-wide text-neutral-400">{it.variation}</p>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 rounded-full border border-neutral-200 p-0.5">
                              <button onClick={() => onQty(it.key, -1)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#111827] hover:bg-neutral-100"><Icon.minus className="h-3.5 w-3.5" /></button>
                              <span className="w-6 text-center text-[12px] font-semibold tabular-nums text-[#111827]">{it.qty}</span>
                              <button onClick={() => onQty(it.key, 1)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#111827] hover:bg-neutral-100"><Icon.plus className="h-3.5 w-3.5" /></button>
                            </div>
                            <span className="text-[11px] tracking-wide text-neutral-400">Menge</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
            {items.length > 0 && (
              <div className="border-t border-neutral-100 px-7 py-6">
                <div className="mb-4 flex items-center justify-between text-[13px]">
                  <span className="tracking-wide text-neutral-500">Positionen gesamt</span>
                  <span className="font-semibold text-[#111827]">{total}</span>
                </div>
                <a href="/anfrage" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-[13px] font-medium tracking-wide text-white">
                  Angebot anfordern
                  <Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400">Unverbindlich · Antwort innerhalb von 24 Stunden</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
