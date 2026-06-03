import "./globals.css";

export const metadata = {
  title: "AJS Baustoffe — Trockenbau, Dämmung & Fassade",
  description:
    "Ihr Fachhandel für Trockenbau, Dämmung und Fassade. Persönliche Beratung, schnelle Angebote, zuverlässige Lieferung.",
  icons: { icon: "/assets/ajs-mark.png" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
