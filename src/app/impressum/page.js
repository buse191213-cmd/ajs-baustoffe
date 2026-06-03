export const metadata = { title: "Impressum — AJS Baustoffe" };

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-20 lg:px-10">
      <a href="/" className="text-[12px] font-medium tracking-wide text-neutral-400 hover:text-[#111827]">← Zur Startseite</a>
      <h1 className="mt-6 text-[32px] font-bold tracking-[-0.02em] text-[#111827]">Impressum</h1>
      <div className="mt-8 space-y-6 text-[14px] leading-relaxed text-neutral-600">
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">Angaben gemäß § 5 DDG</h2>
          <p className="mt-2">AJS Baustoffe<br />Industriestraße 12<br />86150 Augsburg</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">Vertreten durch</h2>
          <p className="mt-2">Geschäftsführung: [Name eintragen]</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">Kontakt</h2>
          <p className="mt-2">Telefon: +49 821 4567890<br />E-Mail: info@ajsbaustoffe.de</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">Registereintrag</h2>
          <p className="mt-2">Eintragung im Handelsregister.<br />Registergericht: [eintragen]<br />Registernummer: [eintragen]</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">Umsatzsteuer-ID</h2>
          <p className="mt-2">Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: [eintragen]</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p className="mt-2">[Name und Anschrift eintragen]</p>
        </section>
        <p className="text-[12px] text-neutral-400">Hinweis: Bitte ersetzen Sie die mit [ ] markierten Platzhalter durch Ihre tatsächlichen Angaben.</p>
      </div>
    </main>
  );
}
