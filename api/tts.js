// Destrava — voz do Jarvis (função serverless da Vercel).
// Gera a fala com a IA de voz do Google (Gemini TTS) e devolve um áudio WAV.
// Uma voz só, natural, igual em qualquer aparelho. Usa a mesma GEMINI_API_KEY.

const TTS_MODEL = process.env.DESTRAVA_TTS_MODEL || "gemini-3.1-flash-tts-preview";
const DEFAULT_VOICE = process.env.DESTRAVA_VOICE || "Puck";
const VOICES = ["Puck", "Charon", "Achird", "Sadaltager", "Kore", "Aoede", "Sulafat", "Leda"];
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
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "no_tts_key" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (ACCESS_CODE && String(body.code || "").trim() !== ACCESS_CODE) return res.status(401).json({ error: "bad_code" });

  const text = String(body.text || "").trim().slice(0, 1500);
  if (!text) return res.status(400).json({ error: "empty" });
  const voice = VOICES.includes(body.voice) ? body.voice : DEFAULT_VOICE;
  const style = String(body.style || "").slice(0, 600);
  const prompt = (style ? style + "\n\n" : "") + text;

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
      return res.status(r.status === 429 ? 429 : 502).json({ error: r.status === 429 ? "rate_limited" : "tts_error" });
    }
    const part = ((((data.candidates || [])[0] || {}).content || {}).parts || []).find(p => p.inlineData && p.inlineData.data);
    if (!part) { console.error("TTS sem áudio", JSON.stringify(data).slice(0, 500)); return res.status(502).json({ error: "tts_error" }); }
    const m = /rate=(\d+)/.exec(part.inlineData.mimeType || "");
    const wav = pcmToWav(Buffer.from(part.inlineData.data, "base64"), m ? +m[1] : 24000);
    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(wav);
  } catch (e) {
    console.error(e);
    return res.status(502).json({ error: "tts_error" });
  }
};
