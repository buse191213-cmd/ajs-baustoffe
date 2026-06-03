"use client";
import React from "react";
import { motion, AnimatePresence, SPRING, Icon, GhostButton, SmartImage } from "./ui";

// ---- Hero -------------------------------------------------
export function Hero({ onExplore, onQuote, image }) {
  const word = { hidden: { y: "115%" }, show: { y: "0%", transition: { type: "spring", stiffness: 80, damping: 20 } } };
  const fadeUp = (delay) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { type: "spring", stiffness: 80, damping: 20, delay } });
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#15181d]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1e24] via-[#23282f] to-[#0e1013]" />
      <motion.img src={image} alt="Moderne Baustelle in der Dämmerung" initial={{ scale: 1.14 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: "easeOut" }} onError={(e) => { e.target.style.display = "none"; }} className="absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 mx-auto flex h-full max-w-[1240px] flex-col justify-center px-6 pt-[68px] lg:px-10">
        <motion.div {...fadeUp(0.15)} className="mb-6 flex items-center gap-2.5">
          <span className="h-px w-10 bg-[#FF7F50]" />
          <span className="text-[12px] font-semibold uppercase tracking-[0.34em] text-white/80">Führend im Baustoffhandel</span>
        </motion.div>
        <h1 className="max-w-[15ch] text-[clamp(2.8rem,7vw,6rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white">
          <span className="block overflow-hidden"><motion.span variants={word} initial="hidden" animate="show" className="inline-block">Wir liefern.</motion.span></span>
          <span className="block overflow-hidden"><motion.span variants={word} initial="hidden" animate="show" transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.12 }} className="inline-block">Sie bauen <span className="text-[#FF7F50]">Großes</span>.</motion.span></span>
        </h1>
        <motion.p {...fadeUp(0.5)} className="mt-7 max-w-[480px] text-[15px] leading-relaxed tracking-wide text-white/75">
          Trockenbau, Dämmung, Putz und Fassade — kuratiert für Profis. Stellen Sie Ihre Anfrageliste zusammen und erhalten Sie ein individuelles Angebot in 24 Stunden.
        </motion.p>
        <motion.div {...fadeUp(0.62)} className="mt-9 flex flex-wrap items-center gap-3.5">
          <motion.button onClick={onQuote} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="group inline-flex items-center gap-2 rounded-full bg-[#FF7F50] px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider text-white shadow-[0_14px_40px_-12px_rgba(255,127,80,0.7)]">
            Angebot anfordern<Icon.arrow className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
          <motion.button onClick={onExplore} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300, damping: 18 }} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 py-3.5 text-[13px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-colors hover:bg-white/15">
            Katalog ansehen
          </motion.button>
        </motion.div>
        <motion.div {...fadeUp(0.74)} className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-4">
          <HeroStat n="2.400+" l="Artikel ab Lager" />
          <span className="hidden h-9 w-px bg-white/20 sm:block" />
          <HeroStat n="24 Std" l="Angebot per E-Mail" accent="#4CAF50" />
          <span className="hidden h-9 w-px bg-white/20 sm:block" />
          <HeroStat n="seit 1998" l="Familienbetrieb" />
        </motion.div>
      </div>
      <motion.button onClick={onExplore} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white">
        <span className="text-[10px] uppercase tracking-[0.3em]">Mehr</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}><Icon.chevron className="h-5 w-5" /></motion.span>
      </motion.button>
    </section>
  );
}

function HeroStat({ n, l, accent }) {
  return (
    <div className="flex flex-col">
      <span className="text-[20px] font-bold tracking-tight text-white" style={accent ? { color: accent } : null}>{n}</span>
      <span className="text-[11px] tracking-wide text-white/55">{l}</span>
    </div>
  );
}

export function FeaturedCategories({ categories, onPick }) {
  return (
    <section id="kategorien" className="mx-auto max-w-[1240px] scroll-mt-24 px-6 py-20 lg:px-10">
      <SectionHead kicker="Sortiment" title="Drei Welten. Ein Lieferant." />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {categories.map((c, i) => (
          <motion.button key={c.id} onClick={() => onPick(c.id)} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ ...SPRING, delay: i * 0.08 }} className="group relative overflow-hidden rounded-[24px] border border-neutral-200 bg-white text-left">
            <div className="relative aspect-[4/3] overflow-hidden">
              <SmartImage src={c.image} alt={c.name} className="h-full w-full" imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="flex items-end justify-between p-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">{c.de}</p>
                <h3 className="mt-1.5 text-[20px] font-bold tracking-tight text-[#111827]">{c.name}</h3>
                <p className="mt-1 max-w-[230px] text-[12px] leading-relaxed text-neutral-500 opacity-70 transition-opacity duration-500 group-hover:opacity-100">{c.tagline}</p>
              </div>
              <span className="flex h-9 w-9 shrink-0 translate-y-1 items-center justify-center rounded-full bg-neutral-100 text-[#111827] transition-all duration-500 group-hover:translate-y-0 group-hover:bg-[#111827] group-hover:text-white"><Icon.arrow className="h-4 w-4" /></span>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

export function SectionHead({ kicker, title, right }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={SPRING} className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">{kicker}</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.05 }} className="mt-2 text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-tight tracking-[-0.02em] text-[#111827]">{title}</motion.h2>
      </div>
      {right}
    </div>
  );
}

export function Catalog({ products, categories, filter, onFilter, onOpen, onQuickAdd }) {
  const [query, setQuery] = React.useState("");
  const chips = [{ id: "all", name: "Alle" }, ...categories.map((c) => ({ id: c.id, name: c.name }))];

  const q = query.trim().toLowerCase();
  const filtered = products.filter((p) => {
    const inCat = filter === "all" || p.category === filter;
    if (!inCat) return false;
    if (!q) return true;
    const haystack = [
      p.name,
      p.short,
      p.badge || "",
      ...(p.variations || []).map((v) => v.label + " " + v.sub),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  return (
    <section id="katalog" className="scroll-mt-20 bg-[#F8F9FA] py-20">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <SectionHead kicker="Katalog" title="Produkte für jedes Gewerk." />
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2.5">
            {chips.map((c) => (<GhostButton key={c.id} active={filter === c.id} onClick={() => onFilter(c.id)}>{c.name}</GhostButton>))}
          </div>
          <div className="relative w-full lg:w-[300px]">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"><Icon.search className="h-[18px] w-[18px]" /></span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Produkt suchen …"
              className="w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-11 pr-9 text-[13px] tracking-wide text-[#111827] outline-none transition-colors placeholder:text-neutral-400 focus:border-[#111827]"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Suche löschen" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-[#111827]"><Icon.close className="h-4 w-4" /></button>
            )}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-neutral-200 bg-white py-16 text-center">
            <p className="text-[14px] font-semibold text-[#111827]">Keine Produkte gefunden</p>
            <p className="mt-1 text-[13px] text-neutral-500">{q ? <>Für „{query}“ gibt es keine Treffer.</> : "In dieser Kategorie sind noch keine Produkte vorhanden."}</p>
            {q && (<button onClick={() => setQuery("")} className="mt-4 rounded-full border border-neutral-200 px-5 py-2 text-[12px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400">Suche zurücksetzen</button>)}
          </div>
        ) : (
          <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (<ProductCard key={p.id} product={p} onOpen={onOpen} onQuickAdd={onQuickAdd} />))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

const ProductCard = React.forwardRef(function ProductCard({ product, onOpen, onQuickAdd }, ref) {
  return (
    <motion.article ref={ref} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={SPRING} className={`group relative flex flex-col overflow-hidden rounded-[22px] border bg-white ${product.featured ? "border-[#FF7F50] shadow-[0_18px_50px_-24px_rgba(255,127,80,0.55)] ring-1 ring-[#FF7F50]/30" : "border-neutral-200"}`}>
      <button onClick={() => onOpen(product)} className="relative aspect-[5/4] overflow-hidden bg-neutral-50 p-4 text-left">
        <SmartImage src={product.image} alt={product.name} className="h-full w-full !bg-transparent" imgClassName="h-full w-full object-contain object-center transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]" />
        <div className="absolute left-3.5 top-3.5 flex flex-col gap-1.5">
          {product.featured && (<span className="flex w-fit items-center gap-1 rounded-full bg-[#FF7F50] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">★ Empfehlung</span>)}
          {product.badge && (<span className="w-fit rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#111827] backdrop-blur">{product.badge}</span>)}
        </div>
      </button>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">{product.variations.length} Varianten</p>
        <h3 className="mt-1.5 text-[15px] font-semibold leading-snug tracking-tight text-[#111827]">{product.name}</h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-neutral-500">{product.short}</p>
        <div className="mt-5 flex items-center gap-2.5 pt-1">
          <motion.button onClick={() => onQuickAdd(product)} whileTap={{ scale: 0.96 }} transition={SPRING} className="group/btn flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#111827] py-2.5 text-[12px] font-medium tracking-wide text-white">
            <Icon.plus className="h-3.5 w-3.5" />Zur Anfrage
          </motion.button>
          <button onClick={() => onOpen(product)} className="flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2.5 text-[12px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400">Details</button>
        </div>
      </div>
    </motion.article>
  );
});

// ---- Instagram coverflow ----------------------------------
export function SocialFeed({ posts, settings }) {
  const [active, setActive] = React.useState(Math.min(2, Math.floor(posts.length / 2)));
  const handle = "@ajsbaustoffe";
  const igUrl = (settings && settings.socials && settings.socials.instagram) || "#";
  React.useEffect(() => { if (active > posts.length - 1) setActive(Math.max(0, posts.length - 1)); }, [posts.length]);

  // Load Instagram's embed script once so reel/post embeds can render.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("ig-embed-script")) {
      if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
      return;
    }
    const s = document.createElement("script");
    s.id = "ig-embed-script";
    s.async = true;
    s.src = "https://www.instagram.com/embed.js";
    document.body.appendChild(s);
  }, []);

  const go = (dir) => setActive((a) => Math.max(0, Math.min(posts.length - 1, a + dir)));
  if (!posts.length) return null;
  return (
    <section id="instagram" className="scroll-mt-24 overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={SPRING} className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">Instagram</motion.p>
            <motion.h2 initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.05 }} className="mt-2 text-[clamp(1.8rem,3.5vw,2.6rem)] font-bold leading-tight tracking-[-0.02em] text-[#111827]">Aus unserem Alltag.</motion.h2>
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium tracking-wide text-neutral-500 transition-colors hover:text-[#111827]"><Icon.instagram className="h-4 w-4" /> {handle}</a>
          </div>
          <div className="flex items-center gap-2.5">
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="hidden rounded-full bg-[#111827] px-5 py-2.5 text-[13px] font-medium tracking-wide text-white sm:inline-flex">Folgen</a>
            <div className="flex items-center gap-2">
              <button onClick={() => go(-1)} aria-label="Zurück" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-[#111827] transition-colors hover:border-[#111827]"><Icon.chevron className="h-5 w-5 rotate-90" /></button>
              <button onClick={() => go(1)} aria-label="Weiter" className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-[#111827] transition-colors hover:border-[#111827]"><Icon.chevron className="h-5 w-5 -rotate-90" /></button>
            </div>
          </div>
        </div>
        <div className="relative mt-10 h-[480px] select-none sm:h-[500px]">
          {posts.map((p, i) => (<CoverCard key={p.id} post={p} offset={i - active} isCenter={i - active === 0} igUrl={igUrl} onClick={() => (i - active === 0 ? null : setActive(i))} />))}
        </div>
        <div className="mt-2 flex items-center justify-center gap-2">
          {posts.map((p, i) => (<button key={p.id} onClick={() => setActive(i)} aria-label={"Beitrag " + (i + 1)} className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-[#111827]" : "w-2 bg-neutral-300 hover:bg-neutral-400"}`} />))}
        </div>
      </div>
    </section>
  );
}

// True if the string looks like a direct video file (mp4/webm/mov/m4v).
function isDirectVideo(src) {
  if (!src || typeof src !== "string") return false;
  const s = src.trim();
  return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(s);
}

// Convert an Instagram permalink (reel / p / tv) into its official embed URL.
// Returns null if the link is not a recognizable Instagram post URL.
function toInstagramEmbed(link) {
  if (!link || typeof link !== "string") return null;
  const m = link.match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (!m) return null;
  const shortcode = m[1];
  // captioned embed shows the caption bar; /embed alone is just the media.
  return `https://www.instagram.com/p/${shortcode}/embed`;
}

function CoverCard({ post, offset, isCenter, igUrl, onClick }) {
  const [liked, setLiked] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const videoRef = React.useRef(null);
  const abs = Math.abs(offset);
  const likes = post.likes + (liked ? 1 : 0);

  // Priority: a direct .mp4 plays in our own frame; otherwise fall back to the
  // official Instagram embed if the link is an IG permalink.
  const mp4 = post.video && isDirectVideo(post.videoSrc) ? post.videoSrc : null;
  const igEmbedUrl = post.video && !mp4 ? toInstagramEmbed(post.link) : null;
  const hasMp4 = !!mp4;
  const hasEmbed = !!igEmbedUrl;

  // Native video: auto play/pause as the card enters/leaves the center.
  React.useEffect(() => {
    if (!hasMp4) return;
    const v = videoRef.current;
    if (!v) return;
    if (isCenter) {
      const pr = v.play();
      if (pr && pr.then) pr.then(() => setPlaying(true)).catch(() => setPlaying(false));
      else setPlaying(true);
    } else {
      v.pause();
      try { v.currentTime = 0; } catch (e) {}
      setPlaying(false);
    }
  }, [isCenter, hasMp4, mp4]);

  // Collapse the IG embed whenever this card leaves the center position.
  React.useEffect(() => { if (!isCenter) setExpanded(false); }, [isCenter]);

  // After opening the embed, let Instagram's script turn the iframe into its player.
  React.useEffect(() => {
    if (!expanded) return;
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    }, 120);
    return () => clearTimeout(t);
  }, [expanded, igEmbedUrl]);

  const openEmbed = (e) => { e.stopPropagation(); if (isCenter && hasEmbed) setExpanded(true); };

  const GAP = 230, CARD = 330;
  const x = offset * GAP - CARD / 2;
  const scale = abs === 0 ? 1 : abs === 1 ? 0.88 : 0.78;
  const z = 30 - abs;
  const opacity = abs > 2 ? 0 : 1;
  const dark = abs === 0 ? 0 : abs === 1 ? 0.22 : 0.42;
  return (
    <motion.div initial={false} animate={{ x, scale, opacity }} transition={{ type: "spring", stiffness: 100, damping: 18 }} style={{ left: "50%", top: 0, width: CARD, zIndex: z, pointerEvents: abs > 2 ? "none" : "auto" }} className="absolute">
      <div onClick={onClick} className={`flex flex-col overflow-hidden rounded-[24px] border bg-white ${isCenter ? "cursor-default border-neutral-200 shadow-[0_30px_70px_-30px_rgba(17,24,39,0.45)]" : "cursor-pointer border-neutral-200/70 shadow-xl"}`}>
        {!(hasEmbed && expanded) && (
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white"><img src="/assets/ajs-mark.png" alt="AJS" className="h-6 w-6 object-contain" /></span>
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[14px] font-semibold tracking-tight text-[#111827]">{post.name || "AJS Baustoffe"}</p>
              <p className="text-[11px] tracking-wide text-neutral-400">{post.date}</p>
            </div>
          </div>
        )}
        <div className={`group/media relative overflow-hidden bg-neutral-100 ${hasEmbed && expanded ? "h-[560px]" : "aspect-square"}`}>
          {hasMp4 ? (
            <>
              <SmartImage src={post.image} alt="" className="h-full w-full" imgClassName="h-full w-full object-cover" />
              <video
                ref={videoRef}
                src={mp4}
                poster={post.image}
                muted
                loop
                playsInline
                preload="metadata"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
              />
              {!playing && (<span className="pointer-events-none absolute inset-0 flex items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-[#111827] shadow-lg backdrop-blur"><Icon.play className="ml-0.5 h-6 w-6" /></span></span>)}
              <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur">{playing && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF7F50]" />}Reel</span>
              <span className="pointer-events-none absolute inset-0 bg-[#1f2937] transition-opacity" style={{ opacity: dark }} />
            </>
          ) : hasEmbed && expanded ? (
            // Official Instagram embed — opens only after the user clicks play.
            <iframe
              src={igEmbedUrl}
              title={post.caption || "Instagram"}
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              scrolling="no"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
          ) : (
            <>
              <SmartImage src={post.image} alt="" className="h-full w-full" imgClassName="h-full w-full object-cover" />
              {post.video && (
                <button
                  onClick={openEmbed}
                  className={`absolute inset-0 flex items-center justify-center ${hasEmbed && isCenter ? "cursor-pointer" : "pointer-events-none"}`}
                  aria-label="Video abspielen"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/85 text-[#111827] shadow-lg backdrop-blur transition-transform duration-300 group-hover/media:scale-110"><Icon.play className="ml-0.5 h-6 w-6" /></span>
                </button>
              )}
              {post.video && (<span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur">Reel</span>)}
              <span className="pointer-events-none absolute inset-0 bg-[#1f2937] transition-opacity" style={{ opacity: dark }} />
            </>
          )}
        </div>
        {hasEmbed && expanded ? (
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-[11px] font-medium tracking-wide text-neutral-400">Instagram-Beitrag</span>
            <button onClick={(e) => { e.stopPropagation(); setExpanded(false); }} className="flex items-center gap-1.5 rounded-full border border-neutral-200 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#111827] transition-colors hover:border-neutral-400">
              <Icon.close className="h-3.5 w-3.5" /> Schließen
            </button>
          </div>
        ) : (
        <div className="flex flex-col px-5 py-4">
          <p className="text-[13px] leading-relaxed text-neutral-700" style={{ display: "-webkit-box", WebkitLineClamp: isCenter ? 3 : 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: isCenter ? "57px" : "auto" }}>
            {post.caption}{" "}
            {isCenter && (<a href={post.link || igUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="font-semibold text-[#FF7F50] hover:underline">Mehr</a>)}
          </p>
          <div className="mt-3 flex items-center gap-5 border-t border-neutral-100 pt-3">
            <button onClick={(e) => { e.stopPropagation(); if (isCenter) setLiked((v) => !v); }} className="flex items-center gap-1.5 text-[13px] font-semibold tabular-nums">
              <Icon.heart className={`h-[19px] w-[19px] transition-colors ${liked ? "text-red-500" : "text-neutral-300"}`} /><span className="text-[#111827]">{likes}</span>
            </button>
            <span className="flex items-center gap-1.5 text-[13px] font-semibold tabular-nums text-[#111827]"><Icon.comment className="h-[18px] w-[18px] text-neutral-400" /> {post.comments}</span>
            <a href={post.link || igUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="ml-auto text-neutral-300 transition-colors hover:text-[#111827]" aria-label="Teilen"><Icon.share className="h-[18px] w-[18px]" /></a>
          </div>
        </div>
        )}
      </div>
    </motion.div>
  );
}
