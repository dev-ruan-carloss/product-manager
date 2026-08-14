# Auditoria de segurança — Product Management

**Data:** 2026-08-13

**Escopo:** aplicação Vue 3 (SPA) que consome a FakeStoreAPI, com persistência local de preferências e deploy na Vercel.

---

## 1. XSS

### Ameaça analisada

Conteúdo vindo da FakeStoreAPI, do formulário, da query/rota ou do `localStorage` ser interpretado como HTML/JavaScript no DOM (XSS armazenado ou refletido na interface).

### Superfície analisada

Pesquisa em todo o repositório (`src/`, `tests/`, `index.html`, `public/`):

- `v-html`
- `innerHTML` / `outerHTML` / `insertAdjacentHTML` / `document.write`
- `eval` / `new Function`
- `window.open` / `href` dinâmico com dados externos
- interpolação de título, descrição, categoria, avaliações e mensagens
- `:src` de imagens de produto
- script de boot do tema em `index.html`

Componentes de catálogo, detalhes, formulário, header, footer, favoritos, i18n e estados de erro foram incluídos. A auditoria não se limitou ao catálogo.

### Existência de `v-html`

Não há `v-html` no projeto.

`innerHTML` aparece apenas em testes (`document.body.innerHTML = ''`) para limpeza do jsdom — não é superfície de produção.

### Vulnerabilidade encontrada

Não foi encontrada renderização HTML dinâmica de conteúdo externo.

Havia uma superfície real de XSS via URL de imagem: o valor de `product.image` (API ou usuário) era ligado a `:src` sem validar o protocolo. URLs `javascript:` / `data:` / `vbscript:` poderiam ser atribuídas a `<img>`.

Título, descrição e categoria já usavam interpolação Vue (`{{ }}`) e seriam exibidos como texto. Essa parte não era uma vulnerabilidade confirmada; foi coberta por testes preventivos.

### Estratégia de escaping

O escaping nativo do Vue é a proteção para texto. Não há sanitização indiscriminada de strings.

Valores de título, descrição, categoria, avaliações, mensagens de erro e rótulos i18n são interpolados ou bound a atributos de texto (`alt`, `aria-label`). O navegador recebe entidades escapadas; o usuário vê o payload como texto.

### Necessidade de sanitização

Não há ponto que precise aceitar HTML. Nenhuma biblioteca de sanitização foi adicionada.

### Proteção implementada

- Manter interpolação de texto (sem `v-html`).
- Validar URLs antes de usá-las em `:src` (`toSafeHttpUrl`).
- Validar o payload da API antes de entrar no estado da UI.

### Payloads utilizados

- `<script>alert(1)</script>`
- `<img src=x onerror=alert(1)>`
- `<svg onload=alert(1)>`

### Resultado esperado

O conteúdo é exibido como texto ou a URL é rejeitada. Não há elemento `<script>` criado a partir do payload, nem atributos `onerror`/`onload` injetados.

### Testes preventivos

`tests/security/xss-rendering.test.ts` — card, detalhes, zoom e prévia do formulário.

---

## 2. URLs

### Origem dos dados

- FakeStoreAPI (`product.image`)
- Formulário de criação/edição (campo URL da imagem)
- Assets estáticos da aplicação (logo, favicon) — origem própria, não passam pelo validador de URL externa
- Cliente HTTP (`https://fakestoreapi.com` ou `VITE_API_BASE_URL`) — configuração, não dado de produto

Não há links externos abertos a partir de dados da API. Navegação interna usa Vue Router.

### Protocolos permitidos

`http:` e `https:`.

### Protocolos bloqueados

`javascript:`, `data:`, `vbscript:`, `file:`, `ftp:` e qualquer outro fora da allowlist.

### Comportamento para URLs inválidas

`toSafeHttpUrl` retorna `null` para:

- vazia / só whitespace
- malformada
- com whitespace interno
- acima de 2048 caracteres
- protocolo não permitido

Na UI, imagem inválida não recebe `:src` e cai no estado “imagem indisponível”. No formulário, a prévia não carrega a URL bloqueada e o Yup rejeita o submit.

### Risco de `javascript:` e `data:`

`javascript:` em `src`/`href` pode executar código em navegadores antigos ou em contextos inesperados. `data:` pode carregar HTML/SVG com script. Ambos são rejeitados; a aplicação não precisa de `data:` para imagens.

### Proteção implementada

Utilitário central `src/utils/httpUrl.ts`, usado em:

- normalização do payload da API
- schema Yup da imagem
- `ProductCard`, `ProductDetails`, `ProductImageZoom`, prévia do `ProductForm`

### Testes preventivos

`tests/security/urls.test.ts`.

---

## 3. API

### API tratada como fonte externa

A FakeStoreAPI é a API oficial do desafio, mas não é controlada por este projeto. O frontend não assume que o JSON está correto, completo ou seguro.

### Estrutura validada

Fronteira: `productService` → `normalizeProduct` (`toProduct` / `toProductList` / `toCategoryList` / `isValidProduct`).

Campos de produto:

| Campo | Regra |
|---|---|
| `id` | inteiro positivo seguro |
| `title` | string não vazia após trim; máximo do domínio (150) |
| `price` | number finito, `> 0`, `≤ 999.999,99` |
| `description` | string não vazia após trim; máximo 1000 |
| `category` | string não vazia após trim; máximo 50 |
| `image` | URL HTTP(S) segura |
| `rating` | objeto com `rate` (0–5, finito) e `count` (inteiro `≥ 0`) |
| campos extras | descartados; não entram no modelo `Product` |

GET exige `rating` válido. POST/PUT podem omitir `rating`; nesse caso a normalização usa `{ rate: 0, count: 0 }` — comportamento já existente, porque a FakeStoreAPI frequentemente omite avaliação nas escritas.

### Comportamento diante de payload inválido

- Raiz de `GET /products` que não é array, ou array em que **nenhum** item é utilizável → `AppError` `unexpected`, sem retry, pelo pipeline global. Sem fallback mockado.
- Lista mista: itens inválidos são excluídos; itens válidos alimentam o catálogo (um produto malformado não derruba a listagem).
- `GET /products/:id` inválido → erro `unexpected` (não é 404). 404 HTTP continua `notFound`.
- `GET /products/categories` inválido no mesmo critério.

Não se inventam valores para mascarar erro grave (por exemplo, preço `NaN` virar `0`).

### Testes preventivos

`tests/security/api-payload.test.ts` e a suíte existente de `normalizeProduct` / `productService`.

---

## 4. Headers

Configurados em `vercel.json` para a SPA na Vercel. Arquivos estáticos reais em `dist/` continuam tendo precedência sobre o rewrite; os headers aplicam-se a `/(.*)`.

| Header | Valor (resumo) | Risco mitigado |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'`; scripts só `'self'`; imagens `http:`/`https:`; connect só `'self'` + `https://fakestoreapi.com`; `frame-ancestors 'none'` | XSS, injeção de script, framing, conexões inesperadas |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | vazamento de URL completa em requests cross-origin |
| `Permissions-Policy` | câmera, microfone, geolocalização, pagamento, USB e demais APIs não usadas = `()` | acesso a sensores/periféricos que a app não utiliza |
| `X-Frame-Options` | `DENY` | clickjacking em clientes que ainda olham este header |

### CSP — decisões

- Sem `default-src *` e sem `script-src *`.
- Sem `unsafe-eval` (Vue/Vite em produção não precisam).
- Sem `unsafe-inline` em **scripts**. O boot de tema saiu de script inline em `index.html` para `public/theme-init.js`.
- `style-src 'self' 'unsafe-inline'` é uma exceção justificada: PrimeVue (tema Aura) injeta CSS em runtime; o zoom e o tema também ajustam estilos via CSSOM (`element.style`). Sem isso a UI quebra.
- `img-src 'self' http: https:` — imagens de produto vêm de hosts externos (FakeStoreAPI e URL informada pelo usuário). `data:` não é permitido.
- `connect-src` restrito a `https://fakestoreapi.com`. Se `VITE_API_BASE_URL` apontar para outra origem, a CSP de produção precisará ser atualizada.

### Testes preventivos

`tests/security/headers.test.ts` lê `vercel.json`. A presença efetiva no browser depende do deploy na Vercel.

---

## 5. localStorage

| Chave | Dados | Por que existe | Validação na leitura |
|---|---|---|---|
| `product-management:favorites` | IDs de produto | favoritos entre sessões | somente inteiros positivos na leitura; IDs órfãos descartados após cruzamento com o catálogo |
| `product-management:product-ratings` | mapa `id → 1..5` | avaliação local (API não tem endpoint) | ID positivo + nota 1–5 |
| `product-management:custom-categories` | nomes de categoria | categorias criadas pelo usuário | string, trim, não vazia, máximo 50, dedupe |
| `product-management:theme` | `'light'` \| `'dark'` | preferência de tema | allowlist; senão, tema do sistema |
| `product-management:locale` | `'pt-BR'` \| `'es'` \| `'en'` | idioma | allowlist; senão, `pt-BR` |

Nada disso é tratado como confiável. Qualquer valor pode ser editado no DevTools.

Não são armazenados tokens, credenciais, secrets nem o objeto completo do produto.

Conteúdo com aparência de HTML (ex.: `<script>…</script>` numa categoria) pode ser persistido como **texto** se passar nas regras de tipo/tamanho; a UI escapa na renderização. Não há interpretação como HTML.

### Testes preventivos

`tests/security/localStorage.test.ts` e testes já existentes das stores / `useCustomCategories`.

---

## 6. Limitações

- O frontend valida e reduz a superfície de ataque da interface, mas não constitui uma fronteira de confiança para dados enviados ao servidor.
- A FakeStoreAPI não é uma API sob controle do projeto; POST/PUT são simulados e o JSON remoto pode mudar.
- Security Headers dependem da infraestrutura de deploy (Vercel). `npm run preview` local não aplica `vercel.json`.
- `localStorage` não é armazenamento confiável para dados sensíveis e não deve ser usado para secrets.
- A CSP permite `style-src 'unsafe-inline'` por dependência do PrimeVue/CSSOM.
- `img-src http: https:` é deliberadamente amplo para URLs de produto; o controle fino de protocolo fica em `toSafeHttpUrl`.
- Não há autenticação no produto; não foram criados mecanismos fictícios de auth, criptografia ou rate limiting no cliente.

---

## 7. Itens avaliados que não exigiram alteração

- Ausência de `v-html` e de HTML dinâmico — manter interpolação.
- Sanitização HTML — desnecessária.
- Favoritos, ratings, tema e locale já validavam a leitura do `localStorage`.
- IDs de favoritos ainda passam por validação de inteiro positivo; após o catálogo carregar, IDs órfãos são descartados (decisão 35.25).
- `parseProductId` já rejeitava parâmetros de rota não numéricos.
- Pipeline global de erros (`AppError`) — reutilizado para payload inválido, sem canal paralelo.
- Sem DELETE, sem mudança de regras de catálogo/favoritos/i18n além da validação de entrada.
