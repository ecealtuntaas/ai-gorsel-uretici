// Vercel sunucu fonksiyonu: tarayıcıdan gelen isteği alır,
// API anahtarını kullanarak Replicate'teki görsel modeline gider
// ve üretilen görselin adresini geri döndürür.
// Anahtar burada YAZILMAZ; Vercel'deki ortam değişkeninden okunur.

const MODEL = "black-forest-labs/flux-schnell"; // hızlı ve ucuz bir model

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST isteği kabul edilir." });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return res.status(500).json({
      error: "API anahtarı bulunamadı. Vercel → Settings → Environment Variables'a REPLICATE_API_TOKEN ekleyip yeniden deploy et.",
    });
  }

  const { prompt, aspectRatio } = req.body || {};
  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    return res.status(400).json({ error: "Lütfen en az birkaç kelimelik bir açıklama yaz." });
  }
  if (prompt.length > 1000) {
    return res.status(400).json({ error: "Açıklama çok uzun (en fazla 1000 karakter)." });
  }

  const allowedRatios = ["1:1", "9:16", "16:9", "3:4", "4:3"];
  const ratio = allowedRatios.includes(aspectRatio) ? aspectRatio : "1:1";

  try {
    const response = await fetch(`https://api.replicate.com/v1/models/${MODEL}/predictions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait", // sonucu beklemeden dönme, görsel hazır olunca dön
      },
      body: JSON.stringify({
        input: {
          prompt: prompt.trim(),
          aspect_ratio: ratio,
          output_format: "webp",
          num_outputs: 1,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.detail || "Model isteği başarısız oldu.",
      });
    }

    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    if (!imageUrl) {
      return res.status(502).json({ error: "Görsel henüz hazır değil, tekrar dene." });
    }

    return res.status(200).json({ imageUrl });
  } catch (err) {
    return res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
}
