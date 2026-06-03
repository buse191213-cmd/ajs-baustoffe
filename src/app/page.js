"use client";
import React from "react";
import { motion, AnimatePresence, SPRING, Icon } from "@/components/ui";
import { Navbar, CartDrawer } from "@/components/Navbar";
import { Hero, FeaturedCategories, Catalog, SocialFeed } from "@/components/Sections";
import { ProductModal } from "@/components/ProductModal";
import { Footer, TrustStrip, ContactSection } from "@/components/Footer";
import { IntroOverlay } from "@/components/IntroOverlay";
import { api } from "@/lib/client";

export default function HomePage() {
  const [data, setData] = React.useState(null);
  const [loadError, setLoadError] = React.useState("");
  const [cart, setCart] = React.useState(() => {
    // Read the saved cart synchronously on first render so it's never empty
    // before an effect runs (which could overwrite localStorage with []).
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem("ajs_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const [modal, setModal] = React.useState(null);
  const [scrolled, setScrolled] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);

  // Load catalog once.
  React.useEffect(() => {
    api.get("/api/public/catalog").then(setData).catch((e) => setLoadError(e.message));
  }, []);

  // Persist cart whenever it changes. (Initial value is read synchronously in
  // the useState initializer above, so there's no empty-overwrite race.)
  React.useEffect(() => {
    try { localStorage.setItem("ajs_cart", JSON.stringify(cart)); } catch {}
  }, [cart]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 90);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const addToCart = (product, variation, qty = 1) => {
    const key = product.id + "|" + variation.ref;
    setCart((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
      return [...prev, { key, id: product.id, name: product.name, image: product.image, variation: variation.label + " · " + variation.sub, ref: variation.ref, qty }];
    });
    showToast(product.name + " hinzugefügt");
  };
  const quickAdd = (product) => addToCart(product, product.variations[0], 1);
  const changeQty = (key, d) => setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, i.qty + d) } : i)));
  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: "smooth" });
  };
  const handleNav = (id) => {
    if (id === "home") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    scrollToId(id);
  };
  const pickCategory = (id) => { setFilter(id); setTimeout(() => scrollToId("katalog"), 40); };

  const submitQuote = async (contact) => {
    if (!cart.length || submitting) return;
    if (!contact || !contact.contactName || !contact.contactEmail) return;
    setSubmitting(true);
    try {
      const res = await api.post("/api/public/quote", {
        contactName: contact.contactName,
        contactEmail: contact.contactEmail,
        contactPhone: contact.contactPhone || undefined,
        lines: cart.map((i) => ({ name: i.name, variation: i.variation, qty: i.qty })),
      });
      setCartOpen(false);
      setCart([]);
      showToast(`Anfrage ${res.reference} gesendet · Antwort in 24 Std`);
    } catch (e) {
      showToast("Fehler: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="text-[15px] font-semibold text-[#111827]">Inhalte konnten nicht geladen werden.</p>
          <p className="mt-1 text-[13px] text-neutral-500">{loadError}</p>
          <p className="mt-3 text-[12px] text-neutral-400">Ist die Datenbank eingerichtet und der Seed ausgeführt?</p>
        </div>
      </div>
    );
  }
  const { categories, products, instagram, settings } = data || {};

  return (
    <div className="min-h-screen bg-white text-[#111827] antialiased">
      <IntroOverlay />
      {data && (
        <>
          <Navbar onNav={handleNav} onOpenCart={() => setCartOpen(true)} cartCount={cartCount} view="home" scrolled={scrolled} />
          <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
            <Hero onExplore={() => scrollToId("katalog")} onQuote={() => scrollToId("kontakt")} image={settings?.heroImage} />
            <TrustStrip />
            <FeaturedCategories categories={categories} onPick={pickCategory} />
            <Catalog products={products} categories={categories} filter={filter} onFilter={setFilter} onOpen={setModal} onQuickAdd={quickAdd} />
            <SocialFeed posts={instagram} settings={settings} />
            <ContactSection settings={settings} onToast={showToast} />
            <Footer settings={settings} onExplore={() => scrollToId("katalog")} />
          </motion.main>
        </>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cart} onQty={changeQty} onRemove={removeItem} onSubmit={submitQuote} submitting={submitting} />
      <ProductModal product={modal} onClose={() => setModal(null)} onAdd={addToCart} />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }} transition={SPRING} className="fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-[#111827] py-3 pl-4 pr-5 text-white shadow-xl">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15"><Icon.check className="h-3 w-3" /></span>
            <span className="text-[12.5px] font-medium tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
