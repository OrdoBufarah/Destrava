// Destrava — servidor do Jarvis (função serverless da Vercel).
// Recebe a conversa do app, chama a IA e devolve a resposta do Jarvis em JSON.
// A chave da IA fica só aqui no servidor, nunca no celular.

// Dois "cérebros" possíveis:
//  - GEMINI_API_KEY    -> Google Gemini, plano grátis (sem cartão), bom para testar
//  - ANTHROPIC_API_KEY -> Claude, pago, melhor qualidade para o produto final
// Se as duas existirem, usa o Claude.
const USE_CLAUDE = !!process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.DESTRAVA_MODEL || (USE_CLAUDE ? "claude-haiku-5-5" : "gemini-3.5-flash-lite");
const ACCESS_CODE = (process.env.DESTRAVA_ACCESS_CODE || "").trim(); // opcional: protege seu app

// Lê o JSON da resposta mesmo se vier com texto antes/depois ou dentro de ```json
function parseReply(text) {
  const t = String(text || "").trim();
  try { return JSON.parse(t); } catch (e) {}
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) { try { return JSON.parse(fence[1]); } catch (e) {} }
  const a = t.search(/[\[{]/), b = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch (e) {} }
  return null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  if (!process.env.ANTHROPIC_API_KEY && !process.env.GEMINI_API_KEY) return res.status(500).json({ error: "no_key" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  if (ACCESS_CODE && String(body.code || "").trim() !== ACCESS_CODE) return res.status(401).json({ error: "bad_code" });

  const system = String(body.system || "").slice(0, 20000);
  let messages = Array.isArray(body.messages) ? body.messages : [];
  messages = messages
    .filter(m => m && (m.role === "user" || m.role === "assistant") && String(m.content || "").trim())
    .slice(-24)
    .map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length) return res.status(400).json({ error: "empty" });

  try {
    const text = USE_CLAUDE ? await askClaude(system, messages) : await askGemini(system, messages);
    const reply = parseReply(text);
    if (!reply) return res.status(502).json({ error: "invalid_json" });
    return res.status(200).json({ reply });
  } catch (e) {
    console.error(e);
    const code = e && e.code ? e.code : "upstream_error";
    return res.status(code === "rate_limited" ? 429 : 502).json({ error: code });
  }
};

function fail(status, detail) {
  console.error("AI error", status, detail);
  const err = new Error("ai");
  err.code = status === 429 ? "rate_limited" : (status === 401 || status === 403) ? "no_key" : "upstream_error";
  return err;
}

async function askClaude(system, messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 700, system, messages }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw fail(r.status, data && data.error);
  return (data.content || []).filter(c => c.type === "text").map(c => c.text).join("");
}

async function askGemini(system, messages) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(MODEL) + ":generateContent";
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map(m => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { maxOutputTokens: 700, temperature: 0.8, responseMimeType: "application/json" },
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw fail(r.status, data && data.error);
  const parts = (((data.candidates || [])[0] || {}).content || {}).parts || [];
  return parts.map(p => p.text || "").join("");
}
