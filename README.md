# Acelera Obra — Formulário de captação

Landing page de formulário multi-etapas (estilo Typeform), inspirada na estrutura do formulário da V4 Company e recriada com a identidade visual da **Acelera Obra**. Focada em lojas de tintas e materiais de construção. Responsiva (mobile-first) — no celular as perguntas ocupam a primeira dobra.

Os leads são enviados para a **Clint CRM**.

## No ar

- **Produção (Vercel):** https://acelera-obra-form.vercel.app
- **Repositório:** https://github.com/ulissesvee-hue/acelera-obra-form

> O deploy da Vercel é **manual**: `git push` não publica sozinho. Rode `vercel deploy --prod` após as alterações (ou conecte o repositório em Project → Settings → Git para deploy automático).

## Estrutura

```
acelera-obra-form/
├── index.html            # página completa (HTML + CSS + JS)
├── api/
│   └── lead.js           # função serverless: recebe o lead e repassa para a Clint
├── assets/
│   ├── logo-dark.png     # logo para fundo escuro (painel lateral)
│   ├── logo-light.png    # logo para fundo claro (cabeçalho do form)
│   └── clientes/         # logos dos clientes (prova social)
└── README.md
```

## Integração com a Clint CRM

O formulário faz `POST /api/lead`, e a função serverless repassa para o webhook da Clint.

**Por que existe essa função no meio** (o navegador não chama a Clint direto):
1. **CORS** — a Clint exige `Content-Type: application/json`, o que dispara preflight e o navegador bloqueia.
2. **Segurança** — o repositório é público. A URL do webhook fica em variável de ambiente, nunca no código; caso contrário qualquer um poderia injetar leads falsos no CRM.

### Configuração (uma vez)

1. Na Clint: **Configurações → Integrações → + Nova Integração → Webhook → Receber → Começar**.
2. Copie a URL gerada e mapeie os campos (a Clint identifica o contato por **e-mail e/ou telefone**).
3. Cadastre a URL como variável de ambiente na Vercel:
   ```bash
   vercel env add CLINT_WEBHOOK_URL production
   # cole a URL quando pedir, depois republique:
   vercel deploy --prod
   ```

### Payload enviado para a Clint

```json
{
  "nome": "João Pereira",
  "email": "joao@construsilva.com.br",
  "telefone": "5548988280871",
  "telefone_formatado": "(48) 98828-0871",
  "tipo_loja": "Material de Construção",
  "loja": "Constru Silva",
  "cidade_estado": "Florianópolis, SC",
  "faturamento": "Acima de R$ 500 mil",
  "objetivo": "Aumentar o Faturamento",
  "urgencia": "Prioridade Alta: preciso resolver o mais rápido possível",
  "origem": "Landing Acelera Obra",
  "enviado_em": "2026-07-16T20:09:05.291Z"
}
```

> ⚠️ **A função serverless só roda na Vercel.** Se a página for publicada no GitHub Pages (ou em qualquer host estático), `/api/lead` não existe e **os leads se perdem em silêncio**. Use a Vercel como endereço oficial.

### Testar localmente

```bash
# terminal 1 — simula a Clint
node -e 'require("http").createServer((q,s)=>{let b="";q.on("data",c=>b+=c);q.on("end",()=>{console.log(b);s.end("{}")})}).listen(9911)'

# terminal 2
CLINT_WEBHOOK_URL="http://localhost:9911" vercel dev --listen 3010
# acesse http://localhost:3010
```

Só o front (sem a API): `python3 -m http.server 8777`.

## Campos coletados

`nome`, `whatsapp`, `email`, `tipo_loja`, `loja`, `cidade_estado`, `faturamento`, `objetivo`, `urgencia`.

## Personalização

- **WhatsApp** — o botão "Chamar especialista da Acelera Obra" (tela final) usa o número no topo do `<script>`:
  ```js
  var WHATSAPP_ACELERA = "5548988280871"; // DDI 55 + DDD + número, só dígitos
  ```
- **Logos dos clientes** — 8 em `assets/clientes/`, exibidas em todas as etapas. Para trocar, edite o bloco `clientsGrid` no `index.html`:
  ```html
  <div class="client"><img src="assets/clientes/arquivo.png" alt="Nome do cliente"></div>
  ```
- **Depoimentos** — array `QUOTES` no `<script>`, um por etapa.
- **Termos de uso / Política de privacidade** — os links do rodapé ainda estão como `#`; aponte para as páginas reais.

## Identidade visual

- Amarelo/dourado: `#F2C633`
- Grafite escuro: `#1D201A`
- Off-white: `#F7F6F1`
- Fonte: Poppins (Google Fonts — requer internet)
