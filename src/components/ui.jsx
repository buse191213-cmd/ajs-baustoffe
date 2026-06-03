"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export { motion, AnimatePresence };

export const SPRING = { type: "spring", stiffness: 100, damping: 15 };
export const SPRING_SOFT = { type: "spring", stiffness: 120, damping: 18 };

export function Logo({ onClick, light, navMarker }) {
  return (
    <button onClick={onClick} className="group flex items-center select-none" aria-label="AJS Baustoffe — Startseite" {...(navMarker ? { "data-nav-logo": "" } : {})}>
      <img
        src={light ? "/assets/ajs-logo-white.png" : "/assets/ajs-logo-dark.png"}
        alt="AJS Baustoffe"
        className="h-9 w-auto transition-transform duration-500 group-hover:scale-[1.03]"
      />
    </button>
  );
}

export const Icon = {
  cart: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21 8H6" /><circle cx="9.5" cy="20.5" r="1.1" /><circle cx="18" cy="20.5" r="1.1" /></svg>),
  close: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>),
  arrow: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M12 5v14M5 12h14" /></svg>),
  minus: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}><path d="M5 12h14" /></svg>),
  check: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 12.5l5 5L20 6.5" /></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" /></svg>),
  pencil: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 17v3zM14 7l3 3" /></svg>),
  pin: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>),
  grid: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="4" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" /></svg>),
  chart: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6" /></svg>),
  inbox: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 13l2.5-7h11L20 13M4 13v5h16v-5M4 13h5l1.2 2h3.6l1.2-2h5" /></svg>),
  box: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zM4 7.5l8 4.5 8-4.5M12 12v9" /></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>),
  user: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" /></svg>),
  upload: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 16V4M7 9l5-5 5 5M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" /></svg>),
  image: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M5 17l4.5-4.5L13 16l3-3 3 3" /></svg>),
  layers: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" /></svg>),
  logout: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M10 12h10m0 0l-3-3m3 3l-3 3" /></svg>),
  cog: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>),
  phone: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" /></svg>),
  mail: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M4 7l8 6 8-6" /></svg>),
  chevron: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 9l6 6 6-6" /></svg>),
  search: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>),
  heart: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 21s-7.5-4.6-10-9.3C.6 8.5 2 5 5.3 5c2 0 3.3 1.1 4.2 2.3l.5.7.5-.7C11.4 6.1 12.7 5 14.7 5 18 5 19.4 8.5 22 11.7 19.5 16.4 12 21 12 21z" /></svg>),
  comment: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 21l2-5.6A8.5 8.5 0 1 1 21 11.5z" /></svg>),
  play: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.5v13l11-6.5z" /></svg>),
  share: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" /></svg>),
  linkedin: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 22 10.9 22 14.3V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21H9z" /></svg>),
  instagram: (p) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" /></svg>),
  xing: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M7 6H4l2.8 4.9L3 18h3l3.8-7.1zM18.5 2.5h-3l-6 10.7 3.9 6.8h3l-3.9-6.8z" /></svg>),
  youtube: (p) => (<svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.25 5 12 5 12 5s-6.25 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.75 1.77C5.75 19 12 19 12 19s6.25 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3z" /></svg>),
};

export function PrimaryButton({ children, onClick, className = "", full, type = "button", disabled }) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.025 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={SPRING}
      className={`group inline-flex items-center justify-center gap-2 rounded-full bg-[#111827] px-6 py-3 text-[13px] font-medium tracking-wide text-white ${full ? "w-full" : ""} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function GhostButton({ children, onClick, active, className = "" }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      transition={SPRING}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium tracking-wide transition-colors ${
        active ? "border-[#111827] bg-[#111827] text-white" : "border-neutral-200 bg-white text-[#111827] hover:border-neutral-400"
      } ${className}`}
    >
      {children}
    </motion.button>
  );
}

// Image with graceful fallback to a refined architectural placeholder.
export function SmartImage({ src, alt, className, imgClassName, tone = 0 }) {
  const [state, setState] = React.useState("loading");
  React.useEffect(() => {
    setState("loading");
    const t = setTimeout(() => setState((s) => (s === "ok" ? s : "fail")), 5000);
    return () => clearTimeout(t);
  }, [src]);
  const tones = ["from-neutral-200 to-neutral-100", "from-stone-200 to-neutral-100", "from-slate-200 to-neutral-100", "from-zinc-200 to-stone-100"];
  return (
    <div className={`relative overflow-hidden bg-neutral-100 ${className || ""}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone % tones.length]}`}>
        <div className="absolute inset-0 opacity-[0.5]" style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(17,24,39,0.05) 0 1px, transparent 1px 22px)" }} />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded-[3px] bg-[#111827]/80" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#111827]/45">AJS Material</span>
        </div>
      </div>
      {state !== "fail" && (
        <img src={src} alt={alt} loading="lazy" onLoad={() => setState("ok")} onError={() => setState("fail")} className={`relative ${imgClassName} ${state === "ok" ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
}
