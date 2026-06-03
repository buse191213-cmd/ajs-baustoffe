"use client";
import React from "react";

export function IntroOverlay() {
  const [start, setStart] = React.useState(false);  // hem logo hem blur birlikte başlar
  const [gone, setGone] = React.useState(false);

  React.useEffect(() => {
    const t1 = setTimeout(() => setStart(true), 700);   // logo + blur AYNI ANDA başlar
    const t2 = setTimeout(() => setGone(true), 1900);   // animasyon bitince kalk
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  const dockedTransform = "translate(calc(-50vw + 13rem), calc(-50vh + 2.4rem)) scale(0.32)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Blur — logo kaymaya başlarken AYNI ANDA temizlenir, AYNI süre */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          opacity: start ? 0 : 1,
          transition: "opacity 1s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      {/* Logo — blur ile AYNI ANDA, AYNI süre boyunca kayar */}
      <img
        src="/assets/ajs-logo-dark.png"
        alt="AJS Baustoffe"
        style={{
          position: "relative",
          height: "7rem",
          width: "auto",
          transformOrigin: "center center",
          transform: start ? dockedTransform : "translate(0,0) scale(1)",
          opacity: 1,
          transition: "transform 1s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}