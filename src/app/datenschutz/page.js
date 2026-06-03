export const metadata = { title: "Datenschutzerklärung — AJS Baustoffe" };

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-[760px] px-6 py-20 lg:px-10">
      <a href="/" className="text-[12px] font-medium tracking-wide text-neutral-400 hover:text-[#111827]">← Zur Startseite</a>
      <h1 className="mt-6 text-[32px] font-bold tracking-[-0.02em] text-[#111827]">Datenschutzerklärung</h1>
      <div className="mt-8 space-y-6 text-[14px] leading-relaxed text-neutral-600">
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">1. Verantwortlicher</h2>
          <p className="mt-2">AJS Baustoffe, Industriestraße 12, 86150 Augsburg, E-Mail: info@ajsbaustoffe.de</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
          <p className="mt-2">Wenn Sie über das Kontakt- oder Anfrageformular mit uns Kontakt aufnehmen, verarbeiten wir die von Ihnen angegebenen Daten (Name, E-Mail-Adresse, ggf. Telefonnummer, Firma sowie Inhalt der Anfrage) ausschließlich zur Bearbeitung Ihres Anliegens. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und f DSGVO.</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">3. Speicherdauer</h2>
          <p className="mt-2">Wir speichern Ihre Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">4. Ihre Rechte</h2>
          <p className="mt-2">Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch. Zudem steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu.</p>
        </section>
        <section>
          <h2 className="text-[15px] font-bold text-[#111827]">5. Externe Dienste</h2>
          <p className="mt-2">Zur Anzeige unseres Standorts wird Google Maps eingebunden. Zum Versand von Benachrichtigungen kann ein E-Mail-Dienstleister eingesetzt werden. Dabei können Daten an die jeweiligen Anbieter übertragen werden.</p>
        </section>
        <p className="text-[12px] text-neutral-400">Hinweis: Dieser Text ist eine Vorlage und ersetzt keine Rechtsberatung. Bitte lassen Sie Ihre Datenschutzerklärung vor Veröffentlichung fachlich prüfen.</p>
      </div>
    </main>
  );
}
