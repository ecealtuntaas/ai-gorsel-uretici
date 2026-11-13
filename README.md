# Hayal Et ✦ — AI Görsel Üretici

Yazdığın açıklamadan görsel üreten basit bir web sitesi. Görseller Replicate'teki **FLUX schnell** modeliyle üretilir, site Vercel'de çalışır.

## Klasör yapısı

```
ai-gorsel-uretici/
├── index.html        ← sitenin arayüzü
├── api/
│   └── generate.js   ← sunucu fonksiyonu (API anahtarını burada kullanır)
├── package.json
├── .gitignore
└── README.md
```

## Kurulum (yaklaşık 10 dakika)

1. **Replicate hesabı aç:** replicate.com → GitHub ile giriş yap → Billing'den ödeme yöntemi ekle.
   FLUX schnell ile görsel başına maliyet çok düşük (yaklaşık 0,3 sent). Yine de bir harcama limiti koy.
2. **API anahtarını al:** replicate.com/account/api-tokens → yeni token oluştur (`r8_...` ile başlar). Kopyala.
3. **GitHub'a yükle:** Yeni bir repo aç → "Add file" → "Upload files" → bu klasörün **içindekileri** sürükle (api klasörü dahil) → "Commit changes".
4. **Vercel'e bağla:** vercel.com → "Continue with GitHub" → "Add New" → "Project" → repoyu seç.
5. **Anahtarı ekle:** Deploy ekranında (veya sonradan Settings → Environment Variables) şunu ekle:
   - Name: `REPLICATE_API_TOKEN`
   - Value: kopyaladığın `r8_...` anahtarı
6. **Deploy** et. Anahtarı sonradan eklediysen Deployments → son deploy → "Redeploy" yap.

Siten `proje-adi.vercel.app` adresinde açılır.

## Güvenlik

- API anahtarını **hiçbir dosyaya yazma**. Repo public olduğu için herkes görebilir. Anahtar sadece Vercel ayarlarında durmalı.
- Linki herkese açık paylaşacaksan Replicate'te aylık harcama limiti koy.

## Değiştirmek istersen

- **Modeli değiştirmek:** `api/generate.js` içindeki `MODEL` satırı. Örneğin daha kaliteli ama daha pahalı bir model için `black-forest-labs/flux-dev`.
- **Stilleri değiştirmek:** `index.html` içindeki `data-style` olan butonlar. Her stil, açıklamanın sonuna eklenen bir metin.
- **Renkler:** `index.html`in başındaki `:root` bölümü.
