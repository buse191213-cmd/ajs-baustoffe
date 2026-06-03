import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = {
  trockenbau: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
  daemmstoffe: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=80",
  putzFassade: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  marble: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
  concrete: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80",
  insulation: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?auto=format&fit=crop&w=1200&q=80",
  panel: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=1200&q=80",
  cement: "https://images.unsplash.com/photo-1607400201515-c2c41c07d307?auto=format&fit=crop&w=1200&q=80",
  facade2: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80",
  drywall2: "https://images.unsplash.com/photo-1503594384566-461fe158e797?auto=format&fit=crop&w=1200&q=80",
  texture: "https://images.unsplash.com/photo-1604147706283-d7119b5b822c?auto=format&fit=crop&w=1200&q=80",
  hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2000&q=80",
};

const CATEGORIES = [
  { slug: "trockenbau", name: "Trockenbau", de: "Drywall systems", tagline: "Gipskartonplatten, Profile und Systemlösungen.", image: IMG.trockenbau, sortOrder: 0 },
  { slug: "daemmstoffe", name: "Dämmstoffe", de: "Insulation", tagline: "Thermische und akustische Hochleistungsdämmung.", image: IMG.daemmstoffe, sortOrder: 1 },
  { slug: "putz-fassade", name: "Putz & Fassade", de: "Plaster & Facade", tagline: "Mineralputze und Fassadensysteme.", image: IMG.putzFassade, sortOrder: 2 },
];

const PRODUCTS = [
  { slug: "trockenbau", name: "Knauf Diamant Hartgipsplatte", short: "Schlagfeste Hochleistungsplatte für strapazierte Wände.", image: IMG.drywall2, badge: "Bestseller",
    variations: [["12.5 mm · 2000×1250", "12.5 mm", "2000 × 1250 mm"], ["15 mm · 2000×1250", "15 mm", "2000 × 1250 mm"], ["18 mm · 2600×1250", "18 mm", "2600 × 1250 mm"]] },
  { slug: "trockenbau", name: "CW Ständerprofil 0.6 mm", short: "Verzinktes Stahlprofil für tragende Trennwände.", image: IMG.panel, badge: null,
    variations: [["CW 50 · 3.0 m", "CW 50", "Länge 3.00 m"], ["CW 75 · 4.0 m", "CW 75", "Länge 4.00 m"], ["CW 100 · 4.0 m", "CW 100", "Länge 4.00 m"]] },
  { slug: "trockenbau", name: "Rigips Die Feuerschutzplatte", short: "Brandschutzplatte F30–F90 für Decken und Schächte.", image: IMG.texture, badge: null,
    variations: [["12.5 mm · F30", "12.5 mm", "Klasse F30"], ["15 mm · F60", "15 mm", "Klasse F60"]] },
  { slug: "daemmstoffe", name: "Isover Mineralwolle Klemmfilz", short: "Flexibler Klemmfilz für Dach- und Wanddämmung.", image: IMG.insulation, badge: "λ 0.032",
    variations: [["100 mm · 5.0 m²", "100 mm", "Paket 5.0 m²"], ["140 mm · 3.6 m²", "140 mm", "Paket 3.6 m²"], ["200 mm · 2.6 m²", "200 mm", "Paket 2.6 m²"]] },
  { slug: "daemmstoffe", name: "EPS Fassadendämmplatte WLG 035", short: "Weißer Hartschaum für WDVS-Systeme.", image: IMG.daemmstoffe, badge: null,
    variations: [["60 mm · 0.5 m²", "60 mm", "Platte 0.5 m²"], ["100 mm · 0.5 m²", "100 mm", "Platte 0.5 m²"], ["140 mm · 0.5 m²", "140 mm", "Platte 0.5 m²"]] },
  { slug: "daemmstoffe", name: "XPS Perimeterdämmung", short: "Druckfeste Dämmung für Keller und Sockel.", image: IMG.concrete, badge: null,
    variations: [["50 mm · 0.75 m²", "50 mm", "Platte 0.75 m²"], ["80 mm · 0.75 m²", "80 mm", "Platte 0.75 m²"]] },
  { slug: "putz-fassade", name: "Silikatputz Edelkratz 2.0", short: "Mineralischer Oberputz, diffusionsoffen und matt.", image: IMG.putzFassade, badge: "Mineral",
    variations: [["Korn 1.5 · 25 kg", "Korn 1.5 mm", "Eimer 25 kg"], ["Korn 2.0 · 25 kg", "Korn 2.0 mm", "Eimer 25 kg"], ["Korn 3.0 · 25 kg", "Korn 3.0 mm", "Eimer 25 kg"]] },
  { slug: "putz-fassade", name: "Klebe- & Armierungsmörtel", short: "Grauer Mörtel für WDVS-Verklebung und Armierung.", image: IMG.cement, badge: null,
    variations: [["25 kg · grau", "25 kg Sack", "ca. 5 m²/Sack"]] },
  { slug: "putz-fassade", name: "Faserzement Fassadenplatte", short: "Durchgefärbte Platte für hinterlüftete Fassaden.", image: IMG.facade2, badge: null,
    variations: [["8 mm · 1250×2500 · Anthrazit", "8 mm · Anthrazit", "1250 × 2500 mm"], ["8 mm · 1250×2500 · Sandbeige", "8 mm · Sandbeige", "1250 × 2500 mm"], ["12 mm · 1250×3050 · Basalt", "12 mm · Basalt", "1250 × 3050 mm"]] },
];

// Note: captions are German-only here (Turkish leftover from the prototype removed).
const INSTAGRAM = [
  { caption: "Dämmen lohnt sich: bis zu 30 % Heizkosten sparen mit unseren Klemmfilz-Systemen. 🌿", image: IMG.daemmstoffe, video: false, likes: 244, comments: 11 },
  { caption: "Hinterlüftete Faserzement-Fassaden für Langlebigkeit und Design. ▶️", image: IMG.facade2, video: false, likes: 188, comments: 6 },
  { caption: "Unvergleichliche Eleganz für moderne Innenräume — handgefertigter Marmor für zeitlose Klasse.", image: IMG.marble, video: false, likes: 155, comments: 8 },
  { caption: "Trockenbau-Tutorial: saubere Eckprofile in 3 Schritten. Reel ansehen ▶️", image: IMG.drywall2, video: false, likes: 521, comments: 37 },
  { caption: "Neue Fassadensysteme im Showroom – diffusionsoffen und in 24 Farbtönen. #Fassade", image: IMG.putzFassade, video: false, likes: 312, comments: 18 },
];

const SAMPLE_QUOTES = [
  { reference: "AJS-2041", company: "Hochbau Meyer GmbH", contactName: "Thomas Meyer", contactRole: "Bauleiter", contactPhone: "+49 89 1234567", contactEmail: "t.meyer@hochbau-meyer.de", city: "München", status: "NEU",
    note: "Lieferung bitte gebündelt auf eine Baustelle (München-Riem). Termin KW 24, Anlieferung mit Kran erforderlich.",
    lines: [["Knauf Diamant Hartgipsplatte", "12.5 mm · 2000×1250", 120], ["CW Ständerprofil 0.6 mm", "CW 75 · 4.0 m", 60], ["Isover Mineralwolle Klemmfilz", "100 mm · 5.0 m²", 24]] },
  { reference: "AJS-2040", company: "Fassaden Krüger", contactName: "Sandra Krüger", contactRole: "Inhaberin", contactPhone: "+49 821 998877", contactEmail: "info@fassaden-krueger.de", city: "Augsburg", status: "IN_BEARBEITUNG",
    note: "Bitte Muster der Faserzementplatte in Anthrazit beilegen.",
    lines: [["Faserzement Fassadenplatte", "8 mm · Anthrazit", 40], ["Klebe- & Armierungsmörtel", "25 kg Sack", 30], ["Silikatputz Edelkratz 2.0", "Korn 2.0 · 25 kg", 18]] },
  { reference: "AJS-2039", company: "Innenausbau Polat", contactName: "Erkan Polat", contactRole: "Projektleiter", contactPhone: "+49 711 445566", contactEmail: "e.polat@innenausbau-polat.de", city: "Stuttgart", status: "ANGEBOT_GESENDET",
    note: "Großprojekt Bürogebäude — Abruf in 3 Tranchen geplant. Angebot mit Staffelpreisen erbeten.",
    lines: [["Rigips Die Feuerschutzplatte", "15 mm · F60", 200], ["CW Ständerprofil 0.6 mm", "CW 100 · 4.0 m", 150], ["Knauf Diamant Hartgipsplatte", "18 mm · 2600×1250", 90]] },
  { reference: "AJS-2037", company: "Sanierung Nord eK", contactName: "Julia Hofmann", contactRole: "Einkauf", contactPhone: "+49 911 556677", contactEmail: "j.hofmann@sanierung-nord.de", city: "Nürnberg", status: "ABGESCHLOSSEN",
    note: "Lieferung erfolgt, Rechnung versandt. Folgeauftrag wahrscheinlich.",
    lines: [["XPS Perimeterdämmung", "80 mm · 0.75 m²", 64], ["Silikatputz Edelkratz 2.0", "Korn 1.5 · 25 kg", 20]] },
];

async function main() {
  // Admin user
  const email = process.env.SEED_ADMIN_EMAIL || "admin@ajsbaustoffe.de";
  const pw = process.env.SEED_ADMIN_PASSWORD || "change-me";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, name: "S. Karahan", passwordHash: await bcrypt.hash(pw, 10) },
  });
  console.log("✓ Admin:", email);

  // Settings (singleton)
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      companyName: "AJS Baustoffe",
      tagline: "Ihr Fachhandel für Trockenbau, Dämmung und Fassade. Persönliche Beratung, schnelle Angebote, zuverlässige Lieferung.",
      phone: "+49 821 4567890", email: "info@ajsbaustoffe.de",
      street: "Industriestraße 12", zip: "86150", city: "Augsburg",
      linkedin: "https://www.linkedin.com/", instagram: "https://www.instagram.com/",
      xing: "https://www.xing.com/", youtube: "https://www.youtube.com/",
      heroImage: IMG.hero,
    },
  });
  console.log("✓ Settings");

  // Categories + products
  const catBySlug = {};
  for (const c of CATEGORIES) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug }, update: {}, create: c,
    });
    catBySlug[c.slug] = cat.id;
  }
  console.log("✓ Categories:", CATEGORIES.length);

  // Clear and reinsert products idempotently
  await prisma.product.deleteMany({});
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    await prisma.product.create({
      data: {
        name: p.name, short: p.short, image: p.image, badge: p.badge,
        categoryId: catBySlug[p.slug], sortOrder: i,
        variations: { create: p.variations.map(([ref, label, sub], j) => ({ ref, label, sub, sortOrder: j })) },
      },
    });
  }
  console.log("✓ Products:", PRODUCTS.length);

  // Instagram
  await prisma.instagramPost.deleteMany({});
  for (let i = 0; i < INSTAGRAM.length; i++) {
    await prisma.instagramPost.create({ data: { ...INSTAGRAM[i], sortOrder: i } });
  }
  console.log("✓ Instagram:", INSTAGRAM.length);

  // Sample quotes
  await prisma.quoteRequest.deleteMany({});
  for (const q of SAMPLE_QUOTES) {
    const { lines, ...rest } = q;
    await prisma.quoteRequest.create({
      data: { ...rest, lines: { create: lines.map(([name, variation, qty]) => ({ name, variation, qty })) } },
    });
  }
  console.log("✓ Quotes:", SAMPLE_QUOTES.length);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
