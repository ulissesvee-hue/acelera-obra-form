# Acelera Obra — Formulário de captação

Página de formulário multi-etapas (estilo Typeform), inspirada na estrutura do formulário da V4 Company e recriada com a identidade visual da **Acelera Obra**. Focada em lojas de tintas e materiais de construção. Responsiva, com prioridade para o celular.

## Como usar

Abra o `index.html` em qualquer navegador, ou publique a pasta inteira em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages, Hostinger, etc.).

Para testar localmente com servidor:

```bash
cd acelera-obra-form
python3 -m http.server 8777
# acesse http://localhost:8777
```

## Estrutura

```
acelera-obra-form/
├── index.html            # página completa (HTML + CSS + JS)
├── assets/
│   ├── logo-dark.png     # logo para fundo escuro (usada no painel lateral)
│   ├── logo-light.png    # logo para fundo claro (usada no cabeçalho do form)
│   └── clientes/         # coloque aqui as logos dos clientes
└── README.md
```

## O que ainda precisa ser feito / personalizado

0. ~~WhatsApp da Acelera Obra~~ — ✅ configurado: **+55 (48) 98828-0871**. O botão "Chamar especialista da Acelera Obra" (tela final) abre o WhatsApp com uma mensagem pré-preenchida com nome, loja, tipo e cidade/UF do lead. Para trocar o número, edite no topo do `<script>` do `index.html`:
   ```js
   var WHATSAPP_ACELERA = "5548988280871"; // DDI 55 + DDD + número, só dígitos
   ```

1. **Logos dos clientes** — 8 já adicionadas (ABC da Construção, Baratão das Tintas, BM Constru Center, Decor Colors, Geniomar Construções, In9ve, Rede Bem Viver, Rede Construir Rio Pardo), em cards brancos no painel escuro. Os arquivos estão em `assets/clientes/`. Para adicionar/trocar, edite o bloco `clientsGrid` em `index.html`:
   ```html
   <div class="client"><img src="assets/clientes/arquivo.png" alt="Nome do cliente"></div>
   ```
   As logos aparecem só na 1ª etapa (prova social).

2. **Depoimentos** — os textos em `QUOTES` (dentro do `<script>`) são **placeholders**. Substitua pelos depoimentos reais de clientes da Acelera Obra.

3. **Integração do envio** — hoje o formulário só faz `console.log` dos dados. Na função `submitForm()` há um trecho comentado indicando onde enviar `state.answers` para o seu CRM/webhook. Ex.:
   ```js
   fetch("https://SEU-ENDPOINT", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(state.answers)
   });
   ```

4. **Termos de uso / Política de privacidade** — os links no rodapé estão como `#`. Aponte para as páginas reais.

## Campos coletados (`state.answers`)

`nome`, `whatsapp`, `tipo_loja`, `loja`, `cidade_estado`, `faturamento`, `objetivo`, `urgencia`.

## Identidade visual

- Amarelo/dourado: `#F2C633`
- Grafite escuro: `#1D201A`
- Off-white: `#F7F6F1`
- Fonte: Poppins (Google Fonts)

> Observação: a fonte Poppins é carregada do Google Fonts (requer internet). Se precisar funcionar 100% offline, baixe a fonte e sirva localmente.
