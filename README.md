# AJS Baustoffe — Website (Next.js + PostgreSQL)

Trockenbau, Dämmung ve Fassade için tam donanımlı kurumsal site + admin paneli.
Önceki statik prototipin gerçek bir full-stack uygulamaya dönüştürülmüş hâli.

## Teknoloji

- **Next.js 14** (App Router) — frontend + API tek projede
- **PostgreSQL + Prisma** — veritabanı ve ORM
- **bcrypt + JWT (jose)** — gerçek admin kimlik doğrulama
- **Resend** — e-posta bildirimleri (opsiyonel; soyutlanmış)
- **Tailwind + Framer Motion** — orijinal tasarım birebir korundu

## Kurulum

### 1) Bağımlılıklar
```bash
npm install
```

### 2) Ortam değişkenleri
`.env.example` dosyasını `.env` olarak kopyalayın ve doldurun:
```bash
cp .env.example .env
```
- `DATABASE_URL` — PostgreSQL bağlantısı (yerel ya da Neon/Supabase/Railway gibi ücretsiz bir servis)
- `AUTH_SECRET` — oturum imzalama anahtarı. Üretmek için: `openssl rand -base64 32`
- `RESEND_API_KEY` — (opsiyonel) boş bırakılırsa e-posta atlanır, anfrageler yine DB'ye yazılır
- `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` — ilk admin hesabı

### 3) Veritabanı şeması + örnek veri
```bash
npm run db:push     # şemayı veritabanına uygular
npm run db:seed     # kategoriler, ürünler, örnek anfrageler ve admin kullanıcı
```

### 4) Geliştirme sunucusu
```bash
npm run dev
```
- Site: http://localhost:3000
- Admin: http://localhost:3000/admin  (seed'deki e-posta + şifre ile giriş)

## Production / Deploy (Vercel)

1. Projeyi bir Git deposuna gönderin.
2. Vercel'de yeni proje oluşturun, repoyu bağlayın.
3. Environment Variables bölümüne `.env` değerlerini girin.
4. Bir PostgreSQL bağlantısı kullanın (Vercel Postgres, Neon, Supabase).
5. Deploy. Build sırasında `prisma generate` otomatik çalışır.
6. İlk kez: deploy sonrası bir kez `npm run db:push && npm run db:seed`
   (ya da Vercel'de bir migration adımı tanımlayın).

### Görsel yüklemeleri hakkında
Admin panelden yüklenen görseller `public/uploads/` altına yazılır. **Vercel'in
dosya sistemi geçicidir**, bu yüzden production'da kalıcı yükleme için bir nesne
deposu (S3 / Cloudflare R2 / Vercel Blob) önerilir. `src/lib/upload.js` içindeki
`persistImage` fonksiyonunu değiştirmeniz yeterli. http(s) ile başlayan görsel
URL'leri olduğu gibi korunur (örn. Unsplash linkleri sorunsuz çalışır).

## E-posta (Resend)
1. https://resend.com üzerinden ücretsiz hesap açın, API Key alın.
2. Gönderen alan adınızı doğrulayın (DNS kayıtları).
3. `.env` içine `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` girin.
SMTP kullanmak isterseniz `src/lib/mail.js` içindeki `send()` fonksiyonunu
Nodemailer ile değiştirin — route'lara dokunmaya gerek yok.

## Yararlı komutlar
| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production derlemesi |
| `npm run start` | Derlenmiş sürümü çalıştır |
| `npm run db:push` | Şemayı DB'ye uygula |
| `npm run db:seed` | Örnek verileri yükle |
| `npm run db:studio` | Prisma Studio (görsel DB yöneticisi) |

## Proje yapısı
```
prisma/
  schema.prisma       # veri modelleri
  seed.mjs            # başlangıç verisi
src/
  app/
    page.js           # anasayfa (public)
    admin/page.js     # admin kabuğu
    impressum, datenschutz   # yasal sayfalar
    api/
      auth/           # login, logout, me
      public/         # catalog, quote, contact
      admin/          # products, categories, instagram, quotes, settings, stats
  components/
    ui.jsx, Navbar, Sections, ProductModal, Footer
    admin/AdminLogin, AdminPanel
  lib/
    prisma, auth, mail, api, upload, client
```

## Notlar
- Tüm site metinleri Almanca, admin paneli de Almanca.
- Anfrage referansları `AJS-2042` formatında otomatik artar.
- Admin'de kategori silindiğinde, o kategoriye bağlı ürünler de silinir (Cascade).
