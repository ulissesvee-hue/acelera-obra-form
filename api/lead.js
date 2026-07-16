/**
 * Recebe o lead do formulário e repassa para o webhook da Clint CRM.
 *
 * Por que essa função existe (e o navegador não chama a Clint direto):
 *  1. CORS — a Clint exige Content-Type: application/json, o que dispara
 *     preflight; o navegador bloquearia a chamada.
 *  2. Segurança — o repositório é público. A URL do webhook fica na variável
 *     de ambiente CLINT_WEBHOOK_URL (configurada na Vercel) e NUNCA no código,
 *     senão qualquer um poderia injetar leads falsos no CRM.
 */

const CAMPOS_OBRIGATORIOS = ["nome", "whatsapp", "email"];

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método não permitido" });
  }

  const b = (req.body && typeof req.body === "object") ? req.body : {};

  const faltando = CAMPOS_OBRIGATORIOS.filter((c) => !String(b[c] || "").trim());
  if (faltando.length) {
    return res.status(400).json({ error: "Campos obrigatórios faltando", faltando });
  }

  // Telefone em formato E.164 sem "+" (ex.: 5519998887766) — a Clint usa
  // e-mail e/ou telefone para identificar o contato.
  const digitos = String(b.whatsapp).replace(/\D/g, "");
  const telefone = digitos.startsWith("55") ? digitos : "55" + digitos;

  const payload = {
    nome: String(b.nome).trim(),
    email: String(b.email).trim().toLowerCase(),
    telefone: telefone,
    telefone_formatado: String(b.whatsapp).trim(),
    tipo_loja: b.tipo_loja || "",
    loja: b.loja || "",
    cidade_estado: b.cidade_estado || "",
    faturamento: b.faturamento || "",
    objetivo: b.objetivo || "",
    urgencia: b.urgencia || "",
    origem: "Landing Acelera Obra",
    enviado_em: new Date().toISOString()
  };

  // Rede de segurança: o lead é sempre registrado no log da Vercel ANTES de
  // tentar enviar. Assim, mesmo com o webhook fora do ar ou ainda não
  // configurado, nenhum lead se perde — dá para recuperar em Vercel → Logs.
  console.log("[lead] recebido:", JSON.stringify(payload));

  const webhook = process.env.CLINT_WEBHOOK_URL;
  if (!webhook) {
    console.error("[lead] CLINT_WEBHOOK_URL não configurada — lead salvo apenas no log acima");
    return res.status(500).json({ error: "Webhook não configurado" });
  }

  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const corpo = await r.text().catch(() => "");

    if (!r.ok) {
      // Loga o lead junto do erro para nada se perder silenciosamente.
      console.error("[lead] Clint respondeu", r.status, corpo, JSON.stringify(payload));
      return res.status(502).json({ error: "Falha ao enviar para a Clint", status: r.status });
    }

    console.log("[lead] enviado para a Clint:", payload.email, payload.telefone);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[lead] erro de rede ao chamar a Clint:", e && e.message, JSON.stringify(payload));
    return res.status(502).json({ error: "Erro de rede ao enviar para a Clint" });
  }
};
