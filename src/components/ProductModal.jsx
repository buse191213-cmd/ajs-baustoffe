"use client";
import React from "react";
import { motion, AnimatePresence, SPRING, Icon, PrimaryButton, SmartImage } from "./ui";

export function ProductModal({ product, onClose, onAdd }) {
  const [variant, setVariant] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [added, setAdded] = React.useState(false);

  React.useEffect(() => { if (product) { setVariant(0); setQty(1); setAdded(false); } }, [product]);
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleAdd = () => {
    onAdd(product, product.variations[variant], qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose} className="absolute inset-0 bg-[#111827]/30 backdrop-blur-md" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 16 }} transition={{ type: "spring", stiffness: 100, damping: 15 }} className="relative grid max-h-[88vh] w-full max-w-[920px] grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-2xl md:grid-cols-2">
            <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#111827] backdrop-blur transition-colors hover:bg-white"><Icon.close className="h-5 w-5" /></button>
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 md:aspect-auto md:h-full">
              <SmartImage src={product.image} alt={product.name} className="h-full w-full" imgClassName="h-full w-full object-cover" />
              {product.badge && (<span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#111827] backdrop-blur">{product.badge}</span>)}
            </div>
            <div className="flex flex-col overflow-y-auto p-7 md:p-9">
              <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">Produktdetail</p>
              <h2 className="mt-2 text-[24px] font-bold leading-tight tracking-[-0.02em] text-[#111827]">{product.name}</h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-neutral-500">{product.short}</p>
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111827]">Variante / Maß</span>
                  <span className="text-[11px] tracking-wide text-neutral-400">{product.variations.length} verfügbar</span>
                </div>
                <div className="mt-3 space-y-2">
                  {product.variations.map((v, i) => (
                    <button key={v.ref} onClick={() => setVariant(i)} className={`relative flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all ${variant === i ? "border-[#111827] bg-[#111827]/[0.03]" : "border-neutral-200 hover:border-neutral-300"}`}>
                      <div>
                        <p className="text-[13.5px] font-semibold tracking-tight text-[#111827]">{v.label}</p>
                        <p className="text-[11.5px] tracking-wide text-neutral-400">{v.sub}</p>
                      </div>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${variant === i ? "border-[#111827] bg-[#111827] text-white" : "border-neutral-300 text-transparent"}`}><Icon.check className="h-3 w-3" /></span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-7 flex items-center gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111827]">Menge</span>
                <div className="flex items-center gap-1 rounded-full border border-neutral-200 p-1">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-neutral-100"><Icon.minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center text-[14px] font-semibold tabular-nums text-[#111827]">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-neutral-100"><Icon.plus className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-auto pt-8">
                <PrimaryButton full onClick={handleAdd} className="!py-3.5">
                  <AnimatePresence mode="wait" initial={false}>
                    {added ? (
                      <motion.span key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING} className="flex items-center gap-2"><Icon.check className="h-4 w-4" /> Zur Liste hinzugefügt</motion.span>
                    ) : (
                      <motion.span key="add" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={SPRING} className="flex items-center gap-2"><Icon.plus className="h-4 w-4" /> Zur Anfrage hinzufügen</motion.span>
                    )}
                  </AnimatePresence>
                </PrimaryButton>
                <p className="mt-3 text-center text-[11px] tracking-wide text-neutral-400">Preis auf Anfrage · Mengenrabatt für Fachkunden</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
