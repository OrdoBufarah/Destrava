// Destrava — voz do Jarvis (função serverless da Vercel).
// Gera a fala com a IA de voz do Google (Gemini TTS) e devolve um áudio WAV.
// Uma voz só, natural, igual em qualquer aparelho. Usa a mesma GEMINI_API_KEY.

const TTS_MODEL = process.env.DESTRAVA_TTS_MODEL || "gemini-3.1-flash-tts-preview";
const DEFAULT_VOICE = process.env.DESTRAVA_VOICE || "Puck";
const VOICES = ["Puck", "Charon", "Achird", "Sadaltager", "Kore", "Aoede", "Sulafat", "Leda", "Zephyr", "Laomedeia", "Autonoe", "Despina"];

// Estilos fixos guardados no servidor (usados pelo modo GET, que fica em cache na CDN da Vercel).
const STYLES = {
  hero: "Você é o Super Benjamin, um super-herói MENINO de uns 7 anos que ensina inglês para crianças brasileiras. Use uma voz bem jovem, leve e aguda, de criança alegre, sorrindo, cheia de energia, devagar e bem clara. As partes em português têm sotaque brasileiro de Brasília, nunca português de Portugal. As palavras em inglês têm pronúncia americana nativa, bem caprichada. Leia em voz alta exatamente este texto:",
  heromini: "Você é o Super Benjamin, um super-herói MENINO de uns 7 anos que ensina inglês para crianças bem pequenas, de 3 e 4 anos. Use uma voz bem jovem, leve e aguda, de criança, com muito carinho, bem devagar, sorrindo, como um amiguinho. As partes em português têm sotaque brasileiro de Brasília, nunca português de Portugal. As palavras em inglês têm pronúncia americana nativa, lenta e caprichada. Leia em voz alta exatamente este texto:",
  kids: "Você é a Sunny, uma mascote alegre que ensina inglês para crianças brasileiras pequenas. Fale com muita animação, carinho e sorriso na voz, devagar e bem claro, como uma professora de educação infantil. As partes em português têm sotaque brasileiro de Brasília, nunca português de Portugal. As palavras em inglês têm pronúncia americana nativa, bem caprichada. Leia em voz alta exatamente este texto:",
};
// Voz própria do Super Benjamin (opcional): ElevenLabs.
// Com ELEVENLABS_API_KEY + ELEVENLABS_VOICE_ID na Vercel, as falas do Kids usam essa voz
// (ex.: uma voz infantil autorizada, criada com consentimento dos pais). Sem elas, segue no Gemini.
const EL_KEY = (process.env.ELEVENLABS_API_KEY || "").trim();
const EL_VOICE = (process.env.ELEVENLABS_VOICE_ID || "").trim();
const EL_MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
async function elevenLabs(text, mini) {
  const r = await fetch("https://api.elevenlabs.io/v1/text-to-speech/" + encodeURIComponent(EL_VOICE) + "?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "content-type": "application/json", "xi-api-key": EL_KEY, accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: EL_MODEL, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.55, use_speaker_boost: true, speed: mini ? 0.88 : 0.97 } }),
  });
  if (!r.ok) throw new Error("elevenlabs " + r.status);
  return Buffer.from(await r.arrayBuffer());
}
const ACCESS_CODE = (process.env.DESTRAVA_ACCESS_CODE || "").trim();

// Gemini devolve PCM cru (16-bit, mono, 24 kHz). Aqui colocamos o cabeçalho WAV.
function pcmToWav(pcm, rate = 24000, channels = 1, bits = 16) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * channels * bits / 8, 28); h.writeUInt16LE(channels * bits / 8, 32);
  h.writeUInt16LE(bits, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

module.exports = async (req, res) => {
  if (!process.env.GEMINI_API_KEY && !EL_KEY) return res.status(500).json({ error: "no_tts_key" });

  // GET  /api/tts?s=kids&v=Zephyr&t=texto  -> frases fixas; a resposta fica em cache na CDN
  //       (cada frase é gerada uma vez só e serve todo mundo, sem gastar o limite de novo)
  // POST /api/tts {text, voice, style, code} -> frases livres do Jarvis (sem cache)
  let text, voice, style, cacheable = false;
  if (req.method === "GET") {
    const q = new URL(req.url, "http://x").searchParams;
    if (!STYLES[q.get("s")]) return res.status(400).json({ error: "style" });
    text = String(q.get("t") || "").trim().slice(0, 240);
    voice = VOICES.includes(q.get("v")) ? q.get("v") : DEFAULT_VOICE;
    style = STYLES[q.get("s")];
    cacheable = true;
  } else if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    if (ACCESS_CODE && String(body.code || "").trim() !== ACCESS_CODE) return res.status(401).json({ error: "bad_code" });
    text = String(body.text || "").trim().slice(0, 1500);
    voice = VOICES.includes(body.voice) ? body.voice : DEFAULT_VOICE;
    style = String(body.style || "").slice(0, 600);
  } else return res.status(405).json({ error: "method" });
  if (!text) return res.status(400).json({ error: "empty" });
  const prompt = (style ? style + "\n\n" : "") + text;

  const styleKey = req.method === "GET" ? new URL(req.url, "http://x").searchParams.get("s") : "";
  if (EL_KEY && EL_VOICE && (styleKey === "hero" || styleKey === "heromini")) {
    try {
      const mp3 = await elevenLabs(text, styleKey === "heromini");
      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=31536000, s-maxage=31536000, immutable");
      return res.status(200).send(mp3);
    } catch (e) { console.error(e); if (!process.env.GEMINI_API_KEY) { res.setHeader("Cache-Control", "no-store"); return res.status(502).json({ error: "tts_error" }); } }
  }

  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(TTS_MODEL) + ":generateContent";
    const r = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
        },
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("TTS error", r.status, data && data.error);
      res.setHeader("Cache-Control", "no-store");
      return res.status(r.status === 429 ? 429 : 502).json({ error: r.status === 429 ? "rate_limited" : "tts_error" });
    }
    const part = ((((data.candidates || [])[0] || {}).content || {}).parts || []).find(p => p.inlineData && p.inlineData.data);
    if (!part) { console.error("TTS sem áudio", JSON.stringify(data).slice(0, 500)); return res.status(502).json({ error: "tts_error" }); }
    const m = /rate=(\d+)/.exec(part.inlineData.mimeType || "");
    const wav = pcmToWav(Buffer.from(part.inlineData.data, "base64"), m ? +m[1] : 24000);
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", cacheable ? "public, max-age=31536000, s-maxage=31536000, immutable" : "no-store");
    return res.status(200).send(wav);
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: "tts_error" });
  }
};
